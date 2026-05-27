from datetime import timedelta
from decimal import Decimal
from django.utils import timezone

AUTOEXCLUSION_PERIODS = {
    '7d': timedelta(days=7),
    '30d': timedelta(days=30),
    '90d': timedelta(days=90),
    'indefinida': None,
}

COOLDOWN_HOURS = 24

MIN_LIMIT = Decimal('1.0000')


def validate_autoexclusion_period(periodo: str) -> str | None:
    if periodo not in AUTOEXCLUSION_PERIODS:
        return f'Periodo invalido. Opciones: {", ".join(AUTOEXCLUSION_PERIODS.keys())}'
    return None


def has_cooldown_expired(last_change) -> bool:
    if last_change is None:
        return True
    return (timezone.now() - last_change.created_at) > timedelta(hours=COOLDOWN_HOURS)


def is_limit_increase(valor_anterior: Decimal, valor_solicitado: Decimal) -> bool:
    if valor_anterior == Decimal('0'):
        return False
    return valor_solicitado > valor_anterior


def validate_limit_value(valor: Decimal) -> str | None:
    if valor < Decimal('0'):
        return 'El limite no puede ser negativo'
    return None
