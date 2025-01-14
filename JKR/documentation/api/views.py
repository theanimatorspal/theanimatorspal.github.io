from django.shortcuts import render
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from JKR.documentation.models import Documentation
from JKR.documentation.api.serializers import DocumentationSerialzier
from JKR.documentation.forms import DocumentationForm

class ListItems(APIView):

    def get(self, request):
        documentation = Documentation.objects.all()
        form = DocumentationForm()
        context = {
            'documentation': documentation,
            'form' : form

        }
        return render(request, 'documentations/create.html', context)
    
    def post(self, request):
        form = DocumentationForm()
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(request.path)
        documentation = Documentation.objects.all()
        context = {
            'documentation': documentation, 
            'form': form
        }
        return render(request, 'documentations/create.html', context)
