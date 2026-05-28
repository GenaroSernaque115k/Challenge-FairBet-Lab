from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Count, Q


def calcular_ggr(desde=None, hasta=None) -> dict:
    from infrastructure.betting import Bet
    filters = {}
    if desde:
        filters['placed_at__gte'] = desde
    if hasta:
        filters['placed_at__lt'] = hasta

    bets = Bet.objects.filter(**filters)
    total_stakes = bets.aggregate(s=Sum('stake'))['s'] or Decimal('0')
    total_payouts = bets.filter(payout__isnull=False).aggregate(p=Sum('payout'))['p'] or Decimal('0')
    ggr = total_stakes - total_payouts

    return {
        'total_stakes': str(total_stakes),
        'total_payouts': str(total_payouts),
        'ggr': str(ggr),
        'total_bets': bets.count(),
    }


def calcular_exposure(event_id: int) -> list[dict]:
    from infrastructure.betting import Bet, BetSelection
    from infrastructure.events import Selection

    selections = Selection.objects.filter(market__event_id=event_id)
    bets = Bet.objects.filter(
        status='accepted',
        betselection__selection__in=selections,
    ).distinct()

    exposure = []
    for sel in selections:
        sel_bets = BetSelection.objects.filter(
            selection=sel,
            bet__in=bets,
        ).select_related('bet')
        potential_payout = sum(
            (bs.bet.stake * bs.odds_at_time) for bs in sel_bets
        )
        exposure.append({
            'selection_id': sel.id,
            'selection_name': sel.name,
            'odds': str(sel.odds),
            'bets_count': sel_bets.count(),
            'potential_payout': str(potential_payout),
        })

    return exposure


def generar_reporte_csv(mes: int, anio: int):
    import csv
    import io
    from infrastructure.betting import Bet, BetSelection

    desde = timezone.datetime(anio, mes, 1)
    if mes == 12:
        hasta = timezone.datetime(anio + 1, 1, 1)
    else:
        hasta = timezone.datetime(anio, mes + 1, 1)

    bets = Bet.objects.filter(
        placed_at__gte=desde,
        placed_at__lt=hasta,
    ).select_related('user').prefetch_related('betselection_set__selection__market__event')

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Fecha', 'Usuario', 'Tipo Apuesta', 'Stake', 'Payout', 'Resultado', 'Evento', 'Mercado'])

    for bet in bets:
        for bs in bet.betselection_set.all():
            writer.writerow([
                bet.placed_at.date().isoformat(),
                bet.user.username,
                'Simple' if bet.betselection_set.count() == 1 else 'Combinada',
                str(bet.stake),
                str(bet.payout or '0'),
                bet.status,
                f'{bs.selection.market.event.team_home} vs {bs.selection.market.event.team_away}',
                bs.selection.market.name,
            ])

    return output.getvalue()
