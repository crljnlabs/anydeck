"""Fixtures: a throwaway database and a credential store that is not the user's.

Both are replaced rather than mocked away. The point of these tests is the round
trip through real SQLite and real AES-GCM; what has to go is only the two places
that would otherwise touch the machine the tests run on - the user's data
directory and the user's keychain.
"""

from __future__ import annotations

import pytest

import keyring
import keyring.backend

from db.connection import database
from db.schema import migrate
from utils import crypto


class MemoryKeyring(keyring.backend.KeyringBackend):
    """A credential store that lives and dies with one test.

    A real backend would mean a test suite that prompts, that leaves entries
    behind on the developer's machine, and that behaves differently on the three
    platforms this is built for.
    """

    priority = 1  # type: ignore[assignment]

    def __init__(self) -> None:
        self.values: dict[tuple[str, str], str] = {}
        # So a test can assert that something did *not* reach the store.
        self.reads = 0
        self.writes = 0

    def get_password(self, service: str, username: str) -> str | None:
        self.reads += 1
        return self.values.get((service, username))

    def set_password(self, service: str, username: str, password: str) -> None:
        self.writes += 1
        self.values[(service, username)] = password

    def delete_password(self, service: str, username: str) -> None:
        self.values.pop((service, username), None)


@pytest.fixture
def store() -> MemoryKeyring:
    """The credential store for one test, installed as keyring's backend."""
    original = keyring.get_keyring()
    replacement = MemoryKeyring()
    keyring.set_keyring(replacement)
    crypto.forget_key()
    try:
        yield replacement
    finally:
        keyring.set_keyring(original)
        crypto.forget_key()


@pytest.fixture
def db(tmp_path):
    """An empty, migrated database, thrown away afterwards.

    `database` is one object for the process and takes its path at construction,
    so pointing it somewhere else means writing the private attribute. Doing it
    here keeps that to one place; the alternative would be a setter on Database
    that exists for no reason but the tests.
    """
    original = database.path
    database.close()
    database._path = tmp_path / "test.sqlite3"
    migrate()
    try:
        yield database
    finally:
        database.close()
        database._path = original


@pytest.fixture
def raw(db):
    """A second, plain connection to the same file.

    Used to look at what actually landed on disk, rather than at what the code
    under test says it wrote.
    """
    import sqlite3

    connection = sqlite3.connect(db.path)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()
