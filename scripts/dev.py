#!/usr/bin/env python3
"""Start backend and frontend for development.

Makes sure the virtual environment and the node modules are up to date, then
runs both dev servers side by side with prefixed output:

    backend   uvicorn with --reload on 127.0.0.1:8765
    frontend  vite dev server with HMR on http://localhost:5173

The vite dev server proxies /api to the backend (see frontend/vite.config.js),
so both sides talk to each other without CORS handling.

Ctrl+C stops both.

Usage:
    python3 scripts/dev.py
    python3 scripts/dev.py --backend-only
"""

from __future__ import annotations

import argparse
import os
import signal
import subprocess
import sys
import threading
import time

import _common as common

PREFIX_WIDTH = 8


def stream_output(name: str, process: subprocess.Popen) -> threading.Thread:
    def pump() -> None:
        assert process.stdout is not None
        for line in process.stdout:
            print(f"[{name:<{PREFIX_WIDTH}}] {line.rstrip()}", flush=True)

    thread = threading.Thread(target=pump, daemon=True)
    thread.start()
    return thread


POSIX = os.name == "posix"


def spawn(name: str, command: list, cwd) -> subprocess.Popen:
    common.info(f"Starting {name}: {' '.join(str(part) for part in command)}")
    process = subprocess.Popen(
        command,
        cwd=str(cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        env=common.env_without_venv(),
        # Own process group: "npm run dev" does not forward signals to vite, so
        # the whole group has to be signalled instead of just the direct child.
        start_new_session=POSIX,
    )
    stream_output(name, process)
    return process


def signal_process(process: subprocess.Popen, sig) -> None:
    if process.poll() is not None:
        return
    if POSIX:
        try:
            os.killpg(os.getpgid(process.pid), sig)
            return
        except (ProcessLookupError, PermissionError):
            return
    process.terminate() if sig != signal.SIGKILL else process.kill()


def shutdown(processes: list) -> None:
    for process in processes:
        signal_process(process, signal.SIGTERM)
    for process in processes:
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            signal_process(process, signal.SIGKILL)


def install_signal_handlers() -> None:
    """Make Ctrl+C and SIGTERM end up in the same shutdown path.

    Explicitly restoring the SIGINT handler matters: a process started as a
    background job inherits SIGINT as "ignore", which would swallow Ctrl+C.
    """
    signal.signal(signal.SIGINT, signal.default_int_handler)

    def on_terminate(_signum, _frame):
        raise KeyboardInterrupt

    signal.signal(signal.SIGTERM, on_terminate)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the anydeck dev servers.")
    parser.add_argument("--backend-only", action="store_true", help="do not start the vite dev server")
    parser.add_argument("--frontend-only", action="store_true", help="do not start the backend")
    parser.add_argument("--port", type=int, default=common.BACKEND_PORT, help="backend port")
    args = parser.parse_args()

    install_signal_handlers()
    processes: list = []

    if not args.frontend_only:
        common.ensure_backend_deps()
        common.check_linux_gui_backend()
        processes.append(spawn(
            "backend",
            [
                str(common.venv_python()), "-m", "uvicorn", "app:app",
                "--reload",
                # Never bind to 0.0.0.0 - the API must stay local (requirements.md).
                "--host", common.BACKEND_HOST,
                "--port", str(args.port),
            ],
            common.BACKEND_SRC,
        ))

    if not args.backend_only:
        common.ensure_frontend_deps()
        processes.append(spawn(
            "frontend",
            [common.npm_executable(), "run", "dev"],
            common.FRONTEND_DIR,
        ))

    if not processes:
        common.fail("Nothing to start: --backend-only and --frontend-only cancel each other out")

    print()
    if not args.frontend_only:
        common.info(f"Backend:  http://{common.BACKEND_HOST}:{args.port}")
    if not args.backend_only:
        common.info(f"Frontend: http://localhost:{common.FRONTEND_PORT}")
    common.info("Press Ctrl+C to stop")
    print()

    try:
        while True:
            for process in processes:
                code = process.poll()
                if code is not None:
                    common.warn(f"A dev server exited with code {code}, shutting down the rest")
                    shutdown(processes)
                    sys.exit(code)
            time.sleep(0.5)
    except KeyboardInterrupt:
        print()
        common.info("Stopping")
        shutdown(processes)


if __name__ == "__main__":
    main()
