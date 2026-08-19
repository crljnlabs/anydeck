"""The key, and the two operations that use it."""

from __future__ import annotations

import base64

import pytest

import keyring
import keyring.backends.fail
import keyring.errors

from utils import crypto
from utils.error import DecryptionError, SecretsError


def test_the_key_is_generated_once_and_then_reused(store):
    first = crypto.encryption_key()
    crypto.forget_key()
    second = crypto.encryption_key()

    assert first == second
    assert len(first) == crypto.KEY_BYTES
    assert store.writes == 1


def test_the_key_is_not_a_constant(store):
    first = crypto.encryption_key()

    store.values.clear()
    crypto.forget_key()
    second = crypto.encryption_key()

    assert first != second


def test_the_key_is_cached_rather_than_fetched_per_call(store):
    crypto.encryption_key()
    reads_after_first = store.reads

    for _ in range(5):
        crypto.encryption_key()

    assert store.reads == reads_after_first


def test_encrypt_then_decrypt_returns_the_input(store):
    sealed = crypto.encrypt(b"the quick brown fox", aad=b"spotify")

    assert crypto.decrypt(sealed, aad=b"spotify") == b"the quick brown fox"


def test_the_same_input_seals_differently_every_time(store):
    first = crypto.encrypt(b"same", aad=b"id")
    second = crypto.encrypt(b"same", aad=b"id")

    # A fresh nonce per call, so equal plaintexts do not produce equal rows -
    # otherwise the database itself would show which accounts share a token.
    assert first != second
    assert crypto.decrypt(first, aad=b"id") == crypto.decrypt(second, aad=b"id")


def test_a_wrong_aad_does_not_open_the_value(store):
    sealed = crypto.encrypt(b"secret", aad=b"spotify")

    with pytest.raises(DecryptionError):
        crypto.decrypt(sealed, aad=b"hue")


def test_every_altered_byte_is_caught(store):
    sealed = crypto.encrypt(b"secret", aad=b"id")

    for position in range(len(sealed)):
        altered = bytearray(sealed)
        altered[position] ^= 0x01
        with pytest.raises(DecryptionError):
            crypto.decrypt(bytes(altered), aad=b"id")


def test_a_value_too_short_to_be_ours_is_rejected(store):
    with pytest.raises(DecryptionError):
        crypto.decrypt(b"", aad=b"id")

    with pytest.raises(DecryptionError):
        crypto.decrypt(b"x" * (crypto.NONCE_BYTES + crypto.TAG_BYTES - 1), aad=b"id")


def test_a_damaged_key_in_the_store_is_reported_not_used(store):
    store.values[(crypto.SERVICE_NAME, crypto.KEY_ACCOUNT)] = "this is not base64!!"
    crypto.forget_key()

    with pytest.raises(SecretsError):
        crypto.encryption_key()


def test_a_key_of_the_wrong_length_is_reported(store):
    store.values[(crypto.SERVICE_NAME, crypto.KEY_ACCOUNT)] = base64.b64encode(
        b"too short"
    ).decode("ascii")
    crypto.forget_key()

    with pytest.raises(SecretsError, match="9 bytes"):
        crypto.encryption_key()


def test_no_credential_store_is_a_clear_failure(store):
    keyring.set_keyring(keyring.backends.fail.Keyring())
    crypto.forget_key()

    with pytest.raises(SecretsError, match="no usable credential store"):
        crypto.encryption_key()


def test_an_insecure_backend_is_refused(store, monkeypatch):
    class PlaintextKeyring(keyring.backend.KeyringBackend):
        """Stands in for keyrings.alt, which writes the key to a file."""

        priority = 1  # type: ignore[assignment]

        def get_password(self, service, username):
            return None

        def set_password(self, service, username, password):
            pass

        def delete_password(self, service, username):
            pass

    # keyrings.alt is not a dependency, so the module name it would be found
    # under is what gets faked here - that name is what the check looks at.
    monkeypatch.setattr(PlaintextKeyring, "__module__", "keyrings.alt.file")
    keyring.set_keyring(PlaintextKeyring())
    crypto.forget_key()

    with pytest.raises(SecretsError, match="does not store the key securely"):
        crypto.encryption_key()


def test_an_unreachable_store_is_reported_as_such(store, monkeypatch):
    def refuse(*_args, **_kwargs):
        raise keyring.errors.KeyringError("the D-Bus session is not running")

    monkeypatch.setattr(keyring, "get_password", refuse)
    crypto.forget_key()

    with pytest.raises(SecretsError, match="could not be reached"):
        crypto.encryption_key()
