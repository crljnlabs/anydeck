"""SQLite connection handling.

This module owns the connection and nothing else. It creates no tables, knows
no table names and runs no queries of its own - those belong to the repositories
in `db/`, which ask this class for a cursor. Keeping it that way means there is
exactly one place that decides how the connection is configured, and swapping
the storage engine later touches one file instead of every query.
"""

from __future__ import annotations

import sqlite3
import threading
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from utils.paths import database_path


class Database:
    """A configured SQLite connection, safe to share across threads.

    The device listener runs in its own thread while the API answers requests,
    so both can reach the database at the same time. SQLite allows that only
    under conditions this class sets up:

    - `check_same_thread=False` plus a lock, because a connection may not be
      used from two threads at once even though it may move between them.
    - WAL, so a reader is not blocked while the listener writes.
    - A busy timeout, so a concurrent write waits instead of raising.
    """

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or database_path()
        self._lock = threading.Lock()
        self._connection: sqlite3.Connection | None = None

    @property
    def path(self) -> Path:
        return self._path

    def connect(self) -> sqlite3.Connection:
        if self._connection is None:
            connection = sqlite3.connect(self._path, check_same_thread=False)
            # Rows behave like dicts, so callers read columns by name and a new
            # column cannot silently shift an index somewhere else.
            connection.row_factory = sqlite3.Row
            connection.execute("PRAGMA journal_mode = WAL")
            connection.execute("PRAGMA foreign_keys = ON")
            connection.execute("PRAGMA busy_timeout = 5000")
            self._connection = connection
        return self._connection

    @contextmanager
    def cursor(self) -> Iterator[sqlite3.Cursor]:
        """A cursor in a transaction: committed on success, rolled back on error.

        Every repository goes through here, so no caller has to remember to
        commit and a half-finished write cannot be left behind.
        """
        with self._lock:
            connection = self.connect()
            cursor = connection.cursor()
            try:
                yield cursor
                connection.commit()
            except Exception:
                connection.rollback()
                raise
            finally:
                cursor.close()

    def close(self) -> None:
        with self._lock:
            if self._connection is not None:
                self._connection.close()
                self._connection = None


# One connection for the process. The app is a single program by design, so a
# pool would add coordination without buying anything.
database = Database()
