from concurrent.futures import ThreadPoolExecutor, as_completed
from decimal import Decimal

from django.test import TestCase
from django.db import models
from django.contrib.auth import get_user_model

from infrastructure.wallet import Account, LedgerEntry
from application.wallet import create_double_entry, get_balance

User = get_user_model()


class ConcurrencyTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='concurrent_test', password='test1234')
        cls.user_account = Account.objects.create(user=cls.user, type='main')
        cls.casa = Account.objects.create(user=None, type='casa')
        cls.apuestas = Account.objects.create(user=None, type='apuestas_pendientes')

    def setUp(self):
        LedgerEntry.objects.all().delete()
        create_double_entry(
            self.casa, self.user_account,
            Decimal('50000.0000'),
            'Balance inicial test concurrencia',
        )

    def test_no_double_spend_with_concurrent_bets(self):
        num_threads = 10
        stake = Decimal('1000.0000')
        initial_balance = get_balance(self.user, 'main')

        def make_bet(i):
            try:
                create_double_entry(
                    self.user_account, self.apuestas,
                    stake, f'Apuesta concurrente #{i}'
                )
                return True, stake
            except Exception as e:
                return False, str(e)

        results = []
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(make_bet, i) for i in range(num_threads)]
            for future in as_completed(futures):
                results.append(future.result())

        final_balance = get_balance(self.user, 'main')
        self.assertGreaterEqual(
            final_balance, Decimal('0.0000'),
            f'Doble gasto detectado: balance negativo {final_balance}',
        )

        total_credits = LedgerEntry.objects.filter(direction='CREDIT').aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.0000')
        total_debits = LedgerEntry.objects.filter(direction='DEBIT').aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.0000')
        self.assertEqual(
            total_credits - total_debits,
            Decimal('0.0000'),
            'Partida doble rota tras operaciones concurrentes',
        )

        max_possible = int(initial_balance / stake)
        successful = sum(1 for ok, _ in results if ok)
        self.assertLessEqual(
            successful, max_possible,
            f'Demasiadas apuestas exitosas ({successful} > {max_possible} maximo)',
        )
