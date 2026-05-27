import logging
from infrastructure.audit import AuditLog

logger = logging.getLogger(__name__)


def append_audit_log(user, action: str, entity_type: str, entity_id: int, data: dict) -> AuditLog:
    last_log = AuditLog.objects.order_by('-timestamp').first()
    hash_prev = last_log.hash_current if last_log else ''
    from django.utils import timezone
    now = timezone.now()
    hash_current = AuditLog.compute_hash(data, hash_prev, now.isoformat())
    log = AuditLog.objects.create(
        user=user,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        data=data,
        hash_prev=hash_prev,
        hash_current=hash_current,
        timestamp=now,
    )
    return log
