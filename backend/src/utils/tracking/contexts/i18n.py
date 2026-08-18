"""A message the interface translates, rather than one the backend writes out.

The backend records a key and its interpolation values; the frontend turns that
into a sentence in the language the user chose. It keeps the timeline neutral -
the same recorded run reads in German or English without being re-recorded - and
it keeps translations in the one place that already has them.

For internal messages this is not worth the effort; those use `MessageContext`.
"""

from __future__ import annotations

from typing import Any

from utils.tracking.contexts.base import Context


class I18nContext(Context):
    type = "i18n"

    def __init__(self, key: str, params: dict[str, Any] | None = None) -> None:
        self.key = key
        self.params = params

    def to_json(self) -> dict[str, Any]:
        return {"type": self.type, "key": self.key, "params": self.params}
