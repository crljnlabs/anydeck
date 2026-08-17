"""The process. This is what a user starts.

`app.py` only builds the FastAPI object - it is imported by uvicorn workers and
by the packaged executable alike, so anything started at import time would start
once per import. This file owns the process instead, and mostly just wires the
parts together.

It has two shapes, chosen by argument:

    (default)   the background: device listener, HTTP server, tray icon
    --window    a window, and nothing else

They are separate processes on purpose, and not for tidiness. One process cannot
reliably hold a tray icon and build its window later - pystray and pywebview both
drive the same macOS application object, and handing the run loop from one to the
other fails about half the time. Splitting them removes the conflict instead of
working around it, and it means closing the window actually gives its ~250 MB
back rather than leaving it resident.

Started with --background the tray comes up alone; that is how the login item
starts it. Started by hand it opens a window straight away, because a program
that appears to do nothing when double-clicked is a broken program.
"""

from __future__ import annotations

import argparse
import logging
import sys
import urllib.error
import urllib.request

from app import HOST, PORT
from runtime import listener, server, tray, window
from service import register_window
from utils import setup_logging

log = logging.getLogger("anydeck.main")


def hand_over_to_running_instance() -> bool:
    """Ask an already running anydeck to show itself. True if one answered.

    Cheaper and more honest than a lock file: the port is the resource that
    actually collides, so the port is what gets asked.
    """
    if not server.is_running():
        return False

    try:
        request = urllib.request.Request(
            f"http://{HOST}:{PORT}/api/window/show", method="POST"
        )
        urllib.request.urlopen(request, timeout=5).close()
    except (urllib.error.URLError, OSError):
        # Something is on the port but it is not us, or it is not answering.
        # Carrying on would fail at bind time with a far less clear message.
        print(f"error: port {PORT} is in use by something else", file=sys.stderr)
        raise SystemExit(1) from None

    return True


def run_background(*, open_window_now: bool) -> None:
    log.info("background starting")
    listener.start()
    server.start()

    # Lets the API open the window - used when a second instance hands over.
    register_window(window.open)

    icon = tray.build(on_quit=lambda: icon.stop())

    if open_window_now:
        window.open()

    try:
        # Owns the main thread until the tray is stopped.
        tray.run(icon)
    finally:
        # After the loop has ended, so this runs on the main thread with nothing
        # else competing for it.
        log.info("shutting down")
        window.close()
        listener.stop()
        server.stop()


def main() -> None:
    parser = argparse.ArgumentParser(description="Run anydeck.")
    parser.add_argument(
        "--background",
        action="store_true",
        help="start in the menu bar without opening a window (used by autostart)",
    )
    parser.add_argument(
        "--window",
        metavar="URL",
        help=argparse.SUPPRESS,  # started by the background process, not by hand
    )
    args = parser.parse_args()

    if args.window:
        # A window and nothing else: no tray, no server, no listener.
        setup_logging("window")
        from runtime import window_process

        window_process.run(args.window)
        log.info("window closed")
        return

    setup_logging("background")

    if hand_over_to_running_instance():
        log.info("handed over to the instance already running")
        return

    run_background(open_window_now=not args.background)


if __name__ == "__main__":
    main()
