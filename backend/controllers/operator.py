from django.http import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

from domain.operator import calcular_ggr, calcular_exposure, generar_reporte_csv
from application.operator import MetricsSerializer
from infrastructure.betting import Bet


class MetricsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = MetricsSerializer

    @extend_schema(
        summary='Metricas del operador',
        description='GGR, total apostado, total pagado, usuarios activos.',
    )
    def get(self, request):
        metrics = calcular_ggr()
        from django.db.models import Count
        from django.utils import timezone
        from datetime import timedelta

        semana = timezone.now() - timedelta(days=7)
        active_users = Bet.objects.filter(placed_at__gte=semana).values('user').distinct().count()
        active_bets = Bet.objects.filter(status='accepted').count()

        metrics['active_users'] = active_users
        metrics['active_bets'] = active_bets

        return Response(metrics)


class ExposureView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary='Exposure por evento',
        description='Cuanto pierde la casa si gana cada seleccion del evento.',
        parameters=[
            OpenApiParameter(name='event_id', type=int, location=OpenApiParameter.PATH),
        ],
    )
    def get(self, request, event_id: int):
        try:
            result = calcular_exposure(event_id)
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class ReporteView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        summary='Descargar reporte CSV',
        description='Reporte MINCETUR en formato CSV con filtro por mes y anio.',
        parameters=[
            OpenApiParameter(name='mes', type=int, location=OpenApiParameter.QUERY),
            OpenApiParameter(name='anio', type=int, location=OpenApiParameter.QUERY),
        ],
    )
    def get(self, request):
        from django.utils import timezone
        now = timezone.now()
        mes = int(request.GET.get('mes', now.month))
        anio = int(request.GET.get('anio', now.year))

        try:
            csv_content = generar_reporte_csv(mes, anio)
            response = HttpResponse(csv_content, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="reporte_{anio}_{mes:02d}.csv"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=400)
