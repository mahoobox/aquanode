from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status
from .models import Events
from .serializers import EventsSerializer
# Create your views here.


@api_view(["POST"])
def register_events(request):
    """
    Register a news events

    :param request: Request object
    :type request: HttpRequest
    :return: Response object
    :rtype: HttpResponse
    :raises IntegrityError: If the event already exists
    :raises Exception: If there is an error when registering the event

    """
    try:
        data = request.data    
        serializer = EventsSerializer(Events, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {'detail': f'Error al registrar el evento: {str(e)}'}
        print("Mensaje", message)
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)