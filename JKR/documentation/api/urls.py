from django.urls import path
from .views import DocumentationView

urlpatterns = [
    path('doci/', DocumentationView.as_view(), name='documentation'),
]
