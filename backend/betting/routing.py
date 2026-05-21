from django.urls import re_path
from betting.consumers import EventOddsConsumer

websocket_urlpatterns = [
    re_path(r'ws/events/(?P<event_id>\d+)/$', EventOddsConsumer.as_asgi()),
]
