"""How long something took, and when it happened.

Two clocks on purpose. `started_at` comes from the wall clock, because the only
question it answers is "when was this" and that has to line up with the rest of
the log file. `duration_ms` comes from a monotonic clock, which cannot jump
backwards when the system time is corrected mid-operation - a wall-clock
subtraction can, and a negative duration in a log is worse than no duration.
"""

from __future__ import annotations

import time
from typing import Any

from utils.tracking.contexts.base import Context


class TimingContext(Context):
    type = "timing"

    def __init__(
        self,
        started_at: float | None = None,
        duration_ms: float | None = None,
    ) -> None:
        self.started_at = started_at
        self.duration_ms = duration_ms
        self._monotonic_start: float | None = None

    @classmethod
    def start(cls) -> TimingContext:
        timing = cls(started_at=time.time())
        timing._monotonic_start = time.perf_counter()
        return timing

    def stop(self) -> TimingContext:
        if self._monotonic_start is not None:
            self.duration_ms = round(
                (time.perf_counter() - self._monotonic_start) * 1000, 3
            )
        return self

    def to_json(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "started_at": self.started_at,
            "duration_ms": self.duration_ms,
        }
