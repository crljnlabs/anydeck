"""A named part of an operation - and, together, the shape of what happened.

`name` is the innermost step, kept on its own because grouping by it is cheap.
`path` is the whole ancestry from the outside in, which is what makes the
timeline a tree rather than a flat list: a step entered inside another step
appends to the path instead of replacing it, so "read the file" recorded inside
"load icons" keeps the fact that it happened there.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class StepContext(Context):
    type = "step"

    def __init__(self, name: str | None, path: list[str] | None = None) -> None:
        self.name = name
        # A path is expected, but a step recorded without one still describes
        # itself correctly as a path of length one.
        self.path = list(path) if path else ([name] if name else [])

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "name": self.name, "path": self.path}
