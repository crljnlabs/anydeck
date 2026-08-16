"""The process. This is what a user starts.

`app.py` only builds the FastAPI object - it is imported by uvicorn workers and
by the packaged executable alike, so anything started at import time would start
once per import. This file owns the process instead, and does nothing but wire
the four parts of it together:

    listener   own thread, started first, outlives the window
    server     own thread, so a busy request cannot freeze the interface
    tray       the menu bar icon
    lifecycle  owns the main thread and decides when a window gets built

Started with --background it stays in the menu bar - that is how the login item
starts it. Started by hand it opens the window straight away, because a program
that appears to do nothing when double-clicked is a broken program.
"""

from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.request

from app import HOST, PORT
from runtime import listener, server
from runtime.lifecycle import lifecycle as build_lifecycle
from runtime import tray as tray_runtime
from service import window as window_service


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
        urllib.request.urlopen(request, timeout=2).close()
    except (urllib.error.URLError, OSError):
        # Something is on the port but it is not us, or it is not answering.
        # Carrying on would fail at bind time with a far less clear message.
        print(f"error: port {PORT} is in use by something else", file=sys.stderr)
        raise SystemExit(1) from None

    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Run anydeck.")
    parser.add_argument(
        "--background",
        action="store_true",
        help="start in the menu bar without opening the window (used by autostart)",
    )
    args = parser.parse_args()

    if hand_over_to_running_instance():
        return

    listener.start()
    server.start()

    life = build_lifecycle()
    # Lets the API bring the window forward when a second instance hands over.
    window_service.register(life.request_window)

    tray = tray_runtime.build(life)
    tray_runtime.start(tray)

    try:
        life.run(open_window_now=not args.background)
    finally:
        tray.visible = False
        listener.stop()
        server.stop()


if __name__ == "__main__":
    main()
