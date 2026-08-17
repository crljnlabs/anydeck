"""Small things the other layers need and none of them owns.

Nothing here knows about anydeck's subject matter - no devices, no mappings, no
settings. It is where the program finds out where it is installed, where it may
write, how to start a copy of itself, and where to record what happened.

Anything that would need to know what anydeck is *for* belongs in `service`.
"""

from utils.launch import self_command
from utils.logging import log_path, setup_logging
from utils.paths import data_dir, database_path, frontend_dir, icons_dir

__all__ = [
    "data_dir",
    "database_path",
    "frontend_dir",
    "icons_dir",
    "log_path",
    "self_command",
    "setup_logging",
]
