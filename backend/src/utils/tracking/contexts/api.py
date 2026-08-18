"""One outbound HTTP call, as much of it as is worth keeping.

This is the context that answers "why did that not work" more often than all the
others together, which is why it records more than the rest: what was called,
what came back, and what the other side said about it.

Three rules it follows, all of them learned the hard way:

    The path, never the host. A full URL in a log invites someone to try it, and
    the host is the same for every call to a given service anyway.

    Request headers and body stay internal. That is where the credentials are,
    and the safe output has no use for them.

    A response can be filtered on its way out. Providers echo back rendering
    noise, internal ids and whole copies of what was sent; `sanitize_response`
    lets the caller drop that from the safe output while the log file keeps the
    raw body.

Nothing here imports an HTTP client. The response is read by attribute, so an
httpx response and a requests response both work, and the tracking library does
not decide which client the rest of the program uses. Every read is guarded: a
context that cannot describe a call must still return a context, because failing
to write a log entry would turn a diagnosis into a second bug.
"""

from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any
from urllib.parse import parse_qsl, urlparse

from utils.tracking.contexts.base import Context
from utils.tracking.helper.redact import redact_secrets


class ApiContext(Context):
    type = "api_call"

    def __init__(
        self,
        *,
        method: str | None = None,
        path: str | None = None,
        status: int | None = None,
        provider_code: str | None = None,
        provider_message: str | None = None,
        request_headers: Any = None,
        request_body: Any = None,
        response: Any = None,
        sanitize_response: Callable[[Any], Any] | None = None,
        i18n: dict[str, Any] | str | None = None,
        show_api_path: bool = True,
    ) -> None:
        self.method = method
        self.path = path
        self.status = status
        # A provider's own error key, e.g. "account_inactive" - more stable than
        # its prose and the only part worth matching on.
        self.provider_code = provider_code
        self.provider_message = provider_message
        self.request_headers = request_headers
        self.request_body = request_body
        self.response = response
        self.sanitize_response = sanitize_response
        self.title_i18n = {"key": i18n} if isinstance(i18n, str) else i18n
        # False where the endpoint is our own and naming it tells the user
        # nothing - the translated title stands on its own there.
        self.show_api_path = show_api_path

    # --- output ------------------------------------------------------------

    def _safe_response(self) -> Any:
        if self.sanitize_response is None:
            return redact_secrets(self.response)
        try:
            return redact_secrets(self.sanitize_response(self.response))
        except Exception:
            # A caller's filter must never cost the whole entry. Fall back to the
            # unfiltered - but still redacted - body.
            return redact_secrets(self.response)

    def to_json(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "method": self.method,
            "path": self.path,
            "status": self.status,
            "provider_code": self.provider_code,
            "provider_message": self.provider_message,
            "i18n": self.title_i18n,
            "show_api_path": self.show_api_path,
            "request_headers": redact_secrets(_as_plain(self.request_headers)),
            "request_body": redact_secrets(self.request_body),
            "response": redact_secrets(self.response),
        }

    def to_safe_json(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "method": self.method,
            "path": self.path,
            "status": self.status,
            "provider_code": self.provider_code,
            "provider_message": self.provider_message,
            "i18n": self.title_i18n,
            "show_api_path": self.show_api_path,
            "response": self._safe_response(),
        }

    # --- building from a real call -----------------------------------------

    @classmethod
    def from_response(cls, response: Any, **options: Any) -> ApiContext:
        """Describe a completed call, successful or not."""
        request = getattr(response, "request", None)
        body = _response_body(response)
        return cls(
            method=_method_of(request),
            path=_path_of(_url_of(request)),
            status=_int_or_none(getattr(response, "status_code", None)),
            provider_message=_message_of(body),
            request_headers=getattr(request, "headers", None),
            request_body=_request_body(request),
            response=body,
            **options,
        )

    @classmethod
    def from_error(cls, error: Any, **options: Any) -> ApiContext | None:
        """Describe the call an exception came out of, or None if it was not one.

        Covers both shapes: a client that raises on a bad status carries the
        response, and a connection that never got an answer carries only the
        request. The second is still worth an entry - "no answer at all" is a
        different diagnosis from "answered with 500".
        """
        response = getattr(error, "response", None)
        if response is not None:
            return cls.from_response(response, **options)

        request = getattr(error, "request", None)
        if request is None:
            return None

        return cls(
            method=_method_of(request),
            path=_path_of(_url_of(request)),
            request_headers=getattr(request, "headers", None),
            request_body=_request_body(request),
            **options,
        )


