"""Start anydeck when the user logs in.

Per user, never system-wide: it is a preference of the person using it, and a
per-user entry needs no administrator rights. Each platform has its own place
for this, and all three are files or keys the user owns:

    macOS    ~/Library/LaunchAgents/<bundle>.plist
    Windows  HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
    Linux    ~/.config/autostart/anydeck.desktop

None of them pops a dialog when the app registers itself. macOS lists the entry
under System Settings > General > Login Items, where the user can switch it off,
and shows a notification the first time - which is why this has to be a visible
toggle in our own settings too, rather than something that happens quietly.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from models import Autostart, AutostartUpdate
from utils import Tracking, self_command

APP_NAME = "anydeck"

# Must match the bundle identifier in packaging/anydeck.spec. macOS keys the
# login item by this string, so if the two ever drift the entry points at
# something that is not the installed app.
BUNDLE_ID = "com.crljnlabs.anydeck"


def launch_command() -> list[str]:
    """How the operating system should start anydeck at login.

    --background: started at login it belongs in the menu bar, not in the user's
    face. Started by hand it opens the window instead.
    """
    return self_command("--background")


def get_autostart(tracking: Tracking) -> Autostart:
    """The setting as a whole, which is what a caller actually wants to know.

    Assembling this belongs here rather than in the API: which questions make
    up the answer is a decision about the setting, not about HTTP. An API
    module that built it would have to be edited every time the setting gains
    a field.
    """
    return Autostart(enabled=is_enabled(), supported=is_supported())


def set_autostart(tracking: Tracking, change: AutostartUpdate) -> Autostart:
    """Apply a change and report the state actually reached.

    Reached, not requested: switching it on can fail - an unsupported platform,
    a directory that cannot be written - and the interface has to show what is
    true rather than what was asked for.
    """
    with tracking.step("set-autostart"):
        reached = set_enabled(tracking, change.enabled)

        # The interesting case: the interface will show a switch that did not
        # move, and without this there would be nothing to explain why.
        if reached != change.enabled:
            tracking.note(
                "autostart did not reach the requested state",
                level="warning",
                values={"requested": change.enabled, "reached": reached},
            )
        else:
            tracking.track(
                "autostart.updated", {"enabled": reached}, level="success"
            )

        return get_autostart(tracking)


def is_supported() -> bool:
    return sys.platform in ("darwin", "win32") or sys.platform.startswith("linux")


def is_enabled() -> bool:
    if sys.platform == "darwin":
        return _plist_path().exists()
    if sys.platform == "win32":
        return _windows_value() is not None
    return _desktop_path().exists()


def set_enabled(tracking: Tracking, enabled: bool) -> bool:
    """Turn autostart on or off. Returns the state actually reached."""
    if not is_supported():
        tracking.note(
            f"autostart is not supported on {sys.platform}",
            level="warning",
        )
        return False

    try:
        if sys.platform == "darwin":
            _set_macos(enabled)
        elif sys.platform == "win32":
            _set_windows(tracking, enabled)
        else:
            _set_linux(enabled)
    except OSError as error:
        # Every platform writes a file or a registry value the user owns, and any
        # of them can refuse. Reported rather than raised, because this function
        # promises the state reached - and "unchanged" is a truthful answer that
        # the settings screen can render. The reason lands in the log file.
        tracking.note(
            f"could not write the autostart entry: {error}",
            level="warning",
            values={"requested": enabled},
        )

    return is_enabled()


# --- macOS ------------------------------------------------------------------


def _plist_path() -> Path:
    return Path.home() / "Library" / "LaunchAgents" / f"{BUNDLE_ID}.plist"


def _set_macos(enabled: bool) -> None:
    path = _plist_path()
    if not enabled:
        path.unlink(missing_ok=True)
        return

    arguments = "".join(f"        <string>{part}</string>\n" for part in launch_command())
    path.parent.mkdir(parents=True, exist_ok=True)
    # RunAtLoad starts it at login. KeepAlive is deliberately absent: if the
    # user quits from the tray, it should stay quit until the next login.
    path.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
        '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
        '<plist version="1.0">\n'
        "<dict>\n"
        "    <key>Label</key>\n"
        f"    <string>{BUNDLE_ID}</string>\n"
        "    <key>ProgramArguments</key>\n"
        "    <array>\n"
        f"{arguments}"
        "    </array>\n"
        "    <key>RunAtLoad</key>\n"
        "    <true/>\n"
        "</dict>\n"
        "</plist>\n"
    )


# --- Windows ----------------------------------------------------------------

_RUN_KEY = r"Software\Microsoft\Windows\CurrentVersion\Run"


def _windows_value() -> str | None:
    import winreg

    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, _RUN_KEY) as key:
            return winreg.QueryValueEx(key, APP_NAME)[0]
    except OSError:
        # Missing key or missing value both mean "not registered".
        return None


def _set_windows(tracking: Tracking, enabled: bool) -> None:
    import winreg

    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, _RUN_KEY) as key:
        if enabled:
            command = " ".join(f'"{part}"' for part in launch_command())
            winreg.SetValueEx(key, APP_NAME, 0, winreg.REG_SZ, command)
        else:
            try:
                winreg.DeleteValue(key, APP_NAME)
            except OSError as error:
                # Almost always "there was no value to delete", which is the
                # requested state already. Noted, not raised - but noted, because
                # the other reading is a permission problem.
                tracking.note(f"no autostart value to remove: {error}")


# --- Linux ------------------------------------------------------------------


def _desktop_path() -> Path:
    config = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
    return config / "autostart" / f"{APP_NAME}.desktop"


def _set_linux(enabled: bool) -> None:
    path = _desktop_path()
    if not enabled:
        path.unlink(missing_ok=True)
        return

    command = " ".join(launch_command())
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "[Desktop Entry]\n"
        "Type=Application\n"
        f"Name={APP_NAME}\n"
        f"Exec={command}\n"
        "Terminal=false\n"
        "X-GNOME-Autostart-enabled=true\n"
    )
