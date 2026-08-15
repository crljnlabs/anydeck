"""Data layer: the person the app is running for."""

from __future__ import annotations

from pydantic import BaseModel


class User(BaseModel):
    """The operating-system account anydeck is running under.

    anydeck has no accounts of its own and no sign-in. The OS already knows who
    is logged in, and its answer is the one that matters: a system-wide install
    stores each user's configuration under their own home directory, so every
    user gets their own profile without anyone creating one.
    """

    username: str
    display_name: str
    initials: str
