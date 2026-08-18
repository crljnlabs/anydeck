"""What every route is given before it runs.

One thing so far: its timeline. A route asks for it by annotating a parameter,
and everything it calls receives the same object, so one request produces one
ordered account of itself.

The timeline is written when the request is over - and only then, because whether
a `debug` entry was worth keeping depends on how the request ended. The rule
lives in `write_tracking`; this is just the moment it is applied.

It is also put on the request, which no route needs today. The reason is the
error handler in app.py: when failure responses start carrying the timeline so
the interface can show what went wrong, the handler has to be able to reach it,
and by then the request is the only thing it still has.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, Request

from utils import Tracking, write_tracking


def _tracking(request: Request) -> Iterator[Tracking]:
    tracking = Tracking()
    request.state.tracking = tracking
    try:
        yield tracking
    finally:
        write_tracking(tracking)


# Written as an annotation rather than as a default, so a route reads
# `tracking: Tracked` and says what it wants without repeating how to get it.
Tracked = Annotated[Tracking, Depends(_tracking)]
