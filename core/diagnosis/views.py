from django.shortcuts import render #type: ignore
from rest_framework.decorators import api_view, permission_classes #type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response #type: ignore 
from rest_framework import status #type: ignore
from .serializers import EventsSerializer
from aquanodecore import FCMManager as fcm
from .models import Events
from core.users.models import User
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
    serializer = EventsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        tokens = list(
            User.objects
            .filter(fcm_token__isnull=False)
            .values_list('fcm_token', flat=True)
        ) 
        if tokens:
            print(f"Enviando a {len(tokens)} tokens")
            for token in tokens:  # Envía uno por uno
                try:
                    fcm.send_push_notification(str(token), request.data.get("events"), request.data.get("url"))
                except Exception as e:
                    print(f"Error al enviar a {token}: {e}")    
        else:
            print("⚠️ No hay tokens FCM registrados")    
        return Response({"message": "Datos guardados correctamente"}, status=status.HTTP_201_CREATED)
    
    print("❌ Error en el serializer:", serializer.errors) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications(request):
    notifications = Events.objects.order_by('-created_at')
    data = [{
        'id': n.id,
        'events': n.events,
        'url': n.url,
        'is_read': n.is_read,
        'created_at': n.created_at
    } for n in notifications]
    return Response(data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    try:
        notification = Events.objects.get(pk=pk)
        notification.is_read = True
        notification.save()
        return Response({'status': 'success'})
    except Events.DoesNotExist:
        return Response({'status': 'not found'}, status=404)
    except Exception as e:
        print(f"Error interno: {str(e)}") 
        return Response({'status': 'error', 'message': str(e)}, status=500)
