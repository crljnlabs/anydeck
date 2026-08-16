"""Data layer: whether anydeck starts with the system."""

from __future__ import annotations

from pydantic import BaseModel


class Autostart(BaseModel):
    enabled: bool
    # Not every environment can offer it - a container, or a desktop this code
    # does not know. The interface hides the row rather than showing a switch
    # that does nothing.
    supported: bool


class AutostartUpdate(BaseModel):
    enabled: bool
