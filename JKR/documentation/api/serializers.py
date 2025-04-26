from rest_framework import serializers
from JKR.documentation.models import Documentation

class DocumentationSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Documentation
        fields = ['id', 'title', 'body']
