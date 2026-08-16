"""HTTP surface for the window. No logic here - it calls a service."""

from __future__ import annotations

from fastapi import APIRouter

from models.window import WindowState
from service import window as window_service

router = APIRouter(prefix="/window", tags=["window"])


@router.post("/show", response_model=WindowState)
def show_window() -> WindowState:
    """Bring the window to the front.

    Used by a second instance of the program to hand over to the one already
    running, instead of both fighting over the same port.
    """
    return WindowState(shown=window_service.show())
