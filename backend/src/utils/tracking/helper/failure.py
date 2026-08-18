"""Turning a failure into a timeline entry.

Shared by AnydeckError and by anything that has to record a failure it did not
raise itself, so that a failed operation looks the same however it was caught.

An entry can be passed in rather than created here. That is for the case where an
operation had already recorded something useful about itself - resolved inputs,
a partial result - before it went wrong: enriching that entry keeps one operation
to one line, where building a second one would leave the useful half orphaned.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.tracker import Tracker


def build_failure_tracker(
    tracking: Any,
    message: str,
    *,
    tracker: Tracker | None = None,
    inner_error: BaseException | None = None,
    user_message: str | None = None,
    i18n: dict[str, Any] | str | None = None,
) -> Tracker:
    """Build the entry for a failure and put it in the timeline."""
    failure = tracker if tracker is not None else Tracker()
    failure.level = "error"

    # Unconditional: it adds an HTTP context when the cause was a request and
    # nothing at all when it was not, so the caller needs no test for it.
    failure.add_error(inner_error)
    failure.add_message(message, user_message)

    key, params = _split_i18n(i18n)
    if key:
        failure.add_i18n(key, params)

    # A Tracking is not always at hand yet - the error is still worth building,
    # it just has nowhere to be recorded.
    if tracking is not None:
        tracking.add(failure)

    return failure


def _split_i18n(
    i18n: dict[str, Any] | str | None,
) -> tuple[str | None, dict[str, Any] | None]:
    """Accept either a bare key or a key with interpolation values."""
    if i18n is None:
        return None, None
    if isinstance(i18n, str):
        return i18n, None
    return i18n.get("key"), i18n.get("params")
