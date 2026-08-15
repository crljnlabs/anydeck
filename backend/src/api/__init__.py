"""Every route the backend serves, collected under /api.

One module per service, mounted here. Adding a feature means adding a module
next to these and one include_router line.
"""

from fastapi import APIRouter

from api import settings, user

api_router = APIRouter(prefix="/api")
api_router.include_router(settings.router)
api_router.include_router(user.router)
