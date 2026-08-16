"""Bringing the window to the front, from wherever the request comes from.

This exists for one case: the program is already running in the background and
the user starts it again - by double-clicking it, say. The second process
notices the first and asks it, over the API, to show itself. Then it exits.

The runtime registers the actual callback here rather than the API importing the
runtime directly, so the layering holds: an API module still calls a service,
and the service knows nothing about tray icons or GUI loops.
"""

from __future__ import annotations

from collections.abc import Callable

_show: Callable[[], None] | None = None


def register(show: Callable[[], None]) -> None:
    global _show
    _show = show


def show() -> bool:
    """Ask for the window. False when nothing can answer - e.g. under uvicorn
    alone during development, where there is no window at all."""
    if _show is None:
        return False
    _show()
    return True
