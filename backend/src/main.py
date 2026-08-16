"""The process: device listener, HTTP server, tray icon, window.

This is what a user starts. `app.py` only builds the FastAPI object; it is
imported by uvicorn workers and by the packaged executable, so anything started
at import time would start once per import. This file owns the process instead.

Three things run at once, and where they run is not a preference:

    listener   own thread, started first, never stopped - it is the point of
               the program and has to outlive the window
    server     own thread, so a busy request cannot freeze the window
    tray + UI  the main thread, because macOS will not run AppKit anywhere else

The window is not created at startup. That is measured, not assumed: creating a
hidden window costs nothing, but starting the GUI loop costs about 130 MB
whether or not anything is ever shown. So after a reboot only the listener, the
server and the tray are running. The window is built the first time the user
asks for one, and from then on hidden and shown rather than destroyed - closing
it frees nothing and leaks a renderer process per cycle.
"""

from __future__ import annotations

import threading

import webview

from app import HOST, PORT, app

WINDOW_TITLE = "anydeck"
WINDOW_URL = f"http://{HOST}:{PORT}/"

# The one window this process will ever have, or None until it is first opened.
_window: webview.Window | None = None


# --- the background half ----------------------------------------------------


def start_listener() -> threading.Thread:
    """Watch connected input devices and turn their signals into actions.

    Not implemented. This is where the HID source, the mapping lookup and the
    action dispatch get wired together. A daemon thread so it cannot keep the
    process alive after the user quits.
    """

    def run() -> None:
        raise NotImplementedError("device listener")

    thread = threading.Thread(target=run, name="listener", daemon=True)
    thread.start()
    return thread


def start_server() -> threading.Thread:
    """Serve the API and the frontend on 127.0.0.1, never on 0.0.0.0."""
    import uvicorn

    server = uvicorn.Server(uvicorn.Config(app, host=HOST, port=PORT, log_level="warning"))
    thread = threading.Thread(target=server.run, name="server", daemon=True)
    thread.start()
    return thread


# --- the window -------------------------------------------------------------


def open_window() -> None:
    """Show the configuration window, building it the first time.

    Called from the tray menu - that is the only way in, since the program has
    no dock icon of its own to click.
    """
    global _window

    if _window is not None:
        _window.show()
        return

    _window = webview.create_window(WINDOW_TITLE, WINDOW_URL, width=1100, height=760)

    # Closing must hide, not destroy. Returning False from this handler cancels
    # the close, so the window survives and the next open is instant.
    def on_closing() -> bool:
        _window.hide()
        return False

    _window.events.closing += on_closing

    # Blocks for the rest of the process's life: pywebview's loop ends only when
    # its last window is destroyed, and this one never is.
    webview.start()


def hide_window() -> None:
    if _window is not None:
        _window.hide()


# --- the tray ---------------------------------------------------------------


def build_tray():
    """The menu bar icon. Its menu is the whole user interface until a window
    is opened.

    On macOS the icon has to share the NSApplication that pywebview will later
    drive, otherwise the two fight over the main thread.
    """
    raise NotImplementedError("tray icon")


def main() -> None:
    start_listener()
    start_server()

    # Hands the main thread to the tray. Opening the window from the tray menu
    # takes the thread over from there - see open_window.
    tray = build_tray()
    tray.run()


if __name__ == "__main__":
    main()
