from webapp.models import Quote

from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class QuoteRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ('rating',)
