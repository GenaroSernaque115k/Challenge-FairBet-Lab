from django.urls import path
from controllers.audit import AuditLogListView, AuditVerifyView, FraudAlertsView

urlpatterns = [
    path('audit/logs/', AuditLogListView.as_view(), name='audit-logs'),
    path('audit/verify/', AuditVerifyView.as_view(), name='audit-verify'),
    path('fraud/alerts/', FraudAlertsView.as_view(), name='fraud-alerts'),
]
