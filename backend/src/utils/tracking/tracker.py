"""One tracked operation - one line in the timeline.

An entry is a level, an `internal` flag, and a list of contexts describing what
happened. Nothing about it is specific to success or to failure: the same object
records "sent the message" and "could not send the message", differing only in
its level and in which contexts it ended up carrying. That is what makes a
timeline readable - a failure sits in the same list as the steps that led to it,
in the order they happened, instead of in a separate error channel.

`internal` means recorded and logged but never shown: it goes into the log file
in full and disappears from the safe output entirely. It is the right choice for
an entry whose whole content is a detail nobody outside this process should see.
"""

from __future__ import annotations

from collections.abc import Callable, Iterator
from contextlib import contextmanager
from typing import Any, Literal

from utils.tracking.contexts import (
    ActionContext,
    ActionSourceContext,
    ApiContext,
    Context,
    I18nContext,
    MessageContext,
    RetryContext,
    StepContext,
    TimingContext,
    ValueContext,
)

# `debug` is recorded like everything else and only dropped when the timeline is
# written without a failure in it - see helper/writer.py. Whether a detail was
# worth keeping is not knowable until something goes wrong.
Level = Literal["success", "warning", "error", "debug"]


class Tracker:
    def __init__(self, level: Level = "success", internal: bool = False) -> None:
        self.level: Level = level
        self.internal = internal
        self.contexts: list[Context] = []

    # --- adding detail ------------------------------------------------------
    #
    # Every one of these returns the tracker, so a call site can read as one
    # sentence: tracker.add_message("...").add_value({"id": 3}).

    def add(self, context: Context | None) -> Tracker:
        if context is not None:
            self.contexts.append(context)
        return self

    def add_action_source(self, name: str) -> Tracker:
        return self.add(ActionSourceContext(name))

    def add_action(self, name: str | None, action_id: str | None = None) -> Tracker:
        return self.add(ActionContext(name, action_id))

    def add_step(self, name: str | None, path: list[str] | None = None) -> Tracker:
        return self.add(StepContext(name, path))

    def add_message(self, internal: str, user: str | None = None) -> Tracker:
        return self.add(MessageContext(internal, user))

    def add_i18n(self, key: str, params: dict[str, Any] | None = None) -> Tracker:
        return self.add(I18nContext(key, params))

    def add_value(self, *values: Any) -> Tracker:
        return self.add(ValueContext(*values))

    def add_retry(self, **retry: Any) -> Tracker:
        return self.add(RetryContext(**retry))

    def add_api_call(self, **api_call: Any) -> Tracker:
        return self.add(ApiContext(**api_call))

    def add_response(self, response: Any, **options: Any) -> Tracker:
        """Record a completed HTTP call from the response object itself."""
        return self.add(ApiContext.from_response(response, **options))

    def add_error(self, error: Any) -> Tracker:
        """Record the HTTP call an exception came out of, if it was one.

        Does nothing for an error that has nothing to do with a request, so the
        failure path can call it unconditionally.
        """
        return self.add(ApiContext.from_error(error))

    @contextmanager
    def measure(self) -> Iterator[Tracker]:
        """Time the block and attach the result - including when it raises.

        In a `finally`, because how long something took before it failed is
        usually the interesting half of a timeout.
        """
        timing = TimingContext.start()
        try:
            yield self
        finally:
            self.add(timing.stop())

    # --- reading ------------------------------------------------------------

    def get(self, type_name: str) -> Context | None:
        """The first context of a given type, or None."""
        return next((c for c in self.contexts if c.type == type_name), None)

    @property
    def failed(self) -> bool:
        return self.level == "error"

    # --- output ------------------------------------------------------------

    def to_json(self) -> dict[str, Any]:
        """Everything, for the log file."""
        return {
            "level": self.level,
            "internal": self.internal,
            "contexts": _serialise(self.contexts, lambda c: c.to_json()),
        }

    def to_safe_json(self) -> dict[str, Any] | None:
        """Filtered, for anything leaving the process. None when internal."""
        if self.internal:
            return None
        return {
            "level": self.level,
            "contexts": _serialise(self.contexts, lambda c: c.to_safe_json()),
        }


def _serialise(
    contexts: list[Context], convert: Callable[[Context], dict[str, Any] | None]
) -> list[dict[str, Any]]:
    """Convert the contexts, dropping the ones that remove themselves.

    A context that raises while describing itself is skipped rather than allowed
    to take the entry - and with it the diagnosis - down with it.
    """
    out = []
    for context in contexts:
        try:
            serialised = convert(context)
        except Exception:
            continue
        if serialised is not None:
            out.append(serialised)
    return out
