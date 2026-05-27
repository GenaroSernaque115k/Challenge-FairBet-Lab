from django.urls import path
from controllers.responsible_gaming import LimitsView, AutoExclusionView

urlpatterns = [
    path('limits/', LimitsView.as_view(), name='rg-limits'),
    path('auto-exclude/', AutoExclusionView.as_view(), name='rg-auto-exclude'),
]
