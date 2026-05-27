from rest_framework import serializers
from infrastructure.audit import AuditLog, SuspiciousActivity


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True, default='')

    class Meta:
        model = AuditLog
        fields = ('id', 'timestamp', 'username', 'action', 'entity_type',
                  'entity_id', 'data', 'hash_prev', 'hash_current')


class AuditVerifySerializer(serializers.Serializer):
    total = serializers.IntegerField()
    errors = serializers.IntegerField()
    valid = serializers.BooleanField()
    details = serializers.ListField()


class SuspiciousActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SuspiciousActivity
        fields = ('id', 'username', 'tipo', 'descripcion', 'severidad',
                  'resuelto', 'created_at')
