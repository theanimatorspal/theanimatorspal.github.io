from rest_framework import viewsets
from django.views.generic import TemplateView


class HomePage(TemplateView):
    template_name = "template/homes/home.html" 
class DocumentationPage(TemplateView):
    template_name = "template/homes/home.html"

# class Home(viewsets.Viewset):
