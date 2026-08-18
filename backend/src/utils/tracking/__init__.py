"""Writing down what the program did, in a form something can read back.

The log file answers "did it crash". It does not answer "which of the six things
this route did went wrong, what did the other side reply, and how long did it
take" - text cannot be grouped, filtered, or shown to a user as an explanation.
This is that missing half: an ordered timeline of typed entries, recorded once
and rendered for whoever is reading.

    from utils import Tracking, write_tracking

    tracking = Tracking()
    with tracking.step("load-settings"):
        tracking.note("no stored theme, using the default", level="warning")
    write_tracking(tracking)

A Tracking is created at an entry point and passed down; the labels inside it are
ambient and opened with `with`. Nothing in here knows what an action source or a
device is - it knows how to record, label and serialise - so the same library
serves a route, a hardware event and the startup sequence alike.

`carry_context` is here for the day a step spawns work on another thread; see its
own docstring for why that one case needs help.
"""

from collections.abc import Callable
from contextvars import copy_context
from typing import Any

from utils.tracking.helper.failure import build_failure_tracker
from utils.tracking.helper.redact import omit_keys_deep, redact_secrets
from utils.tracking.helper.writer import write_tracking
from utils.tracking.tracker import Level, Tracker
from utils.tracking.tracking import Tracking


def carry_context(
    fn: Callable[..., Any], *args: Any, **kwargs: Any
) -> Callable[[], Any]:
    """Bind a call to the labels in force right now, for running elsewhere.

    A contextvar does not cross into a thread that was started from scratch, so
    work handed to a thread or to an executor from inside a step would record
    itself unlabelled. This takes a snapshot here and returns a callable that
    runs inside it:

        Thread(target=carry_context(work, device)).start()
        executor.submit(carry_context(work, device))

    A snapshot per call, because one snapshot cannot be entered twice at the same
    time - so build one per piece of work rather than reusing the callable.
    """
    context = copy_context()
    return lambda: context.run(fn, *args, **kwargs)


__all__ = [
    "Level",
    "Tracker",
    "Tracking",
    "build_failure_tracker",
    "carry_context",
    "omit_keys_deep",
    "redact_secrets",
    "write_tracking",
]
