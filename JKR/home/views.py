from rest_framework import viewsets
from django.views.generic import TemplateView


class HomePage(TemplateView):
    template_name = "template/homes/index.html" 
class DocumentationPage(TemplateView):
    template_name = "template/homes/documentation.html"

# class Home(viewsets.Viewset):
