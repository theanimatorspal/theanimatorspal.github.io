from rest_framework import serializers
from JKR.snippets.models import Snippets

class SnippetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippets
        fields = ['id', 'title', 'code', 'linenos', 'language', 'style']
