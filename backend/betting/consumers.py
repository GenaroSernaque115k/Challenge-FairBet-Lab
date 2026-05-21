import json
from channels.generic.websocket import AsyncWebsocketConsumer
from infrastructure.events import Event, Market, Selection
from channels.db import database_sync_to_async


class EventOddsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope['url_route']['kwargs']['event_id']
        self.group_name = f'event_{self.event_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        odds_data = await self.get_odds_data()
        await self.send(text_data=json.dumps(odds_data))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def odds_update(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def recotizacion(self, event):
        await self.send(text_data=json.dumps({
            'type': 'recotizacion',
            'selection_id': event['selection_id'],
            'old_odds': str(event['old_odds']),
            'new_odds': str(event['new_odds']),
        }))

    @database_sync_to_async
    def get_odds_data(self):
        try:
            event = Event.objects.prefetch_related(
                'markets__selections'
            ).get(id=self.event_id)
        except Event.DoesNotExist:
            return {'error': 'Evento no encontrado'}

        markets = []
        for market in event.markets.all():
            selections = [
                {'id': s.id, 'name': s.name, 'odds': str(s.odds)}
                for s in market.selections.all()
            ]
            markets.append({
                'id': market.id,
                'type': market.type,
                'name': market.name,
                'selections': selections,
            })
        return {
            'type': 'odds_data',
            'event_id': event.id,
            'status': event.status,
            'markets': markets,
        }
