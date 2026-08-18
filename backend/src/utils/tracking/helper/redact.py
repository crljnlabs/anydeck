"""Keeping credentials out of a timeline.

Applied on both output paths, not just the one that leaves the process. The log
file lives on the user's machine and is the first thing they attach to a bug
report, so a token written into it has already travelled further than intended.

Two different jobs, deliberately not merged:

    redact_secrets  masks values whose KEY looks like a credential. Always on,
                    because nobody remembers to ask for it.
    omit_keys_deep  drops named keys entirely. Opt-in, for a caller who knows
                    that a particular provider echoes back noise nobody needs.
"""

from __future__ import annotations

import re
from typing import Any

SECRET_KEY_PATTERN = re.compile(
    r"(client[_-]?secret|client[_-]?id|secret|password|passwd|access[_-]?token"
    r"|refresh[_-]?token|[a-z0-9_-]*token\b|authorization|api[_-]?key|apikey"
    r"|bearer|credential|private[_-]?key|cookie)",
    re.IGNORECASE,
)

REDACTED = "[redacted]"

# Deep enough for any real response body, shallow enough that a structure with a
# cycle in it cannot turn a log write into a hang.
MAX_DEPTH = 6


def redact_secrets(value: Any, depth: int = 0) -> Any:
    """Replace the value of every credential-looking key, anywhere in the tree."""
    if value is None:
        return None
    if depth > MAX_DEPTH:
        return "[truncated]"
    if isinstance(value, (list, tuple)):
        return [redact_secrets(entry, depth + 1) for entry in value]
    if isinstance(value, dict):
        return {
            str(key): (
                REDACTED
                if SECRET_KEY_PATTERN.search(str(key))
                else redact_secrets(inner, depth + 1)
            )
            for key, inner in value.items()
        }
    return value


def omit_keys_deep(value: Any, key_names: list[str] | tuple[str, ...] | None) -> Any:
    """Remove the named keys, anywhere in the tree, and keep everything else.

    The input is never modified; a filtered copy comes back.
    """
    if not key_names:
        return value

    drop = set(key_names)

    def walk(inner: Any, depth: int) -> Any:
        if inner is None or depth > MAX_DEPTH:
            return inner
        if isinstance(inner, (list, tuple)):
            return [walk(entry, depth + 1) for entry in inner]
        if isinstance(inner, dict):
            return {
                key: walk(nested, depth + 1)
                for key, nested in inner.items()
                if key not in drop
            }
        return inner

    return walk(value, 0)
