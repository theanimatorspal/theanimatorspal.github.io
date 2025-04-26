from django import forms
from JKR.documentation.models import Documentation

class DocumentationForm(forms.ModelForm):
    class Meta:
        model = Documentation
        fields = '__all__'