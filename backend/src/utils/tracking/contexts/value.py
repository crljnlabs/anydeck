"""Whatever data explains the entry.

The general-purpose holder: a dictionary of what was resolved, a single number,
several values at once. It exists so that recording a useful detail never
requires inventing a context type for it first.

No filtering happens here - the value goes to the log file and to the safe
output alike. Something that must not leave the process belongs on an entry
marked `internal`, which is dropped from the safe output as a whole.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class ValueContext(Context):
    type = "value"

    def __init__(self, *values: Any) -> None:
        # One argument reads back as itself rather than as a list of one, which
        # is the common case: track("...", {"user": 3}).
        self.value = values[0] if len(values) == 1 else list(values)

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "value": self.value}
