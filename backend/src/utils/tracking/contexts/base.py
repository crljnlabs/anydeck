"""The building block every tracking entry is made of.

A context is a small, self-describing data holder: a step name, a timing, an API
call, a message. It carries a `type` so that whatever reads the timeline later -
the log file today, a frontend view eventually - can render it by looking that
type up, rather than by knowing every shape in advance. Adding a new kind of
detail is then one new file in here and nothing else.

Two serialisations, because a timeline has two audiences:

    to_json()       everything, for the log file on this machine
    to_safe_json()  filtered, for anything that leaves the process

By default both return the same thing. A context holding something that should
not leave overrides `to_safe_json` - `ApiContext` drops the request headers
there - and returning None removes the context from that output entirely.
"""

from __future__ import annotations

from typing import Any


class Context:
    """Base class for every context. Subclasses set `type` and fill `to_json`."""

    # Class attribute rather than something the constructor sets: the type is a
    # property of the kind of context, not of one instance of it.
    type: str = "context"

    def to_json(self) -> dict[str, Any] | None:
        return {"type": self.type}

    def to_safe_json(self) -> dict[str, Any] | None:
        return self.to_json()
