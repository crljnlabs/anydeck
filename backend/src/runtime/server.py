"""The HTTP server, on its own thread.

Its own thread so that a slow request cannot freeze the window, and so that the
main thread stays free for the tray and the GUI - which on macOS is not a
preference but a requirement.
"""

from __future__ import annotations

import socket
import threading
import time

from app import HOST, PORT, app
from utils import AnydeckError, Tracking

_server = None
_thread: threading.Thread | None = None


def is_running(host: str = HOST, port: int = PORT, timeout: float = 0.25) -> bool:
    """Whether something is already listening - i.e. another instance of us.

    A plain TCP connect rather than an HTTP request: it answers the only
    question being asked, and it cannot be confused by a slow first response.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(timeout)
        return probe.connect_ex((host, port)) == 0


def start(tracking: Tracking) -> threading.Thread:
    """Start serving, and return once the port actually answers.

    Waiting matters: the window loads its page from this server, and a window
    opened a few milliseconds too early shows a connection error instead of the
    interface.
    """
    global _server, _thread

    import uvicorn

    _server = uvicorn.Server(
        uvicorn.Config(app, host=HOST, port=PORT, log_level="warning")
    )
    _thread = threading.Thread(target=_server.run, name="server", daemon=True)
    _thread.start()

    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        if is_running():
            tracking.note("server listening", values={"host": HOST, "port": PORT})
            return _thread
        time.sleep(0.05)

    raise AnydeckError(
        tracking,
        f"the server did not come up on {HOST}:{PORT} within 10 seconds",
        user_message="Anydeck could not start its local server.",
    )


def stop() -> None:
    """Ask uvicorn to shut down and give it a moment to release the port.

    Without this the port stays bound until the process dies, and a restart
    straight after a quit would think another instance is still running.
    """
    if _server is not None:
        _server.should_exit = True
    if _thread is not None:
        _thread.join(timeout=5)
