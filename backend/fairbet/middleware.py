import logging
import threading

logger = logging.getLogger(__name__)

_local = threading.local()


def get_current_ip():
    return getattr(_local, 'ip', None)


class AuditIPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = self._get_client_ip(request)
        request.mt_ip = ip
        request.mt_user_agent = request.META.get('HTTP_USER_AGENT', '')
        _local.ip = ip
        response = self.get_response(request)
        _local.ip = None
        return response

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip
