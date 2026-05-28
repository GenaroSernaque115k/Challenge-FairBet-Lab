from django.urls import path
from controllers.operator import MetricsView, ExposureView, ReporteView

urlpatterns = [
    path('metrics/', MetricsView.as_view(), name='operator-metrics'),
    path('exposure/<int:event_id>/', ExposureView.as_view(), name='operator-exposure'),
    path('reporte/', ReporteView.as_view(), name='operator-reporte'),
]
