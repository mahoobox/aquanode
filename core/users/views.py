from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from django.contrib.auth.hashers import make_password # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from django.db import IntegrityError # type: ignore
from rest_framework import status # type: ignore
from .serializers import RegisterUserSerializer, MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated # type: ignore
from .models import User
from core.roles.models import Role
from .forms import UserValidator
from core.decorators.decorators import permission_required
from core.utils.encryption import decrypt_password
# Create your views here.


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def register_user(request):
    """
        Register a new user

        :param request: Request object
        :type request: HttpRequest
        :return: Response object
        :rtype: HttpResponse
        :raises Role.DoesNotExist: If the role does not exist
        :raises Company.DoesNotExist: If the company does not exist
        :raises IntegrityError: If the email already exists
        :raises Exception: If there is an error when registering the user

    """   
    try:
        data = request.data
        role = Role.objects.get(name=data['role'])
        user_validator = UserValidator(data)        
        if user_validator.is_valid():
            user = User.objects.create(
                name=data['name'],
                last_name=data['last_name'],
                email=data['email'],
                password=make_password(data['password']),
                role=role,
            )
            serializer = RegisterUserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            message = {"detail": "La información enviada no es válida"}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Role.DoesNotExist:
        message = {"detail": "El rol no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        message = {"detail": "El email ya existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {"detail": f"Error al registrar el usuario: {str(e)}"}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@permission_required("Super Administrador")
def get_users(request):
    try:
        users = User.objects.all()        
        serializer = RegisterUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        message = {'detail': 'Error al obtener los usuarios'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, pk):
    try:
        user = User.objects.get(id=pk)
        serializer = RegisterUserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        message = {"detail": "El usuario no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    try:
        data = request.data
        user_validator = UserValidator(data)
        if user_validator.is_valid():
            user = User.objects.get(id=pk)
            user.name = data['name']
            user.last_name = data['last_name']
            user.email = data['email']
            user.save()
            serializer = RegisterUserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            message = {'detail': 'La información enviada no es válida'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        message = {'detail': 'El usuario no existe'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {'detail': f'Error al actualizar el usuario: {str(e)}'}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_fcm_token(request):
    user = request.user 
    fcm_token = request.data.get('fcm_token') 
    if not fcm_token:
        return Response({'error': 'FCM token es requerido'}, status=status.HTTP_400_BAD_REQUEST)
    user.fcm_token = fcm_token
    user.save()
    return Response({'status': 'Token actualizado correctamente'}, status=status.HTTP_200_OK)


class LoginUserView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer    
    
    def post(self, request, *args, **kwargs):
        try:
            data = request.data.copy()

            if "password" not in data or not data["password"]:
                message = {"detail": "La contraseña es requerida"}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            try:

                descrypted_password = decrypt_password(data["password"])
                data["password"] = descrypted_password
            except ValueError as descryption_error:
                message = {
                    "detail": f"Error al descifrar la contraseña: {str(descryption_error)}"
                }
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

            request._full_data = data

            return super().post(request, *args, **kwargs)

        except Exception as e:
            message = {"detail": f"Error al iniciar sesión: {str(e)}"}
            return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)