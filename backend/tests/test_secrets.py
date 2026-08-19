"""The round trip, and the ways it is supposed to fail."""

from __future__ import annotations

import json

import pytest

from utils import crypto
from utils.error import DecryptionError, SecretsError
from utils.secrets import load_secrets, save_secrets

TOKEN = {
    "access_token": "ya29.a0AfH6SM",
    "refresh_token": "1//0gK-Ünïcödé-🔐",
    "scopes": ["read", "write"],
    "expires_in": 3600,
    "nested": {"issued": {"by": "test"}},
    "revoked": False,
    "note": None,
}
ACCOUNT = {"display_name": "Jonathan", "provider": "spotify", "expires_at": 1770000000}


def test_round_trip_keeps_both_halves_exactly(db, store):
    save_secrets("spotify", TOKEN, ACCOUNT)

    assert load_secrets("spotify") == {
        "encrypted_data": TOKEN,
        "plain_data": ACCOUNT,
    }


def test_what_comes_out_can_go_straight_back_in(db, store):
    save_secrets("spotify", TOKEN, ACCOUNT)

    # The shape reading gives is the shape writing takes - the documented way to
    # move a record through without taking it apart.
    save_secrets("spotify", **load_secrets("spotify"))

    assert load_secrets("spotify") == {
        "encrypted_data": TOKEN,
        "plain_data": ACCOUNT,
    }


def test_unknown_id_is_none_not_an_error(db, store):
    assert load_secrets("never-stored") is None


def test_saving_twice_replaces_rather_than_duplicates(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)
    save_secrets("spotify", {"access_token": "second"}, {"display_name": "Second"})

    rows = raw.execute("SELECT id FROM secrets").fetchall()
    assert len(rows) == 1
    assert load_secrets("spotify") == {
        "encrypted_data": {"access_token": "second"},
        "plain_data": {"display_name": "Second"},
    }


def test_two_ids_do_not_share_a_record(db, store):
    save_secrets("spotify", {"access_token": "a"}, {"display_name": "A"})
    save_secrets("hue", {"access_token": "b"}, {"display_name": "B"})

    assert load_secrets("spotify")["encrypted_data"] == {"access_token": "a"}
    assert load_secrets("hue")["encrypted_data"] == {"access_token": "b"}


def test_empty_dicts_survive_as_empty_dicts(db, store):
    save_secrets("bare", {}, {})

    assert load_secrets("bare") == {"encrypted_data": {}, "plain_data": {}}


def test_a_record_without_secrets_never_touches_the_credential_store(db, store):
    save_secrets("public-only", {}, {"display_name": "No credentials here"})
    load_secrets("public-only")

    assert (store.reads, store.writes) == (0, 0)


# --- what is actually on disk ---------------------------------------------


def test_plain_data_stays_readable_without_the_key(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    stored = raw.execute("SELECT plain FROM secrets WHERE id = 'spotify'").fetchone()
    assert json.loads(stored["plain"]) == ACCOUNT


def test_encrypted_data_is_not_readable_on_disk(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    blob = raw.execute("SELECT encrypted FROM secrets WHERE id = 'spotify'").fetchone()[0]
    assert isinstance(blob, bytes)

    # Not just "it is different" - none of the secret values, and none of the
    # field names, may appear anywhere in the stored bytes.
    for value in ("ya29.a0AfH6SM", "1//0gK", "access_token", "refresh_token"):
        assert value.encode("utf-8") not in blob


def test_the_key_is_in_the_credential_store_and_not_in_the_database(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    key = crypto.encryption_key()
    assert len(key) == crypto.KEY_BYTES

    dump = b"".join(
        bytes(str(column), "utf-8") if not isinstance(column, bytes) else column
        for row in raw.execute("SELECT * FROM secrets")
        for column in tuple(row)
    )
    assert key not in dump


# --- the failures that must not be silent ---------------------------------


def test_a_flipped_byte_raises_instead_of_returning_something(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    blob = raw.execute("SELECT encrypted FROM secrets WHERE id = 'spotify'").fetchone()[0]
    tampered = bytes([blob[0] ^ 0x01]) + blob[1:]
    raw.execute("UPDATE secrets SET encrypted = ? WHERE id = 'spotify'", (tampered,))
    raw.commit()

    with pytest.raises(DecryptionError):
        load_secrets("spotify")


def test_a_truncated_value_raises(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    raw.execute("UPDATE secrets SET encrypted = ? WHERE id = 'spotify'", (b"short",))
    raw.commit()

    with pytest.raises(DecryptionError):
        load_secrets("spotify")


def test_a_blob_moved_to_another_id_does_not_open(db, store, raw):
    save_secrets("spotify", {"access_token": "spotify-token"}, {})
    save_secrets("hue", {"access_token": "hue-token"}, {})

    stolen = raw.execute("SELECT encrypted FROM secrets WHERE id = 'spotify'").fetchone()[0]
    raw.execute("UPDATE secrets SET encrypted = ? WHERE id = 'hue'", (stolen,))
    raw.commit()

    # The whole point of binding the id in: this must not hand back spotify's
    # token under hue's name.
    with pytest.raises(DecryptionError):
        load_secrets("hue")


def test_a_different_key_raises(db, store):
    save_secrets("spotify", TOKEN, ACCOUNT)

    store.values.clear()  # as if the keychain entry had been deleted
    crypto.forget_key()

    with pytest.raises(DecryptionError):
        load_secrets("spotify")


def test_a_row_from_another_key_version_says_so(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    raw.execute("UPDATE secrets SET key_version = 99 WHERE id = 'spotify'")
    raw.commit()

    with pytest.raises(DecryptionError, match="key version 99"):
        load_secrets("spotify")


def test_damaged_plain_json_raises_rather_than_falling_back(db, store, raw):
    save_secrets("spotify", TOKEN, ACCOUNT)

    raw.execute("UPDATE secrets SET plain = '{not json' WHERE id = 'spotify'")
    raw.commit()

    with pytest.raises(SecretsError):
        load_secrets("spotify")


def test_a_value_that_cannot_be_stored_is_refused_at_the_door(db, store, raw):
    class Unstorable:
        pass

    with pytest.raises(SecretsError):
        save_secrets("spotify", {"handle": Unstorable()}, ACCOUNT)

    # And nothing half-written was left behind.
    assert raw.execute("SELECT COUNT(*) FROM secrets").fetchone()[0] == 0


def test_something_that_is_not_a_dict_is_refused(db, store):
    with pytest.raises(SecretsError):
        save_secrets("spotify", ["not", "a", "dict"], ACCOUNT)

    with pytest.raises(SecretsError):
        save_secrets("spotify", TOKEN, "not a dict")


def test_a_row_holding_text_instead_of_bytes_still_fails_as_a_secrets_error(
    db, store, raw
):
    """SQLite types are per value: the column can hold something we never wrote.

    Without the CAST in the repository the driver raises sqlite3.OperationalError
    while decoding the column, which walks straight past every caller that is
    catching SecretsError.
    """
    save_secrets("spotify", TOKEN, ACCOUNT)

    raw.execute(
        "UPDATE secrets SET encrypted = CAST(X'FFFE00' AS TEXT) WHERE id = 'spotify'"
    )
    raw.commit()

    with pytest.raises(SecretsError):
        load_secrets("spotify")
