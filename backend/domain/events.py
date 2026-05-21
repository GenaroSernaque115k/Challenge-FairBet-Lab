from decimal import Decimal
import random

random.seed(42)

MARGIN_FACTOR = Decimal('0.06')
CASHOUT_HOUSE_FACTOR = Decimal('0.90')

CORRECT_SCORES = [
    '1-0', '2-0', '2-1', '3-0', '3-1', '3-2',
    '0-0', '1-1', '2-2',
    '0-1', '0-2', '1-2', '0-3', '1-3', '2-3',
]
HT_FT_COMBOS = ['1/1', '1/X', '1/2', 'X/1', 'X/X', 'X/2', '2/1', '2/X', '2/2']
SET_BETS = ['3-0', '3-1', '3-2', '2-3', '1-3', '0-3']


def calculate_odds_with_margin(fair_odds: list[Decimal], margin: Decimal = MARGIN_FACTOR) -> list[Decimal]:
    total_implied = sum(Decimal('1') / o for o in fair_odds)
    return [o / (Decimal('1') + margin * o / total_implied) for o in fair_odds]


def implied_probability(odds: Decimal) -> Decimal:
    return Decimal('1') / odds


def calculate_payout(stake: Decimal, odds: Decimal) -> Decimal:
    return (stake * odds).quantize(Decimal('0.0001'))


def calculate_cashout(stake: Decimal, odds_original: Decimal, odds_current: Decimal) -> Decimal:
    return (stake * odds_original / odds_current * CASHOUT_HOUSE_FACTOR).quantize(Decimal('0.0001'))


def rand_odds(low=1.40, high=6.00):
    return Decimal(str(round(random.uniform(low, high), 2)))


def generate_1X2():
    return [rand_odds(1.40, 5.50), rand_odds(2.80, 4.50), rand_odds(1.60, 6.00)]


def generate_double_chance(home, draw, away):
    return [
        Decimal(str(round(float(home) * float(draw) / (float(home) + float(draw)), 2))),
        Decimal(str(round(float(home) * float(away) / (float(home) + float(away)), 2))),
        Decimal(str(round(float(draw) * float(away) / (float(draw) + float(away)), 2))),
    ]


def generate_draw_no_bet(home, draw):
    implied = float(home) / (float(home) + float(draw))
    return [
        Decimal(str(round(1.0 / implied, 2))),
        Decimal(str(round(1.0 / (1.0 - implied), 2))),
    ]


def generate_ou_goals(low=1.50, high=2.30):
    return [rand_odds(low, high), rand_odds(low, high)]


def generate_btts():
    return [rand_odds(1.50, 2.20), rand_odds(1.55, 2.50)]


def generate_btts_ou25():
    return [
        rand_odds(2.10, 3.50), rand_odds(2.50, 5.00),
        rand_odds(3.50, 7.00), rand_odds(1.40, 2.20),
    ]


def generate_ht_ft():
    return [rand_odds(3.00, 90.00) for _ in range(9)]


def generate_correct_score():
    return [rand_odds(5.00, 90.00) for _ in range(15)]


def generate_handicap():
    return [rand_odds(1.60, 2.40), rand_odds(1.55, 2.30)]


def generate_tennis_winner():
    return [rand_odds(1.40, 2.80), rand_odds(1.40, 2.80)]


def generate_tennis_handicap():
    return [rand_odds(1.70, 2.20), rand_odds(1.65, 2.30)]


def generate_set_betting():
    return [rand_odds(2.00, 15.00) for _ in range(6)]


def generate_basket_spread():
    return [rand_odds(1.80, 2.00), rand_odds(1.80, 2.00)]
