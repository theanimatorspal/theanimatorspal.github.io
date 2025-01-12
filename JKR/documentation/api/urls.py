from django.urls import path
from .views import ListItems

urlpatterns = [
    path('', ListItems.as_view(), name='documentation'),
]
