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


def _resource_dir(bundled_name: str, repo_path: tuple[str, ...]) -> Path | None:
    """A directory that sits somewhere else once the app is packaged.

    The app runs in two shapes: from the repository during development, and
    from a PyInstaller bundle, which unpacks its data next to the executable
    under `sys._MEIPASS`.
    """
    root = getattr(sys, "_MEIPASS", None)
    if root:
        bundled = Path(root) / bundled_name
        if bundled.is_dir():
            return bundled

    repo = Path(__file__).resolve().parents[3].joinpath(*repo_path)
    return repo if repo.is_dir() else None


def frontend_dir() -> Path | None:
    """The built frontend, or None when it has not been built yet."""
    return _resource_dir("web", ("frontend", "dist"))


def icons_dir() -> Path | None:
    """The application icons, used for the tray symbol and the window."""
    return _resource_dir("icons", ("assets", "icons"))
