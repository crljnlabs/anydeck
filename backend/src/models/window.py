"""Data layer: the result of asking for the window."""

from __future__ import annotations

from pydantic import BaseModel


class WindowState(BaseModel):
    # False when the process has no window to show - during development the
    # backend often runs on its own, with the interface in a browser.
    shown: bool
