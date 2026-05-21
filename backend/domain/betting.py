from decimal import Decimal
from dataclasses import dataclass
from typing import Optional

VALID_BET_TRANSITIONS = {
    'accepted': ['won', 'lost', 'cashed_out', 'cancelled'],
    'won': [],
    'lost': [],
    'cashed_out': [],
    'cancelled': [],
}

MIN_STAKE = Decimal('1.0000')
MAX_STAKE_SINGLE = Decimal('10000.0000')
MAX_STAKE_COMBINED = Decimal('5000.0000')
MAX_SELECTIONS_COMBINED = 10
MIN_ODDS = Decimal('1.0100')


def is_valid_transition(current_status: str, new_status: str) -> bool:
    return new_status in VALID_BET_TRANSITIONS.get(current_status, [])


def is_terminal_status(status: str) -> bool:
    return status in ('won', 'lost', 'cashed_out', 'cancelled')


def validate_bet_stake(stake: Decimal, is_combined: bool = False) -> Optional[str]:
    if stake < MIN_STAKE:
        return f'Apuesta minima: {MIN_STAKE} BP'
    max_stake = MAX_STAKE_COMBINED if is_combined else MAX_STAKE_SINGLE
    if stake > max_stake:
        return f'Apuesta maxima: {max_stake} BP'
    return None


def validate_odds(odds: Decimal) -> Optional[str]:
    if odds < MIN_ODDS:
        return f'Cuota minima: {MIN_ODDS}'
    return None


def validate_mutual_exclusion(market_type: str, selection_names: list[str]):
    if market_type == '1X2':
        if set(selection_names) & {'Local', 'Empate', 'Visitante'}:
            if len(set(selection_names) & {'Local', 'Empate', 'Visitante'}) > 1:
                raise ValueError('No se puede combinar Local/Empate/Visitante del mismo partido')


def validate_event_not_started(event_status: str) -> Optional[str]:
    if event_status in ('en_vivo', 'finalizado', 'suspendido', 'anulado'):
        return f'No se puede apostar en evento con estado: {event_status}'
    return None


@dataclass
class BetState:
    status: str
    payout: Optional[Decimal] = None

    def transition(self, new_status: str) -> 'BetState':
        if not is_valid_transition(self.status, new_status):
            raise ValueError(f'Transicion invalida: {self.status} -> {new_status}')
        return BetState(status=new_status)
