"""Data layer: the shapes that travel between the layers and over the wire.

Nothing in here does anything - no logic, no storage, no HTTP. A model is what
a service returns and what the API declares it returns, which is why both
import from this one place.

Everything the rest of the program uses is listed below, so this file answers
"what data does anydeck have" without opening four others.
"""

from models.autostart import Autostart, AutostartUpdate
from models.settings import Settings, SettingsUpdate
from models.user import User
from models.window import WindowState

__all__ = [
    "Autostart",
    "AutostartUpdate",
    "Settings",
    "SettingsUpdate",
    "User",
    "WindowState",
]
