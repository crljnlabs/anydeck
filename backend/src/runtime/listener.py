"""The device listener - the point of the whole program.

Not implemented yet; this is the seam Punkt B fills in. It exists now so the
process has the shape it will keep: the listener starts before anything else and
outlives the window, because a device has to keep working while the interface is
closed.
"""

from __future__ import annotations

import threading

_thread: threading.Thread | None = None


def start() -> threading.Thread | None:
    """Start watching for input devices.

    Returns None while there is nothing to run. Deliberately not raising: the
    program is useful before the listener exists - the window, the settings and
    the tray all work - and a placeholder that takes the process down with it
    would make that impossible to see.
    """
    global _thread

    # TODO(Punkt B): open the HID source, read reports, look the mapping up and
    # dispatch the action. A daemon thread, so quitting does not wait for it.
    return _thread


def stop() -> None:
    """Close the device handles. Nothing to close yet."""
