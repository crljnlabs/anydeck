"""Who owns the main thread.

This is the awkward part of the program, and it is awkward for one reason: the
tray icon and the window both want the main thread, and the window is not
created until someone asks for one. So the main thread has to run a loop with no
window in it, and hand over cleanly when a window is finally wanted.

macOS makes this specific. pystray and pywebview both drive the same
`NSApplication`, and each assumes it owns the loop:

- `pystray.Icon.run()` removes the status item when its loop ends. Since ending
  that loop is exactly how the window gets opened, `run()` cannot be used at
  all - `run_detached()` only marks the icon ready and leaves the status item
  standing, which is what makes the handover survivable.
- pywebview only calls `app.run()` `if not app.isRunning()`, so the loop has to
  be stopped before `webview.start()`, not merely idle.
- `stop:` sets a flag that is checked when the loop next handles an event, so
  stopping means posting a dummy event behind it or nothing happens.

Windows and Linux are structurally simpler - `run_detached()` starts a real
background thread there, so the main thread can just wait - but that path is
UNVERIFIED. Only macOS has been measured and run.
"""

from __future__ import annotations

import sys
import threading

from runtime import window

_TRAY = "tray"
_WINDOW = "window"


class _Lifecycle:
    """Shared state and the two questions every implementation answers."""

    def __init__(self) -> None:
        self._phase = _TRAY
        self._quitting = False

    @property
    def quitting(self) -> bool:
        return self._quitting

    def tray_options(self) -> dict:
        """Extra keyword arguments for `pystray.Icon`."""
        return {}

    def request_window(self) -> None:
        """Called from the tray. Show the window, creating it if needed."""
        if self._phase == _WINDOW:
            window.show()
        else:
            self._leave_background()

    def request_quit(self) -> None:
        self._quitting = True
        if self._phase == _WINDOW:
            # Destroying the last window is also what ends the GUI loop, which
            # is what lets run() return.
            window.destroy()
        else:
            self._leave_background()

    def run(self, *, open_window_now: bool) -> None:
        if not open_window_now:
            self._run_background()
            if self._quitting:
                return

        self._phase = _WINDOW
        # Does not return until the window is destroyed.
        window.open()

    # --- for subclasses ---

    def _run_background(self) -> None:
        raise NotImplementedError

    def _leave_background(self) -> None:
        raise NotImplementedError


class _CocoaLifecycle(_Lifecycle):
    """macOS. Verified: this is the sequence the Phase 0 spike proved."""

    def __init__(self) -> None:
        super().__init__()
        import AppKit

        self._AppKit = AppKit
        # Created before pywebview is imported, and handed to pystray, so both
        # end up driving the same application object rather than two.
        self._app = AppKit.NSApplication.sharedApplication()

    def tray_options(self) -> dict:
        return {"darwin_nsapplication": self._app}

    def _run_background(self) -> None:
        # Tray only: no window, no webview, ~28 MB.
        self._app.run()

    def _leave_background(self) -> None:
        app = self._app
        app.performSelectorOnMainThread_withObject_waitUntilDone_("stop:", None, False)

        # `stop:` only raises a flag; the loop notices it the next time it
        # handles an event. Without something to handle, an idle app would sit
        # there until the user happened to move the mouse over the menu bar.
        AppKit = self._AppKit
        event = AppKit.NSEvent.otherEventWithType_location_modifierFlags_timestamp_windowNumber_context_subtype_data1_data2_(
            AppKit.NSApplicationDefined,
            AppKit.NSMakePoint(0, 0),
            0,
            0,
            0,
            None,
            0,
            0,
            0,
        )
        app.postEvent_atStart_(event, True)


class _GenericLifecycle(_Lifecycle):
    """Windows and Linux. UNVERIFIED - never run on either platform.

    Simpler in shape: pystray runs its own loop on a background thread there, so
    the main thread only has to wait for the word to build a window.
    """

    def __init__(self) -> None:
        super().__init__()
        self._wake = threading.Event()

    def _run_background(self) -> None:
        self._wake.wait()

    def _leave_background(self) -> None:
        self._wake.set()


def lifecycle() -> _Lifecycle:
    return _CocoaLifecycle() if sys.platform == "darwin" else _GenericLifecycle()
