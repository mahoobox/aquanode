from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Role
from .serializers import RoleSerializer
from .forms import RoleValidator
from core.decorators.decorators import permission_required

# Create your views here.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def register_role(request):
    """
    Register a new role

    :param request: Request object
    :type request: HttpRequest
    :return: Response object
    :rtype: HttpResponse
    :raises IntegrityError: If the role already exists
    :raises Exception: If there is an error when registering the role

    """

    try:
        data = request.data
        role_validator = RoleValidator(data)
        if role_validator.is_valid():
            role = Role.objects.create(name=data["name"].lower())
            serializer = RoleSerializer(role, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            message = {
                "detail": "El nombre solo puede contener letras, espacios y acento"
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        message = {"detail": "El rol ya existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {"detail": f"Error al registrar el rol: {str(e)}"}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def get_roles(request):
    """
    Get all roles

    :param request: Request object
    :type request: HttpRequest
    :return: Response object
    :rtype: HttpResponse

    """

    try:
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        message = {"detail": "No hay roles registrados"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def get_role(request, pk):
    """
    Get a role by id

    :param request: Request object
    :type request: HttpRequest
    :param pk: Role id
    :type pk: int
    :return: Response object
    :rtype: HttpResponse

    """
    try:
        role = Role.objects.get(id=pk)
        serializer = RoleSerializer(role, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        message = {"detail": "El rol no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def update_role(request, pk):
    """
    Update a role by id

    :param request: Request object
    :type request: HttpRequest
    :param pk: Role id
    :type pk: int
    :return: Response object
    :rtype: HttpResponse

    """
    try:
        data = request.data
        role_validator = RoleValidator(data)
        if role_validator.is_valid():
            role = Role.objects.get(id=pk)
            role.name = data["name"]
            role.save()
            serializer = RoleSerializer(role, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            message = {
                "detail": "El nombre solo puede contener letras, espacios y acento"
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except:
        message = {"detail": "El rol no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def delete_role(request, pk):
    """
    Delete a role by id

    :param request: Request object
    :type request: HttpRequest
    :param pk: Role id
    :type pk: int
    :return: Response object
    :rtype: HttpResponse

    """
    try:
        role = Role.objects.get(id=pk)
        role.delete()
        message = {"detail": "El rol ha sido eliminado"}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {"detail": "El rol no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
