"""HTTP layer: the routes, and nothing else.

Every route is one line that hands the request to a service and returns what it
gets back. No logic, no model assembly, no database - if a route is doing more
than calling a service, the work belongs in `service`.

The routers are exported here so the routing table in app.py reads as a list of
what the backend exposes. `Tracked` is exported alongside them because it is part
of how a route is written, not part of what it does.
"""

from api.autostart import router as autostart_router
from api.dependencies import Tracked
from api.settings import router as settings_router
from api.user import router as user_router
from api.window import router as window_router

__all__ = [
    "Tracked",
    "autostart_router",
    "settings_router",
    "user_router",
    "window_router",
]
