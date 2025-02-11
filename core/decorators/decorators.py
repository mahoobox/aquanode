from functools import wraps
from rest_framework.response import Response
from rest_framework import status


def permission_required(permission_name):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response(
                    {"detail": "No autorizado"}, status=status.HTTP_401_UNAUTHORIZED
                )

            if not request.user.role.name == permission_name:
                return Response(
                    {"detail": "No tiene permisos para realizar esta acción"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            return view_func(request, *args, **kwargs)

        return _wrapped_view
    return decorator
