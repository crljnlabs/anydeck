"""Free text about what happened, in two registers.

`internal` is for whoever is reading the log file: technical, specific, and
allowed to name things the user has never heard of. `user` is what may be shown
in the interface. One message is usually enough - `user` falls back to
`internal` - and the two are only worth separating when the honest technical
sentence would be useless or alarming to read.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class MessageContext(Context):
    type = "message"

    def __init__(self, internal: str, user: str | None = None) -> None:
        self.internal = internal
        self.user = user if user is not None else internal

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "internal": self.internal, "user": self.user}

    def to_safe_json(self) -> dict[str, Any]:
        # Only the user register leaves. `user` already falls back to `internal`,
        # so a single-message entry is not silently lost here.
        return {"type": self.type, "user": self.user}
