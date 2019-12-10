from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import QuoteSerializer
from webapp.models import Quote


class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status':'ok'})


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
