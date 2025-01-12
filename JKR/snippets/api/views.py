from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from JKR.snippets.models import Snippets
from JKR.snippets.api.serializers import SnippetsSerializer


class ListItems(APIView):

    def get(self, request):
        snippets = Snippets.objects.all()
        serializer = SnippetsSerializer(snippets, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SnippetsSerializer(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