# --- reading a response without knowing which client produced it -----------


def _method_of(request: Any) -> str | None:
    method = getattr(request, "method", None)
    return str(method).upper() if method else None


def _url_of(request: Any) -> Any:
    return getattr(request, "url", None)


def _path_of(url: Any) -> str | None:
    """The path, from either a URL object or a plain string."""
    if url is None:
        return None
    # httpx hands out a URL object that already knows its path; requests hands
    # out the string it was given.
    path = getattr(url, "path", None)
    if isinstance(path, str) and path:
        return path
    try:
        return urlparse(str(url)).path or None
    except Exception:
        return None


def _response_body(response: Any) -> Any:
    """The parsed body when it is JSON, the text when it is not."""
    parse = getattr(response, "json", None)
    if callable(parse):
        try:
            return parse()
        except Exception:
            pass
    text = getattr(response, "text", None)
    return text if isinstance(text, str) else None


def _request_body(request: Any) -> Any:
    """What was sent, parsed back into a structure wherever possible.

    Parsed rather than kept as text, and not only for readability: redaction works
    on keys, and a body left as one JSON string is a single value with no keys in
    it - so a credential inside it would travel into the log file untouched.
    """
    for attribute in ("content", "body"):
        body = getattr(request, attribute, None)
        if body is None:
            continue
        if isinstance(body, bytes):
            try:
                body = body.decode("utf-8")
            except UnicodeDecodeError:
                return f"[{len(body)} bytes]"
        if not isinstance(body, str):
            # Already a structure, or something opaque like a file handle.
            return body
        return _parse_body(body, getattr(request, "headers", None))
    return None


def _parse_body(body: str, headers: Any) -> Any:
    if _content_type_of(headers) == "application/x-www-form-urlencoded":
        try:
            return dict(parse_qsl(body))
        except Exception:
            return body
    try:
        return json.loads(body)
    except (ValueError, TypeError):
        # Not JSON either. Kept as it is - unparseable is still readable.
        return body


def _content_type_of(headers: Any) -> str | None:
    """The content type, lower-cased and without its parameters."""
    if headers is None:
        return None
    try:
        raw = None
        getter = getattr(headers, "get", None)
        if callable(getter):
            raw = getter("content-type") or getter("Content-Type")
        else:
            entries = dict(headers).items()
            raw = next(
                (v for k, v in entries if str(k).lower() == "content-type"), None
            )
    except Exception:
        return None
    if not isinstance(raw, str):
        return None
    return raw.split(";", 1)[0].strip().lower()


def _message_of(body: Any) -> str | None:
    """A human-readable sentence from the body, if there is one.

    Only a string counts. Some providers put a whole copy of what was posted
    under `message` on success, and repeating that here as "the provider said"
    would be both wrong and enormous.
    """
    if isinstance(body, str):
        return body or None
    if not isinstance(body, dict):
        return None
    for key in ("error", "message", "detail", "description"):
        candidate = body.get(key)
        if isinstance(candidate, str) and candidate:
            return candidate
    return None


def _as_plain(value: Any) -> Any:
    """Headers as a dictionary, whatever mapping-like object they arrived in."""
    if value is None or isinstance(value, (dict, list, str, int, float, bool)):
        return value
    try:
        return dict(value)
    except Exception:
        return str(value)


def _int_or_none(value: Any) -> int | None:
    try:
        return int(value) if value is not None else None
    except (TypeError, ValueError):
        return None
