from rest_framework import serializers #type: ignore
from .models import Quality, Parameters


class QualitySerializer(serializers.ModelSerializer):
    """
        QualitySerializer Class

        Serializer for Quality model

    """
    class Meta:
        model = Quality
        fields = '__all__'
    

    def to_representation(self, instance):
        """
            to_representation method

            :param instance: Quality object
            :type instance: Quality
            :return: Quality object
            :rtype: Quality
            :raises: None
        """
        representation = super().to_representation(instance)
        return representation


class ParametersSerializer(serializers.ModelSerializer):
    """
        ParametersSerializer Class

        Serializer for Parameters model

    """
    class Meta:
        model = Parameters
        fields = '__all__'
    

    def to_representation(self, instance):
        """
            to_representation method

            :param instance: Parameters object
            :type instance: Parameters
            :return: Parameters object
            :rtype: Parameters
            :raises: None
        """
        representation = super().to_representation(instance)
        return representation
