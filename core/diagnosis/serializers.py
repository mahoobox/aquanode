from rest_framework import serializers
from .models import Events


class EventsSerializer(serializers.ModelSerializer):
    """
        EventsSerializer Class

        Serializer for Events model

    """
    class Meta:
        model = Events
        fields = '__all__'

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
