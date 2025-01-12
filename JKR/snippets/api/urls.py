from django.urls import path
from .views import ListItems
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('', ListItems.as_view(), name='supplier-list-create'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'), 
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


