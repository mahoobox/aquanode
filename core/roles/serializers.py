from rest_framework import serializers
from .models import Role


class RoleSerializer(serializers.ModelSerializer):
    """
        RoleSerializer Class

        Serializer for Role model

    """
    class Meta:
        model = Role
        fields = '__all__'

    def to_representation(self, instance):
        """
            to_representation method

            :param instance: Role object
            :type instance: Role
            :return: Role object
            :rtype: Role
            :raises: None
        """
        representation = super().to_representation(instance)
        representation['name'] = instance.name
        return representation
