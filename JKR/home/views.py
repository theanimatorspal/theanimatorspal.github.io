from rest_framework import viewsets
from django.views.generic import TemplateView

class HomePage(TemplateView):
    template_name = 'homes/home.html'

# class Home(viewsets.Viewset):
