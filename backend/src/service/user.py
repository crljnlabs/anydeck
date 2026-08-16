"""Business logic for the current user.

Reads the operating-system account. Nothing is stored and nothing is invented -
if the OS cannot name the user, the app says so rather than guessing.
"""

from __future__ import annotations

import getpass
import os
import sys

from db import users as users_repository
from models.user import User


def current_user() -> User:
    username = _username()
    return User(username=username, display_name=_display_name(username))


def ensure_current_user() -> int:
    """Make sure this operating-system user has a row, and return its id.

    Everything stored per user hangs off this id. A shared install means a user
    can appear at any time, so this runs on every start rather than once.
    """
    user = current_user()
    return users_repository.ensure_user(user.username, user.display_name)


def _username() -> str:
    try:
        return getpass.getuser()
    except Exception:
        # getuser() raises when no account can be determined, e.g. in a
        # container without a passwd entry.
        return "unknown"


def _display_name(username: str) -> str:
    """The user's full name when the OS knows it, otherwise the login name."""
    if sys.platform != "win32":
        try:
            import pwd

            # GECOS holds the full name, sometimes followed by comma-separated
            # office/phone fields nobody fills in any more.
            gecos = pwd.getpwnam(username).pw_gecos.split(",")[0].strip()
            if gecos:
                return gecos
        except Exception:
            pass

    return os.environ.get("USERNAME") or username
