from rest_framework import viewsets
from django.views.generic import TemplateView
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class HomePage(TemplateView):
    template_name = os.path.join(BASE_DIR, "index.html") 
class DocumentationPage(TemplateView):
    template_name = os.path.join(BASE_DIR, "documentation.html")


# class Home(viewsets.Viewset):
