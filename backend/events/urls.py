from django.urls import path
from controllers.events import (
    EventListView, EventDetailView, LiveEventListView,
    MarketDetailView, SportListView, ChangeEventStatusView,
    SetSelectionWinnerView,
)

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('live/', LiveEventListView.as_view(), name='event-live'),
    path('sports/', SportListView.as_view(), name='sport-list'),
    path('<int:event_id>/status/', ChangeEventStatusView.as_view(), name='event-status-change'),
    path('selections/<int:selection_id>/winner/', SetSelectionWinnerView.as_view(), name='selection-winner'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('markets/<int:pk>/', MarketDetailView.as_view(), name='market-detail'),
]
