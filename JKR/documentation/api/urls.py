from django.urls import path
from .views import ListItems
app_name = 'documentation'
urlpatterns = [
    path('create/', ListItems.as_view(), name='create_documentation'),
]
