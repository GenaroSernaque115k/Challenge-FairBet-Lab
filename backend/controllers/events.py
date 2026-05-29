from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiTypes

from infrastructure.events import Event, Market, Sport
from application.events import (
    SportSerializer, EventListSerializer, EventDetailSerializer,
    MarketSerializer,
)


class EventListView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        qs = Event.objects.select_related('sport').all()
        sport = self.request.query_params.get('sport')
        status_param = self.request.query_params.get('status')
        if sport:
            qs = qs.filter(sport__slug=sport)
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    @extend_schema(
        summary='Listar eventos',
        description='Eventos con filtro por deporte y estado',
        parameters=[
            {'name': 'sport', 'in_': 'query', 'schema': {'type': 'string'}, 'description': 'Slug del deporte'},
            {'name': 'status', 'in_': 'query', 'schema': {'type': 'string'}, 'description': 'programado/en_vivo/finalizado'},
        ],
        responses={200: EventListSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventDetailSerializer
    permission_classes = [AllowAny]
    queryset = Event.objects.select_related('sport').prefetch_related(
        'markets__selections'
    ).all()

    @extend_schema(
        summary='Detalle de evento',
        description='Evento con sus mercados y selecciones (odds)',
        responses={200: EventDetailSerializer},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class LiveEventListView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Event.objects.filter(status='en_vivo').select_related('sport')

    @extend_schema(
        summary='Eventos en vivo',
        description='Lista de eventos con estado en_vivo',
        responses={200: EventListSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MarketDetailView(generics.RetrieveAPIView):
    serializer_class = MarketSerializer
    permission_classes = [AllowAny]
    queryset = Market.objects.prefetch_related('selections').all()

    @extend_schema(
        summary='Detalle de mercado',
        description='Mercado con sus selecciones y odds',
        responses={200: MarketSerializer},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class SportListView(generics.ListAPIView):
    serializer_class = SportSerializer
    permission_classes = [AllowAny]
    queryset = Sport.objects.all()

    @extend_schema(
        summary='Listar deportes',
        responses={200: SportSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ChangeEventStatusView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    @extend_schema(
        summary='Cambiar estado de evento (admin)',
        description='Permite al administrador cambiar el estado de un evento: programado, en_vivo, finalizado, suspendido, anulado.',
        request=OpenApiTypes.OBJECT,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample('Suspender evento', value={'status': 'suspendido'}),
            OpenApiExample('Anular evento', value={'status': 'anulado'}),
        ],
    )
    def post(self, request, event_id):
        try:
            event = Event.objects.select_related('sport').get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Evento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = [s[0] for s in Event.Status.choices]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Estado invalido. Opciones: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_status = event.status
        event.status = new_status
        event.save()

        return Response({
            'event_id': event.id,
            'event_name': str(event),
            'old_status': old_status,
            'new_status': event.status,
        })


class SetSelectionWinnerView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    @extend_schema(
        summary='Marcar seleccion como ganadora (admin)',
        description='Define si una seleccion es ganadora (is_winner=True/False). '
                    'Usado para liquidar apuestas automaticamente.',
        request=OpenApiTypes.OBJECT,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample('Marcar ganadora', value={'is_winner': True}),
            OpenApiExample('Marcar perdedora', value={'is_winner': False}),
        ],
    )
    def post(self, request, selection_id):
        from infrastructure.events import Selection
        try:
            sel = Selection.objects.select_related('market__event').get(id=selection_id)
        except Selection.DoesNotExist:
            return Response({'error': 'Seleccion no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        is_winner = request.data.get('is_winner')
        if not isinstance(is_winner, bool):
            return Response(
                {'error': 'El campo is_winner debe ser true o false'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sel.is_winner = is_winner
        sel.save()

        return Response({
            'selection_id': sel.id,
            'selection_name': sel.name,
            'market': sel.market.name,
            'event': str(sel.market.event),
            'is_winner': sel.is_winner,
        })
