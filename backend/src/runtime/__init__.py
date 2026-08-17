"""Process and user interface: the parts that make anydeck a program.

Deliberately separate from `service`, which is application logic. Nothing in
here knows about devices, mappings or actions; it knows about threads, windows
and the menu bar.

Exported as modules rather than as loose functions, because they all answer the
same few verbs: `listener.start` and `server.start` start very different things,
and a bare `start` would say which one only by luck.
"""

from runtime import listener, server, tray, window

__all__ = [
    "listener",
    "server",
    "tray",
    "window",
]
