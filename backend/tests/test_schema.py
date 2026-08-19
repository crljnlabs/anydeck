"""The migration that adds the secrets table."""

from __future__ import annotations

from db.connection import database
from db.schema import MIGRATIONS, current_version, migrate


def test_a_fresh_database_ends_up_at_the_newest_version(db):
    assert current_version() == len(MIGRATIONS)


def test_migrating_again_changes_nothing(db):
    with database.cursor() as cursor:
        cursor.execute(
            "INSERT INTO secrets (id, plain, encrypted, key_version) "
            "VALUES ('kept', '{\"a\": 1}', X'0102', 1)"
        )

    assert migrate() == len(MIGRATIONS)

    with database.cursor() as cursor:
        row = cursor.execute("SELECT * FROM secrets WHERE id = 'kept'").fetchone()

    assert row["plain"] == '{"a": 1}'
    assert row["encrypted"] == b"\x01\x02"


def test_upgrading_an_existing_database_keeps_its_data(tmp_path):
    """Version 1 to version 2, the way a released install will meet it."""
    original = database.path
    database.close()
    database._path = tmp_path / "old.sqlite3"

    try:
        # Only the first migration: an install from before secrets existed.
        with database.cursor() as cursor:
            cursor.executescript(MIGRATIONS[0])
            cursor.execute("PRAGMA user_version = 1")
            cursor.execute(
                "INSERT INTO users (username, display_name) VALUES ('jonathan', 'J')"
            )

        assert migrate() == len(MIGRATIONS)

        with database.cursor() as cursor:
            users = cursor.execute("SELECT username FROM users").fetchall()
            secrets = cursor.execute("SELECT COUNT(*) FROM secrets").fetchone()

        assert [row["username"] for row in users] == ["jonathan"]
        assert secrets[0] == 0
    finally:
        database.close()
        database._path = original


def test_the_secrets_table_looks_as_designed(db):
    with database.cursor() as cursor:
        columns = {
            row["name"]: row for row in cursor.execute("PRAGMA table_info(secrets)")
        }

    assert set(columns) == {"id", "plain", "encrypted", "key_version", "updated_at"}
    assert columns["id"]["pk"] == 1
    assert columns["id"]["type"] == "TEXT"
    assert columns["plain"]["type"] == "TEXT"
    assert columns["plain"]["notnull"] == 1
    assert columns["encrypted"]["type"] == "BLOB"
    assert columns["encrypted"]["notnull"] == 0
