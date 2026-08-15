"""anydeck backend entry point.

Serves two things: the JSON API under /api, and the built frontend at
everything else. One origin for both, so the frontend needs no CORS handling
and the window has a single address to load.

The device listener and the tray icon are not started here yet - see the note
at the bottom for where they will hook in.
"""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from api import api_router
from utils.paths import frontend_dir

# The API must only be reachable from this machine - never bind to 0.0.0.0.
HOST = "127.0.0.1"
PORT = 8765

app = FastAPI(title="anydeck", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.include_router(api_router)


def _mount_frontend(application: FastAPI, directory: Path) -> None:
    """Serve the built frontend, with index.html as the fallback route.

    The UI is a single page: the browser handles its own routes, so a request
    for /settings has no file behind it and must still return index.html. The
    catch-all is registered after the API router, so /api never reaches it.
    """
    assets = directory / "assets"
    if assets.is_dir():
        application.mount("/assets", StaticFiles(directory=assets), name="assets")

    index = directory / "index.html"

    @application.get("/{path:path}", include_in_schema=False)
    def serve_frontend(path: str):
        candidate = directory / path
        # Only serve real files from inside the frontend directory; a path like
        # ../../etc/passwd must not resolve out of it.
        if path and candidate.is_file() and directory in candidate.resolve().parents:
            return FileResponse(candidate)
        return FileResponse(index)


_frontend = frontend_dir()
if _frontend is not None:
    _mount_frontend(app, _frontend)
else:

    @app.get("/", include_in_schema=False)
    def missing_frontend() -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={
                "detail": "The frontend is not built. Run scripts/dev.py, or "
                "build it with scripts/build.py."
            },
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)

# The background half of the program - the device listener, and the tray icon
# that opens the window - is deliberately not started here. This module is
# imported by uvicorn workers and by the packaged app alike, and a listener that
# starts on import would start once per import. It belongs in a `main.py` next
# to this file, which owns the process: start the listener thread, start the
# tray icon, run the server, and only then create a window when the user asks
# for one.
