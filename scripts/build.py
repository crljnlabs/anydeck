#!/usr/bin/env python3
"""Build anydeck into an installable artifact.

Steps:
  1. bring backend and frontend dependencies up to date
  2. build the frontend (vite -> frontend/dist)
  3. bundle backend + frontend with PyInstaller (packaging/anydeck.spec)
  4. wrap the bundle in a platform specific installer
  5. collect everything in release/<version>/ together with SHA256 checksums

Cross compiling is not possible - the artifact is always built for the system
this script runs on. The other platforms are covered by the matrix in
.github/workflows/release.yml, which runs this same script.

  macOS    anydeck.app -> .dmg           (hdiutil, ships with macOS)
  Windows  anydeck\\    -> .zip + .exe    (.exe needs Inno Setup / iscc)
  Linux    anydeck/    -> .tar.gz + .deb (.deb needs dpkg-deb)

Missing installer tooling is not an error: the portable archive is always
produced and the missing installer is reported.

Usage:
    python3 scripts/build.py                      # interactive
    python3 scripts/build.py --version v1.0.0
    python3 scripts/build.py --version v1.0.0 --ci
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

import _common as common

DEB_ARCHITECTURES = {"x86_64": "amd64", "arm64": "arm64"}
# Icon sizes installed into /usr/share/icons/hicolor for the .desktop entry.
HICOLOR_SIZES = (16, 24, 32, 48, 64, 128, 256, 512)
# Filled in before the first real release - dpkg requires a maintainer field.
DEB_MAINTAINER = "crljnlabs <maintainer@example.com>"
DEB_DESCRIPTION = "Map signals from custom input devices to actions on your PC"
# The bundled app ships its own Python, but pywebview still needs the system
# WebKitGTK stack at runtime.
DEB_DEPENDS = "libwebkit2gtk-4.1-0, gir1.2-webkit2-4.1, python3-gi"


def build_frontend() -> None:
    common.info("Building the frontend")
    common.run([common.npm_executable(), "run", "build"], cwd=common.FRONTEND_DIR)


def run_pyinstaller(python: Path) -> Path:
    common.info("Bundling with PyInstaller")
    common.clean_directory(common.DIST_DIR)
    common.run([
        str(python), "-m", "PyInstaller",
        "--noconfirm", "--clean",
        "--distpath", str(common.DIST_DIR),
        "--workpath", str(common.WORK_DIR / "pyinstaller"),
        str(common.PACKAGING_DIR / "anydeck.spec"),
    ])
    bundle = common.DIST_DIR / ("anydeck.app" if common.platform_key() == "macos" else "anydeck")
    if not bundle.exists():
        common.fail(f"PyInstaller produced no bundle at {bundle}")
    return bundle


def package_macos(bundle: Path, version: str, target: Path) -> list[Path]:
    dmg = target / f"anydeck-{version}-macos-{common.arch_key()}.dmg"
    common.info(f"Creating {dmg.name}")

    # The image gets the app AND a link to /Applications, because that link is
    # the entire install instruction on macOS: open, drag across, done. Without
    # it there is no way to install at all - the app can only be run from the
    # mounted image, read-only, and every double-click on the .dmg mounts
    # another copy of it.
    staging = target / f"{dmg.stem}-contents"
    common.clean_directory(staging)
    shutil.copytree(bundle, staging / bundle.name, symlinks=True)
    (staging / "Applications").symlink_to("/Applications")

    common.run([
        "hdiutil", "create",
        "-volname", common.APP_NAME,
        "-srcfolder", str(staging),
        "-ov", "-format", "UDZO",
        str(dmg),
    ])

    shutil.rmtree(staging, ignore_errors=True)
    return [dmg]


def package_windows(bundle: Path, version: str, target: Path) -> list[Path]:
    artifacts = [_make_archive(bundle, target / f"anydeck-{version}-windows-{common.arch_key()}", "zip")]

    script = common.PACKAGING_DIR / "windows-installer.iss"
    if not common.tool_available("iscc"):
        common.warn("Inno Setup (iscc) not found - only the portable .zip was created")
        return artifacts

    common.info("Creating the Windows installer")
    common.run([
        "iscc",
        f"/DAppVersion={version.lstrip('v')}",
        f"/DSourceDir={bundle}",
        f"/DOutputDir={target}",
        f"/DOutputName=anydeck-{version}-windows-{common.arch_key()}-setup",
        str(script),
    ])
    artifacts.append(target / f"anydeck-{version}-windows-{common.arch_key()}-setup.exe")
    return artifacts


def package_linux(bundle: Path, version: str, target: Path) -> list[Path]:
    artifacts = [_make_archive(bundle, target / f"anydeck-{version}-linux-{common.arch_key()}", "gztar")]

    if not common.tool_available("dpkg-deb"):
        common.warn("dpkg-deb not found - only the portable .tar.gz was created")
        return artifacts

    architecture = DEB_ARCHITECTURES.get(common.arch_key())
    if architecture is None:
        common.warn(f"No Debian architecture mapping for {common.arch_key()} - skipping the .deb")
        return artifacts

    common.info("Creating the Debian package")
    stage = common.clean_directory(common.WORK_DIR / "deb")
    install_dir = stage / "usr" / "lib" / "anydeck"
    install_dir.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(bundle, install_dir)

    binaries = stage / "usr" / "bin"
    binaries.mkdir(parents=True, exist_ok=True)
    os.symlink("../lib/anydeck/anydeck", binaries / "anydeck")

    applications = stage / "usr" / "share" / "applications"
    applications.mkdir(parents=True, exist_ok=True)
    shutil.copy2(common.PACKAGING_DIR / "anydeck.desktop", applications / "anydeck.desktop")

    install_hicolor_icons(stage / "usr" / "share" / "icons" / "hicolor")

    control_dir = stage / "DEBIAN"
    control_dir.mkdir(parents=True, exist_ok=True)
    (control_dir / "control").write_text(
        f"Package: anydeck\n"
        f"Version: {version.lstrip('v')}\n"
        f"Section: utils\n"
        f"Priority: optional\n"
        f"Architecture: {architecture}\n"
        f"Depends: {DEB_DEPENDS}\n"
        f"Maintainer: {DEB_MAINTAINER}\n"
        f"Description: {DEB_DESCRIPTION}\n"
    )

    deb = target / f"anydeck-{version}-linux-{common.arch_key()}.deb"
    common.run(["dpkg-deb", "--build", "--root-owner-group", str(stage), str(deb)])
    artifacts.append(deb)
    return artifacts


def install_hicolor_icons(hicolor: Path) -> None:
    """Lay out the icons the way the .desktop entry (Icon=anydeck) expects."""
    for size in HICOLOR_SIZES:
        source = common.ICONS_DIR / f"anydeck-{size}.png"
        if not source.exists():
            common.warn(f"Icon {source.name} is missing - run scripts/icons.py")
            continue
        target = hicolor / f"{size}x{size}" / "apps"
        target.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target / "anydeck.png")

    scalable = hicolor / "scalable" / "apps"
    scalable.mkdir(parents=True, exist_ok=True)
    shutil.copy2(common.ASSETS_DIR / "icon.svg", scalable / "anydeck.svg")


def _make_archive(bundle: Path, base_name: Path, archive_format: str) -> Path:
    common.info(f"Creating the portable archive {base_name.name}")
    archive = shutil.make_archive(
        base_name=str(base_name),
        format=archive_format,
        root_dir=str(bundle.parent),
        base_dir=bundle.name,
    )
    return Path(archive)


def write_checksums(target: Path, artifacts: list[Path]) -> Path:
    lines = [f"{common.sha256(artifact)}  {artifact.name}" for artifact in artifacts]
    checksums = target / "SHA256SUMS.txt"
    checksums.write_text("\n".join(lines) + "\n")
    return checksums


def write_manifest(target: Path, version: str, artifacts: list[Path]) -> Path:
    manifest = {
        "version": version,
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "platform": common.platform_key(),
        "architecture": common.arch_key(),
        "artifacts": [
            {
                "file": artifact.name,
                "size": artifact.stat().st_size,
                "sha256": common.sha256(artifact),
            }
            for artifact in artifacts
        ],
    }
    path = target / "manifest.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Build an installable anydeck artifact.")
    parser.add_argument("-v", "--version", help="version to build, e.g. v1.0.0")
    parser.add_argument("--ci", action="store_true",
                        help="non-interactive mode for CI (requires --version)")
    parser.add_argument("--skip-frontend", action="store_true",
                        help="reuse the existing frontend/dist instead of rebuilding it")
    args = parser.parse_args()

    version = args.version
    if not version:
        if args.ci:
            common.fail("--ci requires --version")
        version = common.prompt_version()
    if not common.is_valid_version(version):
        common.fail(f"Invalid version: {version}")

    python = common.ensure_backend_deps(include_dev=True)
    common.ensure_frontend_deps(ci=args.ci)

    if not args.skip_frontend:
        build_frontend()
    bundle = run_pyinstaller(python)

    target = common.clean_directory(common.RELEASE_DIR / version)
    packagers = {
        "macos": package_macos,
        "windows": package_windows,
        "linux": package_linux,
    }
    artifacts = packagers[common.platform_key()](bundle, version, target)
    artifacts = [artifact for artifact in artifacts if artifact.exists()]

    write_checksums(target, artifacts)
    write_manifest(target, version, artifacts)

    print()
    common.info(f"Release {version} in {target.relative_to(common.PROJECT_DIR)}")
    for artifact in artifacts:
        print(f"    {artifact.name}  ({common.human_size(artifact)})")


if __name__ == "__main__":
    main()
