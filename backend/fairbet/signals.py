import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from infrastructure.betting import Bet, BetSelection
from infrastructure.wallet import LedgerEntry
from infrastructure.events import Selection
from domain.audit import append_audit_log
from fairbet.middleware import get_current_ip

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Bet)
def audit_bet_changes(sender, instance, created, **kwargs):
    action = 'BET_CREATED' if created else 'BET_UPDATED'
    data = {
        'id': instance.id,
        'user_id': instance.user_id,
        'stake': str(instance.stake),
        'total_odds': str(instance.total_odds),
        'status': instance.status,
        'ip': get_current_ip() or '',
    }
    append_audit_log(instance.user, action, 'Bet', instance.id, data)


@receiver(post_save, sender=LedgerEntry)
def audit_ledger_changes(sender, instance, created, **kwargs):
    if not created:
        return
    action = 'LEDGER_CREATED'
    data = {
        'id': instance.id,
        'account_id': instance.account_id,
        'amount': str(instance.amount),
        'direction': instance.direction,
        'transaction_id': str(instance.transaction_id),
    }
    append_audit_log(None, action, 'LedgerEntry', instance.id, data)


@receiver(post_save, sender=Selection)
def audit_selection_changes(sender, instance, created, **kwargs):
    action = 'SELECTION_CREATED' if created else 'SELECTION_UPDATED'
    data = {
        'id': instance.id,
        'market_id': instance.market_id,
        'name': instance.name,
        'odds': str(instance.odds),
        'is_winner': instance.is_winner,
    }
    append_audit_log(None, action, 'Selection', instance.id, data)
