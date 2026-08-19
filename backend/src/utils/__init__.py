"""Small things the other layers need and none of them owns.

Where the program finds out where it is installed, where it may write, how to
start a copy of itself, how to record what it did, and how to fail in a way
somebody can read.

General-purpose, not subject-free: `tracking` names an action source and an
action, because a timeline that cannot say what it was recording is of no use to
anyone. What makes it belong here is that it is not tied to one caller - a route,
a device event and the startup sequence all record the same way.

Anything that decides what anydeck should *do* belongs in `service`.
"""

from utils.error import AnydeckError, DecryptionError, SecretsError
from utils.launch import self_command
from utils.logging import log_path, setup_logging
from utils.paths import data_dir, database_path, frontend_dir, icons_dir
from utils.tracking import Tracker, Tracking, carry_context, write_tracking

__all__ = [
    "AnydeckError",
    "DecryptionError",
    "SecretsError",
    "Tracker",
    "Tracking",
    "carry_context",
    "data_dir",
    "database_path",
    "frontend_dir",
    "icons_dir",
    "log_path",
    "self_command",
    "setup_logging",
    "write_tracking",
]
