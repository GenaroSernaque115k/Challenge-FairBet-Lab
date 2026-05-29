from decimal import Decimal
from django.utils import timezone
from rest_framework import serializers

from infrastructure.responsible_gaming import DepositLimits, LimitChangeRequest, AutoExclusion
from domain.responsible_gaming import (
    AUTOEXCLUSION_PERIODS, COOLDOWN_HOURS,
    has_cooldown_expired, is_limit_increase, validate_limit_value,
)


class DepositLimitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositLimits
        fields = ('limite_diario', 'limite_semanal', 'limite_mensual',
                  'limite_apuesta_max', 'limite_perdida_diaria')

    def validate_limite_diario(self, value):
        err = validate_limit_value(value)
        if err:
            raise serializers.ValidationError(err)
        return value

    def validate_limite_semanal(self, value):
        err = validate_limit_value(value)
        if err:
            raise serializers.ValidationError(err)
        return value

    def validate_limite_mensual(self, value):
        err = validate_limit_value(value)
        if err:
            raise serializers.ValidationError(err)
        return value

    def validate_limite_apuesta_max(self, value):
        err = validate_limit_value(value)
        if err:
            raise serializers.ValidationError(err)
        return value

    def validate_limite_perdida_diaria(self, value):
        err = validate_limit_value(value)
        if err:
            raise serializers.ValidationError(err)
        return value


class AutoExclusionSerializer(serializers.Serializer):
    periodo = serializers.ChoiceField(
        choices=list(AUTOEXCLUSION_PERIODS.keys()),
        help_text='7d, 30d, 90d, indefinida',
    )
    motivo = serializers.CharField(required=False, allow_blank=True, default='')


class LimitChangeRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LimitChangeRequest
        fields = ('id', 'username', 'tipo_limite', 'valor_anterior',
                  'valor_solicitado', 'estado', 'created_at', 'approved_at')
        read_only_fields = ('estado', 'created_at', 'approved_at')


def get_or_create_limits(user) -> DepositLimits:
    limits, _ = DepositLimits.objects.get_or_create(user=user)
    return limits


def apply_limit_change(user, tipo_limite: str, valor: Decimal) -> dict:
    limits = get_or_create_limits(user)
    valor_anterior = getattr(limits, tipo_limite, Decimal('0'))

    if is_limit_increase(valor_anterior, valor):
        last_change = LimitChangeRequest.objects.filter(
            user=user, tipo_limite=tipo_limite, estado='approved',
        ).order_by('-created_at').first()
        if not has_cooldown_expired(last_change):
            raise ValueError(
                f'Para subir el limite debes esperar {COOLDOWN_HOURS}h desde el ultimo cambio.'
            )

    change = LimitChangeRequest.objects.create(
        user=user,
        tipo_limite=tipo_limite,
        valor_anterior=valor_anterior,
        valor_solicitado=valor,
        estado='approved',
        approved_at=timezone.now(),
    )

    setattr(limits, tipo_limite, valor)
    limits.save()

    return {
        'tipo_limite': tipo_limite,
        'valor_anterior': str(valor_anterior),
        'valor_nuevo': str(valor),
        'created_at': change.created_at.isoformat(),
    }


def create_autoexclusion(user, periodo: str, motivo: str = '') -> AutoExclusion:
    from datetime import timedelta
    fecha_fin = None
    if periodo != 'indefinida':
        delta = AUTOEXCLUSION_PERIODS[periodo]
        fecha_fin = timezone.now() + delta

    auto_exclusion, _ = AutoExclusion.objects.get_or_create(
        user=user,
        defaults={'fecha_inicio': timezone.now(), 'fecha_fin': fecha_fin, 'motivo': motivo, 'activa': True},
    )
    if not auto_exclusion.activa:
        auto_exclusion.fecha_inicio = timezone.now()
        auto_exclusion.fecha_fin = fecha_fin
        auto_exclusion.motivo = motivo
        auto_exclusion.activa = True
        auto_exclusion.save()

    profile = user.profile
    profile.estado_cuenta = 'autoexcluido'
    profile.save()

    return auto_exclusion


def check_and_reactivate_autoexclusion():
    from django.utils import timezone
    now = timezone.now()
    expired = AutoExclusion.objects.filter(activa=True, fecha_fin__isnull=False, fecha_fin__lte=now)
    count = 0
    for ae in expired:
        ae.activa = False
        ae.save()
        profile = ae.user.profile
        if profile.estado_cuenta == 'autoexcluido':
            profile.estado_cuenta = 'verificado'
            profile.save()
        count += 1
    return count


def validate_user_limits(user, stake: Decimal) -> str | None:
    from decimal import Decimal
    from django.utils import timezone
    from infrastructure.betting import Bet
    from application.wallet import get_balance

    try:
        limits = user.deposit_limits
    except DepositLimits.DoesNotExist:
        return None

    if limits.limite_apuesta_max and limits.limite_apuesta_max > Decimal('0'):
        if stake > limits.limite_apuesta_max:
            return f'La apuesta excede tu limite maximo de {limits.limite_apuesta_max} BP'

    if limits.limite_perdida_diaria and limits.limite_perdida_diaria > Decimal('0'):
        hoy = timezone.now().date()
        bets_today = Bet.objects.filter(
            user=user,
            placed_at__date=hoy,
            status__in=('lost', 'cashed_out'),
        )
        perdido_hoy = sum((b.stake for b in bets_today), Decimal('0'))
        if perdido_hoy + stake > limits.limite_perdida_diaria:
            return f'Con esta apuesta excederias tu limite de perdida diaria de {limits.limite_perdida_diaria} BP'

    return None
