"""Every kind of detail an entry can carry.

Listed here so that one file answers "what can be recorded", and so that a new
context type is reachable everywhere by adding two lines rather than by hunting
down import sites.
"""

from utils.tracking.contexts.action import ActionContext
from utils.tracking.contexts.action_source import ActionSourceContext
from utils.tracking.contexts.api import ApiContext
from utils.tracking.contexts.base import Context
from utils.tracking.contexts.i18n import I18nContext
from utils.tracking.contexts.message import MessageContext
from utils.tracking.contexts.retry import RetryContext
from utils.tracking.contexts.step import StepContext
from utils.tracking.contexts.timing import TimingContext
from utils.tracking.contexts.value import ValueContext

__all__ = [
    "ActionContext",
    "ActionSourceContext",
    "ApiContext",
    "Context",
    "I18nContext",
    "MessageContext",
    "RetryContext",
    "StepContext",
    "TimingContext",
    "ValueContext",
]
