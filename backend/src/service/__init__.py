"""Application logic: everything anydeck knows how to do.

A service answers a question or carries out a change, and returns a model. It
never touches HTTP - it does not know whether it was reached over the API, from
the tray menu, or from a script - and the API never does the service's work.

Every service takes a Tracking first. It is a parameter rather than something
found at call time on purpose: a function that records what it did should say so
in its signature, and the caller decides what the timeline covers - one request,
one menu click, one startup.

The whole surface is listed below, so this file answers "what can the backend
actually do" in one place, and callers write `from service import get_settings`
rather than hunting for the module it happens to live in.
"""

from service.autostart import get_autostart, set_autostart
from service.settings import get_settings, update_settings
from service.user import current_user, ensure_current_user
from service.window import register_window, show_window

__all__ = [
    "current_user",
    "ensure_current_user",
    "get_autostart",
    "get_settings",
    "register_window",
    "set_autostart",
    "show_window",
    "update_settings",
]
