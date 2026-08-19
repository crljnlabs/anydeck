"""The key that protects stored secrets, and the two operations that use it.

The key is not in the database. It is in the credential store the operating
system already runs for exactly this - Keychain on macOS, Credential Manager on
Windows, SecretService on Linux - because a key kept next to the data it
protects is a lock taped to its own door: anyone who can read the database file
can read both.

That split is also the limit of what this buys. It protects a database file that
travels somewhere it should not - a backup, a synced folder, a stolen disk. It
does not protect against a program running as the user, which can simply ask the
credential store for the key, exactly as this one does.

Nothing in here knows what a secret contains or which table it lives in. It takes
bytes and gives back bytes; `utils/secrets.py` decides what those bytes mean.
"""

from __future__ import annotations

import base64
import os
import threading

import keyring
import keyring.backends.fail
import keyring.errors
from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from utils.error import DecryptionError, SecretsError
from utils.tracking import Tracking

# The credential store lists entries by service and account name. The account is
# versioned so that a future key can be introduced next to the old one rather
# than on top of it - a replaced key makes every existing row unreadable.
SERVICE_NAME = "anydeck"
KEY_ACCOUNT = "encryption-key-v1"

# Written into every row, and checked when reading one. Without it, a row
# encrypted under a key this build no longer has is indistinguishable from a
# corrupted row: both are a failed tag check and nothing else.
KEY_VERSION = 1

KEY_BYTES = 32  # AES-256.
NONCE_BYTES = 12  # What GCM is specified for; anything else costs a rehash.
TAG_BYTES = 16

# Fetched once per process. The store is a round trip to another service and, on
# macOS, potentially a dialog - not something to repeat per row.
_lock = threading.Lock()
_key: bytes | None = None


def encryption_key(tracking: Tracking | None = None) -> bytes:
    """The key for this installation, generated on first use.

    First use rather than at startup on purpose: reaching the credential store
    can prompt the user on macOS and can fail outright on Linux, and neither
    should happen to somebody who never stores a credential at all.
    """
    global _key

    with _lock:
        if _key is None:
            _key = _load_or_create_key(tracking)
        return _key


def forget_key() -> None:
    """Drop the cached key, so the next call reads the store again."""
    global _key

    with _lock:
        _key = None


def encrypt(plaintext: bytes, *, aad: bytes, tracking: Tracking | None = None) -> bytes:
    """Seal `plaintext`, bound to `aad`. Returns nonce + ciphertext + tag.

    `aad` is authenticated but not encrypted: it is not stored in the result,
    and decryption only succeeds when the caller supplies the same value again.
    That is what ties a sealed value to the row it belongs to.

    A fresh nonce per call, because reusing one under the same key is the one
    mistake GCM does not survive - it leaks the plaintexts, not just their
    relationship.
    """
    nonce = os.urandom(NONCE_BYTES)
    return nonce + AESGCM(encryption_key(tracking)).encrypt(nonce, plaintext, aad)


def decrypt(blob: bytes, *, aad: bytes, tracking: Tracking | None = None) -> bytes:
    """Open a value produced by `encrypt`, or raise.

    There is deliberately no lenient path. A failure here means the value was
    written by this program and cannot be read back - wrong key, altered bytes,
    or the wrong `aad` - and every one of those is a reason to stop rather than
    to hand back a best effort.
    """
    if len(blob) < NONCE_BYTES + TAG_BYTES:
        raise DecryptionError(
            tracking,
            f"stored value is {len(blob)} bytes, too short to be encrypted",
            user_message="A stored credential is damaged and has to be entered again.",
        )

    nonce, sealed = blob[:NONCE_BYTES], blob[NONCE_BYTES:]
    try:
        return AESGCM(encryption_key(tracking)).decrypt(nonce, sealed, aad)
    except InvalidTag as error:
        # GCM says only "this did not verify" - which of the three causes it was
        # is not knowable from here, so the message names all of them rather
        # than guessing at one.
        raise DecryptionError(
            tracking,
            "a stored value did not decrypt: the key in the credential store "
            "does not match the one it was written with, or the value was "
            "altered after it was written",
            user_message="A stored credential could not be read and has to be "
            "entered again.",
            inner_error=error,
        ) from error


def _load_or_create_key(tracking: Tracking | None) -> bytes:
    _require_usable_backend(tracking)

    try:
        stored = keyring.get_password(SERVICE_NAME, KEY_ACCOUNT)

        if stored is None:
            fresh = base64.b64encode(os.urandom(KEY_BYTES)).decode("ascii")
            keyring.set_password(SERVICE_NAME, KEY_ACCOUNT, fresh)
            # Read back instead of keeping what was just generated: the tray
            # process and a window process can reach this at the same time, and
            # the second write wins. Reading afterwards means both agree on the
            # surviving key rather than one of them encrypting rows with a key
            # that no longer exists.
            stored = keyring.get_password(SERVICE_NAME, KEY_ACCOUNT)
            if tracking is not None:
                tracking.note("generated an encryption key and stored it in the "
                              "operating system credential store")
    except keyring.errors.KeyringError as error:
        raise SecretsError(
            tracking,
            f"the operating system credential store could not be reached: {error}",
            user_message="Anydeck could not reach the credential store of your "
            "system, so saved accounts are unavailable.",
            inner_error=error,
        ) from error

    if stored is None:
        raise SecretsError(
            tracking,
            "the credential store accepted the encryption key but returned "
            "nothing when asked for it again",
            user_message="Anydeck could not store its encryption key.",
        )

    try:
        key = base64.b64decode(stored, validate=True)
    except (ValueError, TypeError) as error:
        raise SecretsError(
            tracking,
            f"the encryption key in the credential store is not valid base64: {error}",
            user_message="The encryption key of anydeck is damaged.",
            inner_error=error,
        ) from error

    if len(key) != KEY_BYTES:
        # Never the key itself, and not even its content - only how long the
        # wrong thing was. An error message travels into the log file.
        raise SecretsError(
            tracking,
            f"the encryption key in the credential store is {len(key)} bytes, "
            f"expected {KEY_BYTES}",
            user_message="The encryption key of anydeck is damaged.",
        )

    return key


def _require_usable_backend(tracking: Tracking | None) -> None:
    """Refuse to run when the store is missing or is not actually a secure one.

    keyring always returns *something*. On a machine with no secret service it
    returns a backend that raises on every call, and if `keyrings.alt` happens
    to be installed it can return one that writes the key to a file in the home
    directory - which would put the key next to the database and quietly undo
    the entire point of this module. Better to say so than to look encrypted.
    """
    backend = keyring.get_keyring()
    module = type(backend).__module__

    if isinstance(backend, keyring.backends.fail.Keyring):
        raise SecretsError(
            tracking,
            "no usable credential store: keyring found no backend on this system",
            user_message="Your system has no credential store available, so "
            "anydeck cannot save accounts. On Linux, install and start "
            "gnome-keyring or KWallet.",
        )

    if module.startswith("keyrings.alt"):
        raise SecretsError(
            tracking,
            f"refusing the {module} backend: it does not store the key securely",
            user_message="The available credential store would keep the "
            "encryption key unprotected, so anydeck will not use it.",
        )
