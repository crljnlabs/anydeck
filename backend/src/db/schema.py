"""Table definitions and migrations.

Centrally, not per repository, for three reasons: order matters (a foreign key
needs its target table first), it has to happen exactly once before anything
queries rather than at whichever repository is used first, and a column added
later needs a record of what has already been applied.

`PRAGMA user_version` is that record - an integer SQLite stores in the database
file itself. Each migration below is applied once, in order, and the version is
bumped. Never edit a migration that has shipped; add the next one.
"""

from __future__ import annotations

from db.connection import database

# Each entry is one step. The index is the version it produces, so MIGRATIONS[0]
# takes a fresh database from version 0 to version 1.
MIGRATIONS: list[str] = [
    # 1: users and their settings.
    """
    CREATE TABLE users (
        id            INTEGER PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        display_name  TEXT NOT NULL,
        created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Settings are per user and open-ended: one row per key, rather than one
    -- column per setting. A new preference is then an INSERT rather than a
    -- migration, which matters because settings are exactly the kind of thing
    -- that keeps growing.
    CREATE TABLE settings (
        user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name     TEXT NOT NULL,
        value    TEXT NOT NULL,
        PRIMARY KEY (user_id, name)
    );
    """,
    # 2: stored credentials.
    """
    -- One row per id, because the id IS the link between the two halves. As a
    -- primary key of one shared row that link is a guarantee of the database;
    -- spread over two tables it would be a join every caller has to get right,
    -- plus the possibility of one half existing without the other. A single
    -- upsert also writes both halves at once, so a half-updated record cannot
    -- be produced.
    CREATE TABLE secrets (
        -- Chosen by the caller ("spotify", "hue-bridge"), not generated, because
        -- the caller has to be able to find its own record again.
        id           TEXT PRIMARY KEY,

        -- The readable half, as a JSON object. Not name/value rows like
        -- `settings`: that table has a fixed vocabulary whose entries are read
        -- one at a time, while this is a differently shaped dict per id that is
        -- only ever read whole. JSON also keeps types - an expiry stays a
        -- number - which the TEXT column of `settings` cannot.
        plain        TEXT NOT NULL DEFAULT '{}',

        -- The confidential half: nonce + ciphertext + tag, AES-256-GCM. One
        -- blob for the whole dict rather than one per field, because per-field
        -- would publish the field names and how many there are - the very
        -- metadata that says what is being kept. NULL when there is nothing
        -- confidential to keep.
        encrypted    BLOB,

        -- Which key sealed this row. Without it, "the key in the keychain was
        -- replaced" and "these bytes are damaged" are the same failed tag check.
        key_version  INTEGER NOT NULL DEFAULT 1,

        updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """,
]


def migrate() -> int:
    """Apply every migration the database has not seen. Returns the new version.

    Safe to call on every start: a database already at the newest version does
    nothing but one PRAGMA read.
    """
    with database.cursor() as cursor:
        version = cursor.execute("PRAGMA user_version").fetchone()[0]

        for index in range(version, len(MIGRATIONS)):
            cursor.executescript(MIGRATIONS[index])
            # PRAGMA does not take a bound parameter, and the value is an int
            # from range(), not from anything a user typed.
            cursor.execute(f"PRAGMA user_version = {index + 1}")

        return len(MIGRATIONS)


def current_version() -> int:
    with database.cursor() as cursor:
        return cursor.execute("PRAGMA user_version").fetchone()[0]
