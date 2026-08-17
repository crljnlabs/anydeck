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

from models import WindowState

_show: Callable[[], None] | None = None


def register_window(show: Callable[[], None]) -> None:
    global _show
    _show = show


def show_window() -> WindowState:
    """Ask for the window.

    Not shown when nothing can answer - during development the backend often
    runs on its own, with the interface in a browser tab and no window process
    anywhere. That is a normal state to report, not a failure.
    """
    if _show is None:
        return WindowState(shown=False)
    _show()
    return WindowState(shown=True)
