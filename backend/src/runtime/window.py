"""The configuration window.

Created the first time it is asked for, and hidden rather than destroyed from
then on. Both halves of that are measured, not assumed:

- A window that exists but is hidden costs nothing. Starting the GUI loop costs
  about 130 MB whether or not anything is ever shown, so the loop is not started
  until the user asks for a window.
- Destroying a window frees none of that and leaks a renderer process per cycle
  (three open/close rounds: ~195 MB and climbing, against ~150 MB flat when
  hiding).
"""

from __future__ import annotations

import os

from app import HOST, PORT

TITLE = "anydeck"

# Points at the built frontend served by our own backend. During frontend
# development it is set to the vite server instead, which is the only way to get
# hot reloading inside the real window - see scripts/dev.py --app.
DEFAULT_URL = os.environ.get("ANYDECK_WINDOW_URL", f"http://{HOST}:{PORT}/")

_window = None


def exists() -> bool:
    return _window is not None


def open() -> None:  # noqa: A001 - the verb is the clearest name here
    """Create the window and hand the main thread to the GUI loop.

    Only ever called from the main thread. It does not return until the window
    is destroyed, which happens on quit and at no other time.
    """
    global _window

    if _window is not None:
        _window.show()
        return

    # Imported here on purpose, never at module level. Importing pywebview's
    # cocoa backend sets the process to a regular, dock-icon application; doing
    # that at import time would put an icon in the dock during the background
    # phase, when there is no window at all.
    import webview

    _window = webview.create_window(
        TITLE, DEFAULT_URL, width=1100, height=760, min_size=(880, 560)
    )

    # Returning False cancels the close, so the window survives and reopening is
    # instant. Only `closing` and `initialized` have their return value honoured
    # at all - the other events run their handlers on a separate thread and
    # discard the result.
    def on_closing() -> bool:
        hide()
        return False

    _window.events.closing += on_closing

    webview.start()


def show() -> None:
    if _window is not None:
        _window.show()


def hide() -> None:
    if _window is not None:
        _window.hide()


def destroy() -> None:
    """Tear the window down for good.

    Only on quit. Destroying the last window is also what stops the GUI loop, so
    this is what lets `open()` return and the process end.
    """
    global _window

    if _window is not None:
        _window.destroy()
        _window = None
