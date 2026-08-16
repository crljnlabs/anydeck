"""Where anydeck writes down what happened.

A tray application launched from the Finder has no terminal: standard output and
standard error go nowhere. Without a log file a crash is completely silent - the
icon simply disappears - and there is nothing to look at afterwards. So every
run writes to a file next to the database, and uncaught exceptions land there
too rather than in the void.
"""

from __future__ import annotations

import logging
import sys
import threading
from logging.handlers import RotatingFileHandler

from utils.paths import data_dir

LOG_FILE = "anydeck.log"


def log_path():
    return data_dir() / LOG_FILE


def setup(role: str) -> None:
    """Start logging for this process.

    `role` distinguishes the background process from a window process, since
    both write to the same file.
    """
    handler = RotatingFileHandler(
        log_path(), maxBytes=512_000, backupCount=2, encoding="utf-8"
    )
    handler.setFormatter(
        logging.Formatter(f"%(asctime)s %(levelname)-7s [{role}] %(name)s: %(message)s")
    )

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.addHandler(handler)

    # A terminal is worth using when there is one; when there is not, this is
    # harmless.
    if sys.stderr is not None:
        root.addHandler(logging.StreamHandler(sys.stderr))

    _capture_uncaught()
    logging.getLogger("anydeck").info("started: %s", " ".join(sys.argv))


def _capture_uncaught() -> None:
    """Route crashes into the log instead of into a closed stderr."""

    def on_exception(kind, value, traceback):
        if issubclass(kind, KeyboardInterrupt):
            sys.__excepthook__(kind, value, traceback)
            return
        logging.getLogger("anydeck").critical(
            "uncaught exception", exc_info=(kind, value, traceback)
        )

    sys.excepthook = on_exception

    # Threads have their own hook; without this a listener or server thread
    # could die unnoticed.
    def on_thread_exception(args):
        logging.getLogger("anydeck").critical(
            "uncaught exception in thread %s",
            args.thread.name if args.thread else "?",
            exc_info=(args.exc_type, args.exc_value, args.exc_traceback),
        )

    threading.excepthook = on_thread_exception
