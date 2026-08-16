"""The window, seen from the background process.

From here the window is a child process, not an object: started when the user
asks for one, and gone when they close it. See `window_process` for why it is a
separate process at all.
"""

from __future__ import annotations

import os
import subprocess

from app import HOST, PORT
from utils.launch import self_command

# Points at the frontend our own backend serves. During frontend development it
# is set to the vite server instead, which is the only way to get hot reloading
# inside the real window - see scripts/dev.py --app.
DEFAULT_URL = os.environ.get("ANYDECK_WINDOW_URL", f"http://{HOST}:{PORT}/")

_process: subprocess.Popen | None = None


def is_open() -> bool:
    return _process is not None and _process.poll() is None


def open() -> None:  # noqa: A001 - the verb is the clearest name here
    """Show the window, starting the process if it is not running.

    Safe to call from a tray callback: starting a process is quick, and the slow
    part - building the webview - happens in the child.
    """
    global _process

    if is_open():
        # The child cannot raise itself from the outside, so it is told to.
        _send("show")
        return

    _process = subprocess.Popen(
        self_command("--window", DEFAULT_URL),
        stdin=subprocess.PIPE,
        text=True,
    )


def close() -> None:
    """Ask the window to go away, and make sure it did."""
    global _process

    if not is_open():
        _process = None
        return

    _send("quit")
    try:
        _process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        _process.kill()

    _process = None


def _send(command: str) -> None:
    if _process is None or _process.stdin is None:
        return
    try:
        _process.stdin.write(f"{command}\n")
        _process.stdin.flush()
    except (BrokenPipeError, ValueError):
        # The child went away between the check and the write. Nothing to do -
        # the next open() will start a fresh one.
        pass
