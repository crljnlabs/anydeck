"""Stored credentials, as rows.

Both halves of a record live in one row, so writing them is one statement and
neither can be left behind by a failure in the middle. Nothing in here encrypts
or decrypts anything: the `encrypted` column arrives sealed and leaves sealed,
which is what keeps the key out of the storage layer entirely.
"""

from __future__ import annotations

import sqlite3

from db.connection import database


def upsert(
    secret_id: str, plain: str, encrypted: bytes | None, key_version: int
) -> None:
    """Write a record, replacing the one under this id if there is one.

    Replacing rather than failing, because connecting the same account twice is
    something a user does - a re-authorisation is the normal way a token gets
    renewed, not an error.
    """
    with database.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO secrets (id, plain, encrypted, key_version, updated_at)
            VALUES (?, ?, ?, ?, datetime('now'))
            ON CONFLICT (id) DO UPDATE SET
                plain       = excluded.plain,
                encrypted   = excluded.encrypted,
                key_version = excluded.key_version,
                updated_at  = excluded.updated_at
            """,
            (secret_id, plain, encrypted, key_version),
        )


def get(secret_id: str) -> sqlite3.Row | None:
    """The record under this id, or None when there is none."""
    with database.cursor() as cursor:
        # CAST, because SQLite types are per value, not per column: a row
        # written by something other than `upsert` can hold TEXT here, and the
        # driver then tries to decode it as UTF-8 and raises on the way out -
        # a sqlite3 error escaping the storage layer, where the caller is
        # expecting a SecretsError. Cast back to bytes and the tag check gets
        # to reject it properly.
        return cursor.execute(
            """
            SELECT id, plain, CAST(encrypted AS BLOB) AS encrypted,
                   key_version, updated_at
            FROM secrets WHERE id = ?
            """,
            (secret_id,),
        ).fetchone()
