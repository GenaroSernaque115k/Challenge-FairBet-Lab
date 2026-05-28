from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/docs/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/wallet/', include('wallet.urls')),
    path('api/events/', include('events.urls')),
    path('api/betting/', include('betting.urls')),
    path('api/responsible-gaming/', include('responsible_gaming.urls')),
    path('api/admin/', include('audit.urls')),
    path('api/bonuses/', include('bonuses.urls')),
    path('api/operator/', include('operador.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
