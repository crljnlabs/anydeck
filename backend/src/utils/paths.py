"""Where anydeck keeps its per-user data.

Everything the app stores lives under the current operating-system user's own
data directory. That is what makes a system-wide install work for several
people on one machine: the program is shared, the configuration is not, and
neither user can see or clobber the other's mappings. No extra profile handling
is needed for it - the OS already separates them.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

APP_NAME = "anydeck"


def data_dir() -> Path:
    """Per-user directory for the database and any other persistent state."""
    if sys.platform == "darwin":
        base = Path.home() / "Library" / "Application Support"
    elif sys.platform == "win32":
        base = Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming"))
    else:
        # XDG. The fallback is what the spec prescribes when the variable is unset.
        base = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))

    directory = base / APP_NAME
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def database_path() -> Path:
    return data_dir() / "anydeck.sqlite3"


def frontend_dir() -> Path | None:
    """The built frontend, or None when it has not been built yet.

    Two locations, because the app runs in two shapes: from the repository
    during development, and from a PyInstaller bundle once packaged, where the
    build script drops the frontend next to the executable as `web/`.
    """
    bundled = Path(getattr(sys, "_MEIPASS", "")) / "web" if hasattr(sys, "_MEIPASS") else None
    if bundled and bundled.is_dir():
        return bundled

    repo = Path(__file__).resolve().parents[3] / "frontend" / "dist"
    return repo if repo.is_dir() else None
