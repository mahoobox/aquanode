from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from core.roles.serializers import RoleSerializer


class RegisterUserSerializer(serializers.ModelSerializer):
    """
    RegisterUserSerializer Class

    Serializer for register a new user

    """

    role = RoleSerializer(many=False)

    class Meta:
        model = User
        fields = "__all__"

    def validate_email(self, value):
        """
        validate email field in User model

        :param value: Email
        :type value: str
        :return: Email
        :rtype: str
        :raises serializers.ValidationError: If the email already exists

        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya existe")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["role"] = instance.role.name
        representation.pop("password", None)
        return representation


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["avatar"] = user.avatar.url
        token["role"] = user.role.name
        token["user"] = user.id

        return token
