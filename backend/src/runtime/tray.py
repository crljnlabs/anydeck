"""The menu bar icon, and the whole user interface until a window is opened.

Kept deliberately small: everything in it works today. A device status line and
a "search now" entry belong here too, but both need the listener, and a menu
full of items that do nothing is worse than a short menu.
"""

from __future__ import annotations

# Imported for its side effect as much as for the name: pystray's macOS backend
# does `import PIL` and then uses `PIL.Image`, which only resolves because
# something else imported the submodule first. That something is this line.
from PIL import Image

import pystray

from runtime import window
# The plain questions rather than the model-returning ones: a menu checkbox
# needs a bool, not an Autostart. Both live in the same service.
from service.autostart import is_enabled, is_supported, set_enabled
from utils import icons_dir

APP_NAME = "Anydeck"

# The menu bar renders around 22 px; 64 gives the backend room to downscale
# cleanly on a Retina display without us shipping a second file.
ICON_FILE = "anydeck-64.png"


def _icon_image() -> Image.Image:
    directory = icons_dir()
    if directory is None:
        raise FileNotFoundError(
            "Application icons not found. Generate them with scripts/icons.py."
        )
    return Image.open(directory / ICON_FILE)


def build(on_quit, *, labels: dict[str, str] | None = None) -> pystray.Icon:
    """Create the tray icon. Running it is the caller's job - see `run` below.

    Every callback here runs on the loop's own thread, so none of them may do
    real work: a slow callback freezes the menu. Opening the window is only a
    process start, and the expensive part happens inside that process.
    """
    text = {
        "open": "Open window",
        "autostart": "Start with the system",
        "quit": "Quit",
        **(labels or {}),
    }

    def toggle_autostart(_icon, item) -> None:
        set_enabled(not item.checked)

    menu_items = [
        pystray.MenuItem(text["open"], lambda: window.open(), default=True),
        pystray.Menu.SEPARATOR,
    ]

    # Hidden where the platform cannot offer it, rather than shown and inert.
    if is_supported():
        menu_items += [
            pystray.MenuItem(
                text["autostart"],
                toggle_autostart,
                # pystray requires a callable here; a plain bool raises.
                checked=lambda _item: is_enabled(),
            ),
            pystray.Menu.SEPARATOR,
        ]

    menu_items.append(pystray.MenuItem(text["quit"], lambda: on_quit()))

    return pystray.Icon(
        APP_NAME,
        _icon_image(),
        APP_NAME,
        menu=pystray.Menu(*menu_items),
    )


def run(icon: pystray.Icon) -> None:
    """Hand the main thread to the tray, and return when it is asked to stop.

    `icon.run()` - the supported path - rather than the detached one. That is
    only possible because this process never opens a window itself: pystray owns
    the run loop from start to finish and nothing else competes for it.
    """
    icon.run()
