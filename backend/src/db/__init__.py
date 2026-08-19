"""Storage: the SQLite connection, the schema, and one repository per subject.

A repository speaks rows and columns. It does not validate, decide or convert
into models - that is the service's job, and keeping it out of here is what
lets the storage change without the rest of the program noticing.

Repositories are exported as modules rather than as loose functions, because
they all answer the same few verbs. `users.get_settings` says whose settings;
a bare `get_settings` next to the service's own would not.
"""

from db import secrets, users
from db.connection import Database, database
from db.schema import current_version, migrate

__all__ = [
    "Database",
    "current_version",
    "database",
    "migrate",
    "secrets",
    "users",
]
