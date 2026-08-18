"""Which action source an entry belongs to.

The outermost of the three labels. It is deliberately named after the thing it
will mostly carry rather than after its position in the hierarchy: an entry
recorded while talking to Home Assistant should say so in one word.

Nothing forces it to be set. A route that has no action source - settings, the
window, the startup sequence - simply never opens this scope, and no empty label
is carried around because of it.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class ActionSourceContext(Context):
    type = "action_source"

    def __init__(self, name: str) -> None:
        self.name = name

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "name": self.name}
