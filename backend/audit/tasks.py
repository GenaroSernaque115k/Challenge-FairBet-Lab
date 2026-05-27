import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from infrastructure.betting import Bet
from infrastructure.audit import SuspiciousActivity
from application.responsible_gaming import check_and_reactivate_autoexclusion

logger = logging.getLogger(__name__)


@shared_task
def check_fraud_patterns():
    now = timezone.now()
    recent = now - timedelta(hours=1)
    created = 0

    recent_bets = Bet.objects.filter(placed_at__gte=recent).select_related('user')
    bets_by_user: dict = {}
    for bet in recent_bets:
        bets_by_user.setdefault(bet.user_id, []).append(bet)

    for user_id, bets in bets_by_user.items():
        if len(bets) >= 10:
            total_staked = sum((b.stake for b in bets), Decimal('0'))
            if total_staked > Decimal('5000'):
                SuspiciousActivity.objects.get_or_create(
                    user_id=user_id,
                    tipo='stake_anomaly',
                    defaults={
                        'descripcion': f'{len(bets)} apuestas en 1h por {total_staked} BP',
                        'severidad': 'medium',
                    },
                )
                created += 1

    logger.info(f'Fraud check completed. Alerts created: {created}')
    return created


@shared_task
def reactivate_autoexcluded_users():
    count = check_and_reactivate_autoexclusion()
    logger.info(f'Autoexclusion reactivation check. Reactivated: {count}')
    return count
