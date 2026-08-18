"""What happened before a call finally succeeded, or gave up.

Worth its own context because the interesting part is usually not the last
attempt but the refresh in the middle of it: a token refresh that was attempted
and did not work is the actual cause of the failure that follows, and without
this the log only shows the symptom.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class RetryContext(Context):
    type = "retry"

    def __init__(
        self,
        attempts: int = 0,
        triggered_by_status: int | None = None,
        refresh_attempted: bool = False,
        refresh_succeeded: bool | None = None,
    ) -> None:
        self.attempts = attempts
        self.triggered_by_status = triggered_by_status
        self.refresh_attempted = refresh_attempted
        self.refresh_succeeded = refresh_succeeded

    def to_json(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "attempts": self.attempts,
            "triggered_by_status": self.triggered_by_status,
            "refresh_attempted": self.refresh_attempted,
            "refresh_succeeded": self.refresh_succeeded,
        }
