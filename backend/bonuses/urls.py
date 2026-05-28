from django.urls import path
from controllers.bonuses import BonusAvailableView, ApplyBonusView, MyBonusesView

urlpatterns = [
    path('available/', BonusAvailableView.as_view(), name='bonus-available'),
    path('apply/', ApplyBonusView.as_view(), name='bonus-apply'),
    path('my-bonus/', MyBonusesView.as_view(), name='my-bonus'),
]
