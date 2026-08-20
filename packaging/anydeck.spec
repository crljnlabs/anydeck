# PyInstaller spec for anydeck.
#
# Run through scripts/build.py, not through pyinstaller directly: the script
# builds the frontend first, and this spec bundles the result as "web/" next to
# the executable. The backend serves that directory as static files.

import sys
from pathlib import Path

PROJECT_DIR = Path(SPECPATH).parent  # noqa: F821 - SPECPATH is injected by PyInstaller
BACKEND_DIR = PROJECT_DIR / "backend"
BACKEND_SRC = BACKEND_DIR / "src"
FRONTEND_DIST = PROJECT_DIR / "frontend" / "dist"
ICONS_DIR = PROJECT_DIR / "assets" / "icons"

if not FRONTEND_DIST.is_dir():
    raise SystemExit("frontend/dist is missing - build through scripts/build.py")
if not ICONS_DIR.is_dir():
    raise SystemExit("assets/icons is missing - generate it with scripts/icons.py")

# Windows wants .ico, macOS wants .icns. On Linux the executable carries no
# icon at all; there the .desktop entry points at the installed hicolor PNGs.
EXECUTABLE_ICON = str(ICONS_DIR / "anydeck.ico") if sys.platform == "win32" else None

# uvicorn resolves these at runtime via importlib, so the static analysis of
# PyInstaller cannot find them on its own.
HIDDEN_IMPORTS = [
    # uvicorn picks its protocol and loop implementations by name at runtime,
    # so nothing imports them statically for PyInstaller to follow.
    "uvicorn.logging",
    "uvicorn.loops",
    "uvicorn.loops.auto",
    "uvicorn.protocols",
    "uvicorn.protocols.http",
    "uvicorn.protocols.http.auto",
    "uvicorn.protocols.websockets",
    "uvicorn.protocols.websockets.auto",
    "uvicorn.lifespan",
    "uvicorn.lifespan.on",
    # pystray and pywebview both choose a backend from sys.platform. Only the
    # host's own backend is listed - naming the others would drag in toolkits
    # that are not installed here.
    "PIL.Image",
    "pystray",
    "webview",
]

if sys.platform == "darwin":
    HIDDEN_IMPORTS += [
        "pystray._darwin",
        "webview.platforms.cocoa",
        "objc",
        "AppKit",
        "Foundation",
        "WebKit",
    ]
elif sys.platform == "win32":
    HIDDEN_IMPORTS += ["pystray._win32", "webview.platforms.winforms"]
else:
    HIDDEN_IMPORTS += [
        "pystray._appindicator",
        "pystray._xorg",
        "webview.platforms.gtk",
        "gi",
    ]


analysis = Analysis(  # noqa: F821
    [str(BACKEND_SRC / "main.py")],
    # api, service, models, db and utils are imported by their top-level names,
    # so the package root has to be on the path, not the backend directory.
    pathex=[str(BACKEND_SRC)],
    binaries=[],
    # web/   the built frontend, served by the backend
    # icons/ the tray icon and window icon, loaded at runtime
    datas=[(str(FRONTEND_DIST), "web"), (str(ICONS_DIR), "icons")],
    hiddenimports=HIDDEN_IMPORTS,
    hookspath=[],
    runtime_hooks=[],
    excludes=["tkinter"],
    noarchive=False,
)

pyz = PYZ(analysis.pure)  # noqa: F821

executable = EXE(  # noqa: F821
    pyz,
    analysis.scripts,
    [],
    exclude_binaries=True,
    name="Anydeck",
    debug=False,
    strip=False,
    upx=False,
    # Background/tray application, so no console window.
    console=False,
    icon=EXECUTABLE_ICON,
)

collection = COLLECT(  # noqa: F821
    executable,
    analysis.binaries,
    analysis.datas,
    strip=False,
    upx=False,
    name="Anydeck",
)

if sys.platform == "darwin":
    bundle = BUNDLE(  # noqa: F821
        collection,
        name="Anydeck.app",
        icon=str(ICONS_DIR / "anydeck.icns"),
        bundle_identifier="com.crljnlabs.anydeck",
        info_plist={
            # Tray application: no dock icon, no menu bar entry.
            "LSUIElement": True,
            "NSHighResolutionCapable": True,
        },
    )
