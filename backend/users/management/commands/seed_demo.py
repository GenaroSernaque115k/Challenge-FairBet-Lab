from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import UserProfile
from wallet.models import Account
from application.wallet import recargar
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed usuarios demo, cuenta casa y wallets inicializadas'

    def handle(self, *args, **kwargs):
        casa_user, _ = User.objects.get_or_create(
            username='sistema_casa',
            defaults={'email': 'casa@fairbet.internal'},
        )
        if not casa_user.has_usable_password():
            casa_user.set_password('sistema_casa_internal_2024')
            casa_user.save()
        Account.objects.get_or_create(user=casa_user, type='casa')
        Account.objects.get_or_create(user=casa_user, type='apuestas_pendientes')
        self.stdout.write(self.style.SUCCESS('Cuentas casa y apuestas_pendientes creadas'))

        demo_users = [
            {
                'username': 'demo1',
                'email': 'demo1@fairbet.com',
                'password': 'demo1234',
                'dni': '12345678',
                'balance': Decimal('1000.0000'),
            },
            {
                'username': 'demo2',
                'email': 'demo2@fairbet.com',
                'password': 'demo1234',
                'dni': '87654321',
                'balance': Decimal('500.0000'),
            },
        ]

        for data in demo_users:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={'email': data['email']},
            )
            if created:
                user.set_password(data['password'])
                user.save()
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'dni': data['dni'],
                        'fecha_nacimiento': '1990-01-01',
                        'estado_cuenta': 'verificado',
                    },
                )
                Account.objects.get_or_create(user=user, type='main')
                recargar(user, data['balance'], f'Saldo inicial para {data["username"]}')
                self.stdout.write(self.style.SUCCESS(
                    f'Creado {data["username"]} (verificado) con balance {data["balance"]}'
                ))
            else:
                self.stdout.write(self.style.WARNING(f'{data["username"]} ya existe'))

        self.stdout.write(self.style.SUCCESS('Seed completo'))
