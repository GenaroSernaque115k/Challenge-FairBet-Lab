from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(default=timezone.now)

    class Meta:
        app_label = 'users'
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    class AccountStatus(models.TextChoices):
        PENDIENTE = 'pendiente_verificacion', 'Pendiente Verificacion'
        VERIFICADO = 'verificado', 'Verificado'
        BLOQUEADO = 'bloqueado', 'Bloqueado'
        AUTOEXCLUIDO = 'autoexcluido', 'Autoexcluido'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    dni = models.CharField(max_length=8, unique=True)
    fecha_nacimiento = models.DateField()
    estado_cuenta = models.CharField(
        max_length=30,
        choices=AccountStatus.choices,
        default=AccountStatus.PENDIENTE,
    )
    fecha_registro = models.DateTimeField(default=timezone.now)

    class Meta:
        app_label = 'users'

    def __str__(self):
        return f'{self.user.username} - DNI: {self.dni}'


class IdempotencyKey(models.Model):
    key = models.CharField(max_length=128, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    response_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'users'
        indexes = [
            models.Index(fields=['key', 'user']),
        ]

    def __str__(self):
        return self.key
