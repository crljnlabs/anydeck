"""HTTP surface for the window. No logic here - it calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from api.dependencies import Tracked
from models import WindowState
from service import show_window

router = APIRouter(prefix="/window", tags=["window"])


@router.post("/show", response_model=WindowState)
def show(tracking: Tracked) -> WindowState:
    """Bring the window to the front.

    Used by a second instance of the program to hand over to the one already
    running, instead of both fighting over the same port.
    """
    return show_window(tracking)
