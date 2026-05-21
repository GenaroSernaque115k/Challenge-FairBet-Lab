from django.urls import path

from wallet.views import RecargarView, RetirarView, SaldoView

urlpatterns = [
    path('recargar/', RecargarView.as_view(), name='recargar'),
    path('retirar/', RetirarView.as_view(), name='retirar'),
    path('saldo/', SaldoView.as_view(), name='saldo'),
]
