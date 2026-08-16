"""How anydeck starts another copy of itself.

Two callers need this: the login item, and the background process when it opens
a window. Both have the same problem - the command differs between a packaged
build and a checkout - and getting it wrong in one place only shows up much
later, so it lives in one place.
"""

from __future__ import annotations

import sys
from pathlib import Path


def self_command(*arguments: str) -> list[str]:
    """The command line that starts anydeck again, with the given arguments.

    A packaged build is a single executable and `sys.executable` is it. From a
    checkout, `sys.executable` is the Python interpreter, so the entry point has
    to be named as well.
    """
    if getattr(sys, "frozen", False):
        return [sys.executable, *arguments]

    entry_point = Path(__file__).resolve().parents[1] / "main.py"
    return [sys.executable, str(entry_point), *arguments]
