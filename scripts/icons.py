#!/usr/bin/env python3
"""Generate every icon format from assets/icon.svg.

The generated files are committed to the repository so that neither the build
script nor the CI runners need an SVG rasterizer. Run this script again only
when the artwork itself changes.

Produces:
    assets/icons/anydeck-<size>.png   16-1024 px, also used for Linux hicolor
    assets/icons/anydeck.ico          Windows executable and installer
    assets/icons/anydeck.icns         macOS application bundle (needs macOS)
    frontend/public/favicon.svg       favicon of the web UI
    frontend/public/favicon.ico       favicon fallback, 16/32/48 px
    frontend/public/icon-192.png      web app manifest icon
    frontend/public/icon-512.png      web app manifest icon

Requires one SVG rasterizer: inkscape, rsvg-convert or ImageMagick.

Usage:
    python3 scripts/icons.py
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

import _common as common

SOURCE = common.ASSETS_DIR / "icon.svg"
ICONS_DIR = common.ICONS_DIR

PNG_SIZES = (16, 24, 32, 48, 64, 128, 192, 256, 512, 1024)
ICO_SIZES = (16, 24, 32, 48, 64, 128, 256)   # Windows executable and installer
FAVICON_ICO_SIZES = (16, 32, 48)             # browser tab / bookmark bar
MANIFEST_SIZES = (192, 512)                  # "install as app" in Chrome/Edge
# Apple's naming scheme for an .iconset directory.
ICNS_ENTRIES = (
    (16, "icon_16x16.png"),
    (32, "icon_16x16@2x.png"),
    (32, "icon_32x32.png"),
    (64, "icon_32x32@2x.png"),
    (128, "icon_128x128.png"),
    (256, "icon_128x128@2x.png"),
    (256, "icon_256x256.png"),
    (512, "icon_256x256@2x.png"),
    (512, "icon_512x512.png"),
    (1024, "icon_512x512@2x.png"),
)


def rasterizer() -> list:
    """Return a callable command template for SVG -> PNG conversion."""
    if common.tool_available("inkscape"):
        return ["inkscape"]
    if common.tool_available("rsvg-convert"):
        return ["rsvg-convert"]
    for name in ("magick", "convert"):
        if common.tool_available(name):
            return [name]
    common.fail("No SVG rasterizer found. Install one: inkscape, rsvg-convert or imagemagick")
    raise AssertionError("unreachable")


def render(size: int, target: Path) -> Path:
    tool = rasterizer()[0]
    if tool == "inkscape":
        command = [
            tool, str(SOURCE),
            "--export-type=png",
            f"--export-width={size}", f"--export-height={size}",
            f"--export-filename={target}",
        ]
    elif tool == "rsvg-convert":
        command = [tool, "-w", str(size), "-h", str(size), "-o", str(target), str(SOURCE)]
    else:
        command = [tool, "-background", "none", "-density", "384",
                   str(SOURCE), "-resize", f"{size}x{size}", str(target)]
    subprocess.run(command, check=True, capture_output=True)
    if not target.exists():
        common.fail(f"Rasterizing {size}px failed")
    return target


def build_pngs() -> dict:
    common.info(f"Rendering PNGs with {rasterizer()[0]}")
    rendered = {}
    for size in PNG_SIZES:
        target = ICONS_DIR / f"anydeck-{size}.png"
        rendered[size] = render(size, target)
        print(f"    {target.name}")
    return rendered


def write_ico(python: Path, target: Path, sizes: tuple) -> Path:
    """Write a multi-resolution .ico. Pillow comes from the backend venv."""
    common.info(f"Writing {target.name} ({', '.join(str(size) for size in sizes)} px)")
    script = (
        "from PIL import Image;"
        f"img = Image.open(r'{ICONS_DIR / 'anydeck-1024.png'}').convert('RGBA');"
        f"img.save(r'{target}', sizes={[(size, size) for size in sizes]})"
    )
    common.run([str(python), "-c", script])
    return target


def build_icns() -> Path | None:
    target = ICONS_DIR / "anydeck.icns"
    if not common.tool_available("iconutil"):
        common.warn("iconutil not found (macOS only) - anydeck.icns was not regenerated")
        return None

    common.info("Writing anydeck.icns")
    with tempfile.TemporaryDirectory() as directory:
        iconset = Path(directory) / "anydeck.iconset"
        iconset.mkdir()
        for size, name in ICNS_ENTRIES:
            shutil.copy2(ICONS_DIR / f"anydeck-{size}.png", iconset / name)
        common.run(["iconutil", "--convert", "icns", "--output", str(target), str(iconset)])
    return target


def build_frontend_assets(python: Path) -> None:
    """Favicons and the icons referenced by public/site.webmanifest."""
    public = common.FRONTEND_DIR / "public"
    public.mkdir(parents=True, exist_ok=True)

    shutil.copy2(SOURCE, public / "favicon.svg")
    write_ico(python, public / "favicon.ico", FAVICON_ICO_SIZES)
    for size in MANIFEST_SIZES:
        shutil.copy2(ICONS_DIR / f"anydeck-{size}.png", public / f"icon-{size}.png")

    common.info(f"Frontend icons written to {public.relative_to(common.PROJECT_DIR)}")


def main() -> None:
    if not SOURCE.exists():
        common.fail(f"Source artwork not found: {SOURCE}")
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    python = common.ensure_backend_deps()  # pillow lives in the venv
    build_pngs()
    write_ico(python, ICONS_DIR / "anydeck.ico", ICO_SIZES)
    build_icns()
    build_frontend_assets(python)

    common.info(f"All icons written to {ICONS_DIR.relative_to(common.PROJECT_DIR)}")


if __name__ == "__main__":
    main()
