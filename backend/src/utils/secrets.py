"""Saving and loading a credential, in two halves.

A record has an id and two dictionaries under it. `encrypted_data` is sealed
before it reaches the database and is unreadable without the key in the
operating system credential store. `plain_data` stays legible, which is the
point of the split rather than a concession: an account screen wants to show
which account is connected, when it expires and what it may do, and none of that
should cost a keychain unlock - or become unreadable when the key is gone.

Reading gives the same shape writing takes, so a record can be moved through
without being taken apart:

    save_secrets("spotify", **load_secrets("spotify"))

Kept apart rather than merged into one flat dictionary on purpose. Merged, a
field named the same on both sides would silently take the other's place, and
the caller could no longer tell which half a value came from - which is exactly
what it needs to know before putting one on screen.

Not re-exported from `utils/__init__.py`: this module reaches into `db`, and
`db.connection` imports from `utils`. Importing it from the package __init__
would close that circle. Import it directly:

    from utils.secrets import load_secrets, save_secrets
"""

from __future__ import annotations

import json

from db import secrets as secrets_repository
from utils import crypto
from utils.error import DecryptionError, SecretsError
from utils.tracking import Tracking


def save_secrets(
    secret_id: str,
    encrypted_data: dict,
    plain_data: dict,
    *,
    tracking: Tracking | None = None,
) -> None:
    """Store both halves under `secret_id`, replacing whatever was there.

    `tracking` is optional and last, unlike a service, where it comes first and
    is required. This is a utility - a caller may well have no timeline - but
    when it does have one, passing it puts a failure in here on that timeline
    instead of on one of its own.
    """
    _require_dict("encrypted_data", encrypted_data, tracking)
    _require_dict("plain_data", plain_data, tracking)

    plain = _to_json("plain_data", plain_data, tracking)

    # An empty dictionary is stored as NULL rather than as a sealed "{}". It
    # means the same thing on the way out and it keeps a record that has nothing
    # confidential in it from touching the credential store at all.
    sealed = None
    if encrypted_data:
        sealed = crypto.encrypt(
            _to_json("encrypted_data", encrypted_data, tracking).encode("utf-8"),
            aad=_aad(secret_id),
            tracking=tracking,
        )

    secrets_repository.upsert(secret_id, plain, sealed, crypto.KEY_VERSION)

    if tracking is not None:
        # The names, never the values - a timeline is written to a log file.
        tracking.track(
            "secrets.saved",
            {
                "id": secret_id,
                "encrypted_fields": sorted(encrypted_data),
                "plain_fields": sorted(plain_data),
            },
            level="success",
        )


def load_secrets(
    secret_id: str, *, tracking: Tracking | None = None
) -> dict[str, dict] | None:
    """Both halves under `secret_id`, or None when nothing is stored under it.

    Returns `{"encrypted_data": {...}, "plain_data": {...}}`, both always
    present and both possibly empty. None means the id is unknown - it is not
    how an unreadable record reports itself, which raises.
    """
    row = secrets_repository.get(secret_id)
    if row is None:
        return None

    plain = _from_json("plain_data", secret_id, row["plain"], tracking)

    sealed = row["encrypted"]
    if not sealed:
        return {"encrypted_data": {}, "plain_data": plain}

    if row["key_version"] != crypto.KEY_VERSION:
        # Caught before the attempt, because afterwards it is just another
        # failed tag check and the reason is lost.
        raise DecryptionError(
            tracking,
            f"secret {secret_id!r} was written with key version "
            f"{row['key_version']}, this build uses {crypto.KEY_VERSION}",
            user_message="This account was saved by a different version of "
            "anydeck and has to be connected again.",
        )

    opened = crypto.decrypt(sealed, aad=_aad(secret_id), tracking=tracking)
    encrypted = _from_json(
        "encrypted_data", secret_id, opened.decode("utf-8"), tracking
    )

    return {"encrypted_data": encrypted, "plain_data": plain}


def _aad(secret_id: str) -> bytes:
    """What the sealed half is bound to, so it only opens under its own id.

    The id is authenticated but not stored inside the value. Move a blob from
    one row into another and it stops decrypting, instead of handing one
    account's credentials back under another account's name.
    """
    return secret_id.encode("utf-8")


def _require_dict(name: str, value: object, tracking: Tracking | None) -> None:
    if not isinstance(value, dict):
        raise SecretsError(
            tracking,
            f"{name} must be a dict, got {type(value).__name__}",
            user_message="An account could not be saved.",
        )


def _to_json(name: str, data: dict, tracking: Tracking | None) -> str:
    """Serialise, or refuse.

    `default=str` would make every input serialisable and give back something
    other than what was stored - a datetime saved and loaded would come back as
    a string. Refusing at the door is the only place this is still fixable.
    """
    try:
        return json.dumps(data, ensure_ascii=False, sort_keys=True)
    except (TypeError, ValueError) as error:
        # The message names the type, never the value: this is the half that may
        # be a password, and the error text ends up in the log file.
        raise SecretsError(
            tracking,
            f"{name} contains a value that cannot be stored: {error}",
            user_message="An account could not be saved.",
            inner_error=error,
        ) from error


def _from_json(
    name: str, secret_id: str, raw: str, tracking: Tracking | None
) -> dict:
    """Parse a stored half back, insisting it is still an object.

    No fallback to an empty dictionary. A record that cannot be read is not the
    same as a record that is empty, and a caller told "no token stored" when
    there is one would go and ask the user to authorise again for nothing.
    """
    try:
        value = json.loads(raw)
    except ValueError as error:
        raise SecretsError(
            tracking,
            f"the {name} of secret {secret_id!r} is not valid JSON: {error}",
            user_message="A saved account is damaged and has to be connected again.",
            inner_error=error,
        ) from error

    if not isinstance(value, dict):
        raise SecretsError(
            tracking,
            f"the {name} of secret {secret_id!r} is a {type(value).__name__}, "
            "expected an object",
            user_message="A saved account is damaged and has to be connected again.",
        )

    return value
