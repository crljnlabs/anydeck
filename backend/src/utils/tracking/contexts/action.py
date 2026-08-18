"""Which action an entry belongs to.

The middle label: what is being done, where the action source is who is doing
it. `action_id` is optional and is the join back to the stored configuration -
the same action can be bound to several elements, and an entry that carries the
id can be traced to the one binding that produced it.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class ActionContext(Context):
    type = "action"

    def __init__(self, name: str | None, action_id: str | None = None) -> None:
        self.name = name
        self.action_id = action_id

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "name": self.name, "action_id": self.action_id}
