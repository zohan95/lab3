from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import QuoteSerializer, QuoteRateSerializer
from webapp.models import Quote
from rest_framework.permissions import AllowAny
from rest_framework.permissions import SAFE_METHODS


class LogoutView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS or self.request.method == 'POST':
            return []

        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:

            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
        else:
            queryset = self.filter_queryset(self.get_queryset()).filter(status=Quote.STATUS_CHOICES[0][0])
            serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_authenticated is False and instance.status == Quote.STATUS_CHOICES[0][0]:
            serializer = self.get_serializer(instance)
            print('h')
            return Response(serializer.data)
        elif request.user.is_authenticated:
            print('u')
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class RateView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)

    queryset = Quote.objects.all()
    serializer_class = QuoteRateSerializer
