from decimal import Decimal

MIN_ODDS_FOR_ROLLOVER = Decimal('1.10')
BONUS_EXPIRATION_DAYS = 30
MAX_BONUS_PERCENT = Decimal('200')


def validate_bonus_application(user, bonus) -> str | None:
    from infrastructure.bonuses import UserBonus
    if not bonus.activo:
        return 'Este bono ya no esta disponible'
    if bonus.tipo == 'bienvenida':
        if UserBonus.objects.filter(user=user, bonus__tipo='bienvenida').exists():
            return 'Ya reclamaste tu bono de bienvenida'
    return None


def calculate_bonus_amount(deposit_amount: Decimal, bonus) -> Decimal:
    monto = deposit_amount * bonus.porcentaje / Decimal('100')
    return min(monto, bonus.monto_max)


def validate_rollover_odds(odds: Decimal) -> bool:
    return odds >= MIN_ODDS_FOR_ROLLOVER
