"""The window, as its own process.

Separate from the background process on purpose, and not for tidiness. One
process cannot reliably hold a tray icon and build its window later: pystray and
pywebview both drive the same macOS application object, and taking the run loop
from one to give it to the other fails about half the time - sometimes with an
abort, sometimes with a hang. Measured, repeatedly, before this split existed.

Splitting them removes the conflict rather than working around it. The
background process never imports pywebview, so it never touches that machinery,
and this process never creates a tray icon.

It also does something the single-process design could not: closing the window
ends this process, so the roughly 250 MB the webview costs goes back to the
operating system instead of staying resident for the rest of the session.

Commands arrive on standard input, one per line - no port, no signal handling,
and it closes by itself when the parent goes away.
"""

from __future__ import annotations

import sys
import threading

TITLE = "anydeck"

_window = None


def _read_commands() -> None:
    """Act on what the parent sends. Ends when the pipe closes.

    `show` is what the parent sends when the user asks for a window that is
    already open - this process cannot raise itself from outside.
    """
    for line in sys.stdin:
        command = line.strip()

        if command == "show" and _window is not None:
            _window.show()
        elif command == "quit":
            if _window is not None:
                _window.destroy()
            return

    # The pipe closed: the parent is gone, and a window with nothing behind it
    # is not worth keeping.
    if _window is not None:
        _window.destroy()


def run(url: str) -> None:
    """Show the window and stay until it is closed."""
    global _window

    import webview

    _window = webview.create_window(TITLE, url, width=1100, height=760, min_size=(880, 560))

    threading.Thread(target=_read_commands, name="commands", daemon=True).start()

    # Returns when the window closes - which is when this process should end.
    webview.start()
