"""Business logic for the current user.

Reads the operating-system account. Nothing is stored and nothing is invented -
if the OS cannot name the user, the app says so rather than guessing.
"""

from __future__ import annotations

import getpass
import os
import sys

from db import users as users_repository
from models import User
from utils import Tracking


def current_user(tracking: Tracking) -> User:
    username = _username(tracking)
    return User(username=username, display_name=_display_name(tracking, username))


def ensure_current_user(tracking: Tracking) -> int:
    """Make sure this operating-system user has a row, and return its id.

    Everything stored per user hangs off this id. A shared install means a user
    can appear at any time, so this runs on every start rather than once.
    """
    user = current_user(tracking)
    return users_repository.ensure_user(user.username, user.display_name)


def _username(tracking: Tracking) -> str:
    try:
        return getpass.getuser()
    except Exception as error:
        # getuser() raises when no account can be determined, e.g. in a
        # container without a passwd entry. Recovering is right - the app works
        # under a placeholder name - but it should not happen silently: every
        # stored preference hangs off this name.
        tracking.note(
            f"the operating system could not name the current user: {error}",
            level="warning",
            values={"fallback": "unknown"},
        )
        return "unknown"


def _display_name(tracking: Tracking, username: str) -> str:
    """The user's full name when the OS knows it, otherwise the login name."""
    if sys.platform != "win32":
        try:
            import pwd

            # GECOS holds the full name, sometimes followed by comma-separated
            # office/phone fields nobody fills in any more.
            gecos = pwd.getpwnam(username).pw_gecos.split(",")[0].strip()
            if gecos:
                return gecos
        except Exception as error:
            # Only a nicety, so falling back is fine. Recorded at debug: it is
            # normal on plenty of systems and only interesting next to a failure.
            tracking.note(f"no full name for {username}: {error}")

    return os.environ.get("USERNAME") or username
