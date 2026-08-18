"""The timeline of one thing the program did, and the labels it happened under.

A Tracking is created at an entry point - a route, a hardware event, the startup
sequence - and handed down through whatever that entry point calls. Everything
recorded along the way lands in one ordered list, so that afterwards there is a
single answer to "what happened", in the order it happened, instead of scattered
log lines that have to be correlated by timestamp.

The labels work differently from the object. The Tracking itself is passed
explicitly, because a function that records something should say so in its
signature. The labels - which action source, which action, which step - are
ambient: opened with `with`, they apply to every entry recorded inside the block,
however deep the call chain goes. Otherwise a step name would have to be threaded
through every function that might record something, and it would be threaded
wrongly within a week.

    with tracking.step("load-icons"):
        tracking.note("reading the icon directory")   # labelled automatically

Ambient state is held in a contextvar, which is what makes this safe rather than
clever. A contextvar is per-execution: `asyncio.gather` copies the context into
each task, so two branches running at once cannot overwrite each other's labels,
and a new thread starts with a clean one - which is exactly right, because a
thread with its own entry point has its own Tracking anyway.

The same `with` works in synchronous and asynchronous code. Entering a scope only
sets a contextvar, and setting one is not something that can be awaited, so there
is no second async-flavoured spelling to remember.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from typing import Any

from utils.tracking.tracker import Level, Tracker

# One contextvar for the whole module, holding the innermost frame. Not one per
# Tracking instance: contextvars are never garbage collected, and an instance per
# request would leak one on every request. The frame names its owner instead, and
# a Tracking ignores a frame that is not its own - so two Trackings alive at the
# same time cannot label each other's entries.
_frame: ContextVar[dict[str, Any] | None] = ContextVar(
    "anydeck_tracking_frame", default=None
)


class Tracking:
    def __init__(self) -> None:
        self.entries: list[Tracker] = []

    # --- labels -------------------------------------------------------------

    @contextmanager
    def action_source(self, name: str) -> Iterator[Tracking]:
        """Label everything in the block with the action source it belongs to."""
        with self._scope(action_source=name):
            yield self

    @contextmanager
    def action(self, name: str, action_id: str | None = None) -> Iterator[Tracking]:
        """Label everything in the block with the action being carried out."""
        with self._scope(action=name, action_id=action_id):
            yield self

    @contextmanager
    def step(self, name: str) -> Iterator[Tracking]:
        """Label everything in the block with this step.

        Steps nest: entering one inside another appends to the path rather than
        replacing it, so the timeline keeps the shape of the work.
        """
        with self._scope(step=name):
            yield self

    @contextmanager
    def scope(
        self,
        *,
        action_source: str | None = None,
        action: str | None = None,
        action_id: str | None = None,
        step: str | None = None,
    ) -> Iterator[Tracking]:
        """Open several labels at once, inheriting whatever is not given."""
        with self._scope(
            action_source=action_source,
            action=action,
            action_id=action_id,
            step=step,
        ):
            yield self

    # --- recording ----------------------------------------------------------

    def add(self, tracker: Tracker) -> Tracker:
        """Stamp an entry with the labels in force and append it to the timeline."""
        frame = self._current_frame()

        if frame.get("action_source"):
            tracker.add_action_source(frame["action_source"])
        # Either half is enough: an action known only by its id still needs the
        # context, because the id is what joins the entry to its binding.
        if frame.get("action") or frame.get("action_id"):
            tracker.add_action(frame.get("action"), frame.get("action_id"))
        if frame.get("step"):
            tracker.add_step(frame["step"], frame.get("step_path"))

        self.entries.append(tracker)
        return tracker

    def note(
        self,
        message: str,
        *,
        user_message: str | None = None,
        values: Any = None,
        level: Level = "debug",
        internal: bool = False,
    ) -> Tracker:
        """Record something in plain words.

        For anything the user might read, prefer `track` with a translation key.
        This is for the technical register: what was tried, what was skipped, what
        was quietly recovered from.
        """
        tracker = self.add(Tracker(level=level, internal=internal))
        tracker.add_message(message, user_message)
        if _worth_recording(values):
            tracker.add_value(values)
        return tracker

    def track(
        self,
        key: str,
        values: Any = None,
        *,
        level: Level = "debug",
        params: dict[str, Any] | None = None,
    ) -> Tracker:
        """Record a translatable message, with optional data alongside it.

        `values` is the data block shown under the entry; it is not fed to the
        translation. Interpolation values for the sentence itself go in `params`,
        deliberately separately - a data payload that happened to contain a
        `count` key would otherwise silently switch the translation into its
        plural form.
        """
        tracker = self.add(Tracker(level=level))
        tracker.add_i18n(key, params)
        if _worth_recording(values):
            tracker.add_value(values)
        return tracker

    @contextmanager
    def record(
        self, *, level: Level = "success", internal: bool = False
    ) -> Iterator[Tracker]:
        """Build one entry for one operation, and keep it only if it succeeds.

        On the way out of the block the entry is appended. If the block raises it
        is not, and the failure path records the operation instead - so one
        operation is one line in the timeline whether it worked or not, never two
        contradicting ones.
        """
        tracker = Tracker(level=level, internal=internal)
        yield tracker
        self.add(tracker)

    # --- HTTP ---------------------------------------------------------------

    def api_call(
        self,
        call: Callable[[], Any],
        *,
        assert_response: Callable[[Tracking, Tracker, Any], None] | None = None,
        sanitize_response: Callable[[Any], Any] | None = None,
        i18n: dict[str, Any] | str | None = None,
        show_api_path: bool = True,
        level: Level = "success",
        internal: bool = False,
    ) -> Any:
        """Make one HTTP call as one timeline entry, and return its response.

        `assert_response` is for services that report failure with a successful
        status code: inspect the response and raise to turn the call into a
        failure, or return to accept it. Raising there drops the entry exactly as
        a transport error would, so a rejected call never leaves a green line
        behind.
        """
        with self.record(level=level, internal=internal) as tracker:
            with tracker.measure():
                response = call()
            tracker.add_response(
                response,
                sanitize_response=sanitize_response,
                i18n=i18n,
                show_api_path=show_api_path,
            )
            if assert_response is not None:
                assert_response(self, tracker, response)
            return response

    async def api_call_async(
        self,
        call: Callable[[], Awaitable[Any]],
        *,
        assert_response: Callable[[Tracking, Tracker, Any], None] | None = None,
        sanitize_response: Callable[[Any], Any] | None = None,
        i18n: dict[str, Any] | str | None = None,
        show_api_path: bool = True,
        level: Level = "success",
        internal: bool = False,
    ) -> Any:
        """`api_call` for an awaitable client.

        A twin rather than one function that handles both: in Python the two
        cannot be unified without making every synchronous caller await, and the
        synchronous one is the common case here.
        """
        with self.record(level=level, internal=internal) as tracker:
            with tracker.measure():
                response = await call()
            tracker.add_response(
                response,
                sanitize_response=sanitize_response,
                i18n=i18n,
                show_api_path=show_api_path,
            )
            if assert_response is not None:
                assert_response(self, tracker, response)
            return response

    # --- reading ------------------------------------------------------------

    @property
    def failed(self) -> bool:
        """Whether anything in this timeline went wrong."""
        return any(tracker.failed for tracker in self.entries)

    def to_json(self) -> list[dict[str, Any]]:
        """The whole timeline, for the log file."""
        return [tracker.to_json() for tracker in self.entries]

    def to_safe_json(self) -> list[dict[str, Any]]:
        """The timeline as it may leave the process; internal entries removed."""
        return [
            safe
            for safe in (tracker.to_safe_json() for tracker in self.entries)
            if safe is not None
        ]

    def reset(self) -> None:
        """Empty the timeline, for an object that is reused across operations."""
        self.entries = []

    # --- internals ----------------------------------------------------------

    def _current_frame(self) -> dict[str, Any]:
        frame = _frame.get()
        if frame is None or frame.get("owner") is not self:
            return {}
        return frame

    def _frame_with(self, patch: dict[str, Any]) -> dict[str, Any]:
        frame = dict(self._current_frame())
        frame["owner"] = self

        for key, value in patch.items():
            # An unset field inherits rather than clearing what the enclosing
            # block established.
            if value is None:
                continue
            if key == "step":
                frame["step_path"] = [*frame.get("step_path", []), value]
            frame[key] = value

        return frame

    @contextmanager
    def _scope(self, **patch: Any) -> Iterator[Tracking]:
        # set() hands back a token that restores the previous frame exactly, so
        # leaving a nested scope cannot lose the outer one.
        token = _frame.set(self._frame_with(patch))
        try:
            yield self
        finally:
            _frame.reset(token)


def _worth_recording(values: Any) -> bool:
    """Whether a payload carries anything, so empty ones are not attached.

    An empty dictionary is a common accident - a caller assembling data that
    turned out to have none - and an entry with an empty data block under it
    reads as though something was recorded when nothing was.
    """
    if values is None:
        return False
    if isinstance(values, (dict, list, tuple, set, str)):
        return len(values) > 0
    return True
