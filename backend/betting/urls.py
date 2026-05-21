from django.urls import path
from controllers.betting import (
    ApostarView, CashOutView, MisApuestasView, LiquidarApuestaView,
)

urlpatterns = [
    path('apuesta/', ApostarView.as_view(), name='apostar'),
    path('cash-out/<int:bet_id>/', CashOutView.as_view(), name='cash-out'),
    path('mis-apuestas/', MisApuestasView.as_view(), name='mis-apuestas'),
    path('liquidar/<int:bet_id>/', LiquidarApuestaView.as_view(), name='liquidar'),
]
