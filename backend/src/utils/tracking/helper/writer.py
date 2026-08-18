"""Putting a finished timeline into the log file.

Two rules, and the second one is the point:

    Nothing went wrong - only what was odd is written. A successful request is
    not worth a line, let alone six: the settings screen alone would fill the
    file, and a file that scrolls that fast is a file nobody reads.

    Something went wrong - the whole timeline is written, `debug` entries
    included. Whether a detail was worth keeping cannot be known while it is
    being recorded; it becomes worth keeping the moment something fails. So
    everything is recorded, and this is where the decision is finally made.

A failed timeline goes out as one multi-line block rather than a line per entry.
Several threads write to this file, and a diagnosis split down the middle by an
unrelated line from the server thread is a diagnosis that has to be reassembled
by hand.

Nothing in here raises. Writing down what happened must not become the thing
that happened.
"""

from __future__ import annotations

import json
import logging
from typing import Any

log = logging.getLogger("anydeck.tracking")

# Levels worth a line when the operation as a whole went fine.
_KEPT_WHEN_FINE = ("warning",)


def write_tracking(tracking: Any) -> None:
    """Write a timeline to the log file, as much of it as is warranted."""
    try:
        entries = tracking.to_json()
    except Exception:
        return

    if not entries:
        return

    try:
        if tracking.failed:
            log.error("\n".join(["what happened:", *(_line(e) for e in entries)]))
            return

        for entry in entries:
            if entry.get("level") in _KEPT_WHEN_FINE:
                log.warning(_line(entry))
    except Exception:
        # Best effort by design - see the module docstring.
        pass


def _line(entry: dict[str, Any]) -> str:
    """One entry as one readable line: level, where it happened, what happened."""
    contexts = entry.get("contexts") or []
    level = str(entry.get("level", "debug")).upper()
    where = _where(contexts)
    what = _what(contexts)
    detail = _detail(contexts)

    parts = [f"  {level:<7}"]
    if where:
        parts.append(f"[{where}]")
    if what:
        parts.append(what)
    if detail:
        parts.append(detail)
    return " ".join(parts)


def _where(contexts: list[dict[str, Any]]) -> str:
    """The labels, outermost first, as one path."""
    labels = []
    for context in contexts:
        if context.get("type") == "action_source" and context.get("name"):
            labels.append(str(context["name"]))
        elif context.get("type") == "action" and context.get("name"):
            labels.append(str(context["name"]))
        elif context.get("type") == "step":
            labels.extend(str(part) for part in context.get("path") or [])
    return " > ".join(labels)


def _what(contexts: list[dict[str, Any]]) -> str:
    """The most specific summary the entry can offer."""
    by_type = {context.get("type"): context for context in contexts}

    message = by_type.get("message")
    if message and message.get("internal"):
        return str(message["internal"])

    translated = by_type.get("i18n")
    if translated and translated.get("key"):
        # The key, not a sentence: translating belongs to the interface, and a key
        # is precise enough to grep for.
        return str(translated["key"])

    call = by_type.get("api_call")
    if call:
        described = " ".join(
            str(part) for part in (call.get("method"), call.get("path")) if part
        )
        status = call.get("status")
        return f"{described} -> {status}" if status else described or "api call"

    return ""


def _detail(contexts: list[dict[str, Any]]) -> str:
    """The data worth carrying on the same line, compactly."""
    pieces = []

    for context in contexts:
        kind = context.get("type")
        if kind == "value":
            pieces.append(_compact(context.get("value")))
        elif kind == "timing" and context.get("duration_ms") is not None:
            pieces.append(f"{context['duration_ms']}ms")
        elif kind == "retry":
            pieces.append(_compact({k: v for k, v in context.items() if k != "type"}))
        elif kind == "api_call":
            for key in ("provider_code", "provider_message"):
                if context.get(key):
                    pieces.append(f"{key}={context[key]}")
            if context.get("response") is not None:
                pieces.append(_compact(context["response"]))

    return " ".join(piece for piece in pieces if piece)


def _compact(value: Any, limit: int = 600) -> str:
    """A value as one line of JSON, truncated rather than allowed to run away."""
    try:
        text = json.dumps(value, default=str, ensure_ascii=False)
    except Exception:
        text = str(value)
    return text if len(text) <= limit else f"{text[:limit]}...[truncated]"
