"""The device listener - the point of the whole program.

Not implemented yet; this is the seam Punkt B fills in. It exists now so the
process has the shape it will keep: the listener starts before anything else and
outlives the window, because a device has to keep working while the interface is
closed.
"""

from __future__ import annotations

import threading

from utils import Tracking

_thread: threading.Thread | None = None


def start(tracking: Tracking) -> threading.Thread | None:
    """Start watching for input devices.

    Returns None while there is nothing to run. Deliberately not raising: the
    program is useful before the listener exists - the window, the settings and
    the tray all work - and a placeholder that takes the process down with it
    would make that impossible to see.

    `tracking` here is the startup timeline. Once this thread does something, each
    device event will open its own instead: an event is its own entry point, and a
    timeline that covered every keypress since login would answer nothing.
    """
    global _thread

    tracking.note("no device listener yet; nothing is being watched")

    # TODO(Punkt B): open the HID source, read reports, look the mapping up and
    # dispatch the action. A daemon thread, so quitting does not wait for it.
    return _thread


def stop() -> None:
    """Close the device handles. Nothing to close yet."""
