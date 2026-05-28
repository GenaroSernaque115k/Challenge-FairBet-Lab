from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiTypes

from application.users import RegisterSerializer, UserSerializer, LoginSerializer, TokenResponseSerializer

User = get_user_model()

REGISTER_EXAMPLE = OpenApiExample(
    'Registro exitoso',
    value={
        'username': 'usuario123',
        'email': 'usuario@email.com',
        'password': 'password123',
        'dni': '12345678',
        'fecha_nacimiento': '1990-01-15',
    },
    request_only=True,
)

LOGIN_EXAMPLE = OpenApiExample(
    'Login exitoso',
    value={
        'username': 'demo1',
        'password': 'demo1234',
    },
    request_only=True,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth'

    @extend_schema(
        summary='Registrar nuevo usuario',
        description='Crea un usuario con validacion de DNI peruano y perfil',
        request=RegisterSerializer,
        responses={
            201: TokenResponseSerializer,
            400: OpenApiTypes.OBJECT,
        },
        examples=[REGISTER_EXAMPLE],
        auth=[],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth'

    @extend_schema(
        summary='Iniciar sesion',
        description='Autentica usuario y retorna tokens JWT. Usa el token "access" en Authorize (no el refresh).',
        request=LoginSerializer,
        responses={
            200: TokenResponseSerializer,
            401: OpenApiTypes.OBJECT,
        },
        examples=[LOGIN_EXAMPLE],
        auth=[],
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Credenciales invalidas'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Obtener perfil actual',
        description='Retorna informacion del usuario autenticado',
        responses={200: UserSerializer},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_object(self):
        return self.request.user
