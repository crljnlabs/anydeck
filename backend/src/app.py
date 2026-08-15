"""anydeck backend entry point.

Placeholder only. The application object is created here so the environment can
be started and verified; the actual logic (device listener, action mapping,
persistence, tray icon, application window) is not implemented yet.
"""

from fastapi import FastAPI

# The API must only be reachable from this machine - never bind to 0.0.0.0.
HOST = "127.0.0.1"
PORT = 8765

app = FastAPI(title="anydeck")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)
