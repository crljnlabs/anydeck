#!/usr/bin/env python3
import argparse
import subprocess
import os
import sys
import venv

BACKEND_DIR = "../backend"
VENV_DIR = f"{BACKEND_DIR}/.venv"
FRONTEND_DIR = "../frontend"

def venv_python():
    if os.name == "nt":
        return os.path.join(VENV_DIR, "Scripts", "python.exe")
    return os.path.join(VENV_DIR, "bin", "python")

def create_venv():
    venv.create(VENV_DIR, with_pip=True)

def install_requirements():
    subprocess.run(
        [venv_python(), "-m", "pip", "install", "-r", f"{BACKEND_DIR}//requirements.txt"],
        check=True,
    )

def init_frontend():
    subprocess.run(["pnpm", "i"], cwd=FRONTEND_DIR, check=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Set up the anydeck dev environment.")
    parser.add_argument(
        "-u", "--update", action="store_true",
        help="only update dependencies: skip creating the virtual environment",
    )
    args = parser.parse_args()

    if args.update:
        if not os.path.exists(venv_python()):
            sys.exit(f"No virtual environment at {VENV_DIR} - run without --update first")
    else:
        create_venv()

    install_requirements()
    init_frontend()
