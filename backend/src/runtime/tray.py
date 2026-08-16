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

from service import autostart as autostart_service
from utils.paths import icons_dir

APP_NAME = "anydeck"

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


def build(lifecycle, *, labels: dict[str, str] | None = None) -> pystray.Icon:
    """Create the tray icon. It does not run anything - see runtime.lifecycle.

    Every callback here runs on the main thread inside the GUI loop on macOS, so
    none of them may do real work: a slow callback freezes the whole interface.
    Opening the window in particular only asks the lifecycle to hand the thread
    over, and the expensive part happens after that.
    """
    text = {
        "open": "Open window",
        "autostart": "Start with the system",
        "quit": "Quit",
        **(labels or {}),
    }

    def toggle_autostart(_icon, item) -> None:
        autostart_service.set_enabled(not item.checked)

    menu_items = [
        pystray.MenuItem(text["open"], lambda: lifecycle.request_window(), default=True),
        pystray.Menu.SEPARATOR,
    ]

    # Hidden where the platform cannot offer it, rather than shown and inert.
    if autostart_service.is_supported():
        menu_items += [
            pystray.MenuItem(
                text["autostart"],
                toggle_autostart,
                # pystray requires a callable here; a plain bool raises.
                checked=lambda _item: autostart_service.is_enabled(),
            ),
            pystray.Menu.SEPARATOR,
        ]

    menu_items.append(pystray.MenuItem(text["quit"], lambda: lifecycle.request_quit()))

    return pystray.Icon(
        APP_NAME,
        _icon_image(),
        APP_NAME,
        menu=pystray.Menu(*menu_items),
        **lifecycle.tray_options(),
    )


def start(icon: pystray.Icon) -> None:
    """Put the icon on screen without letting pystray run a loop of its own.

    Two deliberate deviations from `icon.run()`, both required:

    `run_detached` instead of `run`, because `run`'s loop owns the status item
    and removes it when the loop ends - and ending that loop is exactly how the
    window gets opened.

    An empty setup callback instead of the default one, because the default sets
    `visible = True` on a thread pystray spawns for it. On macOS that touches
    AppKit from a background thread. It does not fail there and then: the process
    aborts with SIGTRAP later, the moment the GUI loop next validates its state -
    which is when the user first opens the window. Making the icon visible from
    the calling thread, which is the main one, avoids it entirely.
    """
    icon.run_detached(setup=lambda _icon: None)
    icon.visible = True
