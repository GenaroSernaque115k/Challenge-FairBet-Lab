import logging
import random
from decimal import Decimal

from celery import shared_task
from django.utils import timezone

from infrastructure.events import Event, Market, Selection
from betting.consumers import enviar_actualizacion_odds

logger = logging.getLogger(__name__)

MAX_ODDS_CHANGE_PCT = Decimal('0.05')  # max 5% change per tick
RECOTIZACION_THRESHOLD = Decimal('0.10')  # 10% change triggers recotizacion


@shared_task
def update_live_odds():
    live_events = Event.objects.filter(status='en_vivo')
    count = live_events.count()
    if count == 0:
        return 0

    updated = 0
    for event in live_events[:max(1, count // 3)]:
        selections = Selection.objects.filter(market__event=event).order_by('?')[:3]
        for sel in selections:
            old_odds = sel.odds
            change_pct = Decimal(str(random.uniform(0.02, float(MAX_ODDS_CHANGE_PCT))))
            direction = random.choice([1, -1])
            new_odds = (old_odds * (Decimal('1') + change_pct * direction)).quantize(Decimal('0.0001'))

            change = abs(new_odds - old_odds) / old_odds
            if change >= RECOTIZACION_THRESHOLD:
                from asgiref.sync import async_to_sync
                from channels.layers import get_channel_layer
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'event_{event.id}',
                    {
                        'type': 'recotizacion',
                        'selection_id': sel.id,
                        'old_odds': old_odds,
                        'new_odds': new_odds,
                    },
                )

            sel.odds = new_odds
            sel.save(update_fields=['odds'])
            enviar_actualizacion_odds(event.id, sel.id, old_odds, new_odds)
            updated += 1

    logger.info(f'Live odds updated: {updated} selections across events')
    return updated
