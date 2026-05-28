from decimal import Decimal
from django.db.models import Sum
from hypothesis.extra.django import TestCase as HypothesisTestCase
from hypothesis import given, settings, strategies as st

# Importaciones ajustadas a tu arquitectura exacta
from infrastructure.wallet import Account, LedgerEntry
from application.wallet import create_double_entry
from django.contrib.auth import get_user_model

User = get_user_model()

class WalletInvariantsTest(HypothesisTestCase):
    @classmethod
    def setUpTestData(cls):
        # Setup inicial de cuentas del sistema y usuario de prueba
        cls.user = User.objects.create(username="test_user")
        cls.user_account = Account.objects.create(user=cls.user, type="main")
        cls.casa_account = Account.objects.create(user=None, type="casa")

    @settings(max_examples=50)
    @given(
        recarga=st.decimals(min_value=Decimal('0.0001'), max_value=Decimal('10000.0000'), places=4),
        retiro=st.decimals(min_value=Decimal('0.0001'), max_value=Decimal('5000.0000'), places=4)
    )
    def test_partida_doble_y_saldo_nunca_negativo(self, recarga, retiro):
        """
        Verifica invariantes financieras realizando operaciones aleatorias.
        """
        # 1. Simular una recarga (Casa -> Usuario)
        create_double_entry(
            from_account=self.casa_account,
            to_account=self.user_account,
            amount=recarga,
            description="Recarga test"
        )
        
        # 2. Simular un retiro seguro (solo si el saldo lo permite)
        # Obtenemos el saldo calculándolo directamente desde LedgerEntry para la prueba
        saldo_actual = LedgerEntry.objects.filter(account=self.user_account, direction='CREDIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        saldo_actual -= LedgerEntry.objects.filter(account=self.user_account, direction='DEBIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        
        if saldo_actual >= retiro:
            create_double_entry(
                from_account=self.user_account,
                to_account=self.casa_account,
                amount=retiro,
                description="Retiro test"
            )

        # INVARIANTE 1: La suma global de débitos y créditos SIEMPRE es cero
        total_credits = LedgerEntry.objects.filter(direction='CREDIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        total_debits = LedgerEntry.objects.filter(direction='DEBIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        
        self.assertEqual(
            total_credits - total_debits, 
            Decimal('0.0000'), 
            "Ruptura de partida doble: La suma global no es cero."
        )

        # INVARIANTE 2: Ningún wallet termina con saldo negativo
        saldo_final = LedgerEntry.objects.filter(account=self.user_account, direction='CREDIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        saldo_final -= LedgerEntry.objects.filter(account=self.user_account, direction='DEBIT').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.0000')
        
        self.assertGreaterEqual(
            saldo_final, 
            Decimal('0.0000'), 
            "Invariante rota: El saldo del usuario es negativo."
        )