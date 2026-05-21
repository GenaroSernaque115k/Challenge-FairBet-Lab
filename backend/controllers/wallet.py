from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiTypes

from application.wallet import RecargarSerializer, RetirarSerializer, recargar, retirar, get_balance
from infrastructure.users import IdempotencyKey

RECARGAR_EXAMPLE = OpenApiExample(
    'Recarga de 100 BP',
    value={'amount': '100.0000', 'reference': 'Pago con tarjeta'},
    request_only=True,
)

RETIRAR_EXAMPLE = OpenApiExample(
    'Retiro de 50 BP',
    value={'amount': '50.0000'},
    request_only=True,
)

SALDO_RESPONSE = OpenApiExample(
    'Saldo actual',
    value={'balance': '1000.0000'},
    response_only=True,
)


class RecargarView(generics.GenericAPIView):
    serializer_class = RecargarSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Recargar cuenta',
        description='Agrega saldo a la cuenta principal del usuario via partida doble (casa → usuario)',
        request=RecargarSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
        },
        examples=[RECARGAR_EXAMPLE],
        parameters=[{
            'name': 'X-Idempotency-Key',
            'in_': 'header',
            'schema': {'type': 'string'},
            'description': 'Clave de idempotencia',
        }],
    )
    def post(self, request):
        key = request.headers.get('X-Idempotency-Key') or request.data.get('idempotency_key')
        if key:
            cached = IdempotencyKey.objects.filter(key=key, user=request.user).first()
            if cached and cached.response_data:
                return Response(cached.response_data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            new_balance = recargar(
                request.user,
                serializer.validated_data['amount'],
                reference=serializer.validated_data.get('reference', ''),
            )
            response_data = {'balance': str(new_balance)}
            if key:
                IdempotencyKey.objects.get_or_create(
                    key=key, user=request.user,
                    defaults={'response_data': response_data},
                )
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RetirarView(generics.GenericAPIView):
    serializer_class = RetirarSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Retirar fondos',
        description='Retira saldo de la cuenta principal del usuario via partida doble (usuario → casa)',
        request=RetirarSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
        },
        examples=[RETIRAR_EXAMPLE],
        parameters=[{
            'name': 'X-Idempotency-Key',
            'in_': 'header',
            'schema': {'type': 'string'},
            'description': 'Clave de idempotencia',
        }],
    )
    def post(self, request):
        key = request.headers.get('X-Idempotency-Key') or request.data.get('idempotency_key')
        if key:
            cached = IdempotencyKey.objects.filter(key=key, user=request.user).first()
            if cached and cached.response_data:
                return Response(cached.response_data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            new_balance = retirar(
                request.user,
                serializer.validated_data['amount'],
                reference=serializer.validated_data.get('reference', ''),
            )
            response_data = {'balance': str(new_balance)}
            if key:
                IdempotencyKey.objects.get_or_create(
                    key=key, user=request.user,
                    defaults={'response_data': response_data},
                )
            return Response(response_data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SaldoView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Consultar saldo',
        description='Retorna el saldo actual de la cuenta principal calculado como SUM(CREDIT) - SUM(DEBIT)',
        responses={200: OpenApiTypes.OBJECT},
        examples=[SALDO_RESPONSE],
    )
    def get(self, request):
        balance = get_balance(request.user)
        return Response({'balance': str(balance)})
