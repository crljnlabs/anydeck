"""Business logic for the current user.

Reads the operating-system account. Nothing is stored and nothing is invented -
if the OS cannot name the user, the app says so rather than guessing.
"""

from __future__ import annotations

import getpass
import os
import sys

from models.user import User


def current_user() -> User:
    username = _username()
    display_name = _display_name(username)
    return User(
        username=username,
        display_name=display_name,
        initials=_initials(display_name),
    )


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


def _initials(display_name: str) -> str:
    parts = [part for part in display_name.replace("-", " ").split() if part]
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()
