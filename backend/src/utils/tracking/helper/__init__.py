"""Parts of tracking that are not the timeline itself.

Building a failure entry, writing a timeline out, and keeping credentials out of
both. Separate from `tracking.py` because none of them needs to know how a
timeline is assembled - only what a finished one looks like.
"""

from utils.tracking.helper.failure import build_failure_tracker
from utils.tracking.helper.redact import omit_keys_deep, redact_secrets
from utils.tracking.helper.writer import write_tracking

__all__ = [
    "build_failure_tracker",
    "omit_keys_deep",
    "redact_secrets",
    "write_tracking",
]
