"""The error the whole backend raises.

One type, for a reason that has nothing to do with tidiness: an error that is
going to be shown to somebody needs to carry two different sentences. The one in
the log file should be specific enough to fix the problem - which file, which
port, which call - and the one on screen should be short enough to act on. A bare
RuntimeError carries one string and the reader gets whichever register the author
happened to be in.

Raising one is also how a failure gets into the timeline. The constructor records
itself, so there is nothing to remember at the throw site:

    raise AnydeckError(tracking, f"icons missing in {directory}",
                       user_message="Application icons are missing.")

The entry lands under whatever labels were in force, which is why the message in
the log file does not need to repeat where it happened.

Deliberately without classification for now - no "the user can fix this", no
"this is a bug", no HTTP status. Every failure here can matter to whoever is
looking at it, and inventing categories before there are cases to sort would
mean guessing at the categories.
"""

from __future__ import annotations

from typing import Any

from utils.tracking import Tracker, Tracking, build_failure_tracker


class AnydeckError(Exception):
    """A failure, with the words for both of its audiences."""

    def __init__(
        self,
        tracking: Tracking | None,
        internal_message: str,
        *,
        user_message: str | None = None,
        i18n: dict[str, Any] | str | None = None,
        inner_error: BaseException | None = None,
        tracker: Tracker | None = None,
    ) -> None:
        """
        `tracking` is the timeline this failure belongs in. It is the first
        argument rather than a keyword so that it cannot be forgotten quietly;
        None is accepted for the few places that have no timeline yet.

        `internal_message` is required. `user_message` falls back to it, so one
        sentence is enough when the technical one is also fit to be read.

        `tracker` enriches an entry the operation had already started building,
        instead of adding a second one for the same operation.
        """
        if not internal_message:
            raise ValueError("AnydeckError needs an internal_message.")

        super().__init__(internal_message)

        self.internal_message = internal_message
        self.user_message = (
            user_message if user_message is not None else internal_message
        )
        self.i18n = i18n
        self.inner_error = inner_error

        self.tracker = build_failure_tracker(
            tracking,
            internal_message,
            tracker=tracker,
            inner_error=inner_error,
            user_message=self.user_message,
            i18n=i18n,
        )

    def __str__(self) -> str:
        """The internal message, plus the labels it happened under.

        The labels are already on the timeline entry, but an exception is often
        read on its own - in a traceback, or in a terminal during development -
        and "the server did not come up" is a great deal more useful as
        "[startup > server] the server did not come up".
        """
        where = _where(self.tracker)
        return f"[{where}] {self.internal_message}" if where else self.internal_message


def _where(tracker: Tracker | None) -> str:
    if tracker is None:
        return ""

    labels = []
    for name in ("action_source", "action"):
        context = tracker.get(name)
        if context is not None and getattr(context, "name", None):
            labels.append(str(context.name))

    step = tracker.get("step")
    if step is not None:
        labels.extend(str(part) for part in getattr(step, "path", []) or [])

    return " > ".join(labels)


class SecretsError(AnydeckError):
    """A stored credential could not be written or read.

    The one exception to the note above, and only because the caller has a
    decision to make that no message can make for it: a failure in here means
    either the credential store is unreachable or the value in the database is
    no longer readable, and both of those end in "ask the user to connect this
    account again" rather than in a retry. Nothing else in the backend has that
    shape yet.

    Still an AnydeckError, so the handler in app.py and every `except
    AnydeckError` keep working untouched.
    """


class DecryptionError(SecretsError):
    """A stored secret did not decrypt.

    Separate from its parent because it is the case that must never be
    recovered from quietly. The value was written by this program and cannot be
    read back: the key is gone, the row was tampered with, or it belongs to a
    different id. Returning anything at all here would be returning data the
    user never stored.
    """
