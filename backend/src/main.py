"""The process: tray icon, device listener, HTTP server, and the window.

Skeleton only - nothing here is implemented yet, the shape is what matters.

This is deliberately not `app.py`. That module is imported by uvicorn workers
and by the packaged executable, and anything started at import time would start
once per import. This file is what actually owns the process.

Three things run at once, and the order matters:

  listener   its own thread, started first and never stopped - it is the whole
             point of the program and has to survive the window being closed
  server     its own thread, so the window and the API do not block each other
  tray + UI  the main thread, because on macOS AppKit will not run anywhere else

The window is NOT created at startup. That is measurable, not a preference:
creating a hidden window costs nothing, but starting the GUI loop costs about
130 MB whether or not anything is ever shown. So after a reboot only the
listener, the server and the tray are running, and the window is built the
first time the user asks for one. From then on it is hidden and shown rather
than destroyed and rebuilt, because destroying it frees nothing and leaks a
renderer process per cycle.
"""

from __future__ import annotations

HOST = "127.0.0.1"
PORT = 8765


def start_listener() -> None:
    """Watch for input devices and translate their signals into actions.

    Runs in a daemon thread for the whole life of the process. Not implemented:
    this is where the HID source, the mapping lookup and the action dispatch
    will be wired together.
    """
    raise NotImplementedError


def start_server() -> None:
    """Serve the API and the frontend on 127.0.0.1, in a background thread."""
    raise NotImplementedError


def open_window() -> None:
    """Show the configuration window, creating it on first use.

    Called from the tray menu. The first call pays for the webview; every later
    call only shows the window that already exists.
    """
    raise NotImplementedError


def hide_window() -> None:
    """Hide the window without destroying it. See the note above on why."""
    raise NotImplementedError


def start_tray() -> None:
    """Put the icon in the menu bar / system tray.

    On macOS this has to share the NSApplication that the webview will later
    drive, otherwise the two fight over the main thread.
    """
    raise NotImplementedError


def main() -> None:
    """Start the background half, then hand the main thread to the tray."""
    raise NotImplementedError


if __name__ == "__main__":
    main()
