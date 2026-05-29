# backend/betting/tests/test_invariants.py
from decimal import Decimal
from hypothesis import given, settings, strategies as st
from django.test import TestCase

# Asumiendo que tu modelo o servicio de liquidación tiene una lógica similar
def calculate_payout(stake: Decimal, odds: Decimal) -> Decimal:
    """Función pura representativa de tu lógica de negocio."""
    return (stake * odds).quantize(Decimal('0.0001'))

class BettingInvariantsTest(TestCase):
    
    @settings(max_examples=100)
    @given(
        stake=st.decimals(min_value=Decimal('0.1000'), max_value=Decimal('10000.0000'), places=4),
        odds=st.decimals(min_value=Decimal('1.01'), max_value=Decimal('100.00'), places=2)
    )
    def test_payout_calculation_exactness(self, stake, odds):
        """
        Verifica que el cálculo del payout nunca exceda stake * odds 
        y maneje correctamente la precisión decimal de 4 lugares.
        """
        payout = calculate_payout(stake, odds)
        
        # El resultado debe ser un Decimal válido
        self.assertIsInstance(payout, Decimal)
        
        # INVARIANTE 3: El payout debe ser matemáticamente preciso a 4 decimales
        expected_raw = stake * odds
        expected_quantized = expected_raw.quantize(Decimal('0.0001'))
        
        self.assertEqual(
            payout, 
            expected_quantized, 
            f"Error de cálculo: {stake} * {odds} resultó en {payout} en vez de {expected_quantized}"
        )