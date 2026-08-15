#!/usr/bin/env python3
"""Copy the exported element models into the frontend.

The Blender sources and their glTF exports live in assets/3d-files/, outside
the frontend, because they are editable artwork rather than web assets. Vite
only serves frontend/public, so the exports have to be copied there before the
frontend can load them.

The copies are committed, exactly like the generated icons, so neither a build
nor a CI runner needs Blender. Run this script again whenever an element has
been re-exported.

    assets/3d-files/glb/<element>.glb  ->  frontend/public/models/<element>.glb

Usage:
    python3 scripts/models.py
"""

from __future__ import annotations

import shutil

import _common as common

SOURCE_DIR = common.ASSETS_DIR / "3d-files" / "glb"
TARGET_DIR = common.FRONTEND_DIR / "public" / "models"


def main() -> None:
    if not SOURCE_DIR.is_dir():
        common.fail(f"No exported models found: {SOURCE_DIR}")

    models = sorted(SOURCE_DIR.glob("*.glb"))
    if not models:
        common.fail(f"No .glb files in {SOURCE_DIR}")

    TARGET_DIR.mkdir(parents=True, exist_ok=True)

    # Drop exports that no longer exist upstream, otherwise a renamed element
    # would leave its old file behind and the frontend would keep resolving it.
    names = {model.name for model in models}
    for stale in TARGET_DIR.glob("*.glb"):
        if stale.name not in names:
            stale.unlink()
            common.warn(f"removed stale model {stale.name}")

    for model in models:
        shutil.copy2(model, TARGET_DIR / model.name)

    common.info(
        f"{len(models)} models copied to "
        f"{TARGET_DIR.relative_to(common.PROJECT_DIR)}"
    )


if __name__ == "__main__":
    main()
