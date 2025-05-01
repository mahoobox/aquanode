from rest_framework import serializers #type: ignore
from .models import Events, Diagnosis


class EventsSerializer(serializers.ModelSerializer):
    """
        EventsSerializer Class

        Serializer for Events model

    """
    class Meta:
        model = Events
        fields = '__all__'
    
    aprobbed = serializers.BooleanField(required=False, allow_null=True, default=None)

    def to_representation(self, instance):
        """
            to_representation method

            :param instance: Events object
            :type instance: Events
            :return: Events object
            :rtype: Events
            :raises: None
        """
        representation = super().to_representation(instance)
        return representation


class DiagnosisSerializer(serializers.ModelSerializer):
    """
        DiagnosisSerializer Class

        Serializer for Diagnosis model

    """
    class Meta:
        model = Diagnosis
        fields = '__all__'

    def to_representation(self, instance):
        """
            to_representation method

            :param instance: Diagnosis object
            :type instance: Diagnosis
            :return: Diagnosis object
            :rtype: Diagnosis
            :raises: None
        """
        representation = super().to_representation(instance)
        return representation
