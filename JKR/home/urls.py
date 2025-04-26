from django.urls import path
from .views import HomePage, DocumentationPage

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('documentation/', DocumentationPage.as_view(), name='documentation_page'),
]