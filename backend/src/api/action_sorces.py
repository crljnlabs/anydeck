
from fastapi import APIRouter

from service import current_user

router = APIRouter(prefix="/action-sources", tags=["user"])


@router.get("", response_model= pass)
def read_current_user() -> pass:
    return current_user()
