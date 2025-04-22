from django.shortcuts import render #type: ignore
from rest_framework.decorators import api_view, permission_classes #type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response #type: ignore 
from rest_framework import status #type: ignore
from .serializers import EventsSerializer, DiagnosisSerializer
from aquanodecore import FCMManager as fcm
from .models import Events, Diagnosis
from core.users.models import User
import requests  #type: ignore
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
            print("No hay tokens FCM registrados")    
        return Response({"message": "Datos guardados correctamente"}, status=status.HTTP_201_CREATED)
    
    print("Error en el serializer:", serializer.errors) 
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all(request):
    """
    Get all Events

    """
    try:
        survery = Events.objects.all().order_by('-created_at')
        
        serializer = EventsSerializer(survery, many=True)     
        return Response(serializer.data)
    except:
        message = {"detail": "No hay Eventos registrados"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event(request, pk):
    try:
        user = Events.objects.get(id=pk)
        serializer = EventsSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        message = {"detail": "El Evento no existe"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)    

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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_event(request, pk):
    try:
        data = request.data
        user = User.objects.get(id=data['user_id'])
        updateEvents = Events.objects.get(pk=pk)
        updateEvents.aprobbed = data['aprobbed']
        updateEvents.observation = data['observation']
        updateEvents.user = user
        updateEvents.save()
        return Response({'status': 'success'})
    except Events.DoesNotExist:
        return Response({'status': 'not found'}, status=404)
    except Exception as e:
        print(f"Error interno: {str(e)}") 
        return Response({'status': 'error', 'message': str(e)}, status=500)
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_diagnosis(request):
    """
    Register a news Diagnosis

    :param request: Request object
    :type request: HttpRequest
    :return: Response object
    :rtype: HttpResponse
    :raises Exception: If there is an error when registering the diagnosis

    """  
    try:
        file = request.FILES.get('analyzed_image')
        data = request.data

        def safe_float_from_form(data, key):
            try:
                value = data.get(key)
                if isinstance(value, list):
                    value = value[0]
                return float(value)
            except (TypeError, ValueError, IndexError):
                return None

        sano = safe_float_from_form(request.data, 'model_result[Ojo Sano]')
        nublado = safe_float_from_form(request.data, 'model_result[Ojo Nublado]')
        branquias = safe_float_from_form(request.data, 'model_result[branquias]')
        hongos = safe_float_from_form(request.data, 'model_result[hongos]')
        ich = safe_float_from_form(request.data, 'model_result[ich]')

        resultado_final = {
            'Ojo Sano': sano,
            'Ojo Nublado': nublado,
            'Branquias': branquias,
            'Hongos': hongos,
            'ICH': ich
        }
        user = User.objects.get(id=data['user_id'])
        defaults = {
            'analyzed_image': file,
            'model_result': resultado_final,
            'user': user,
            'ubicacion': data.get('ubicacion'),
        }
        
        Diagnos = Diagnosis.objects.create(**defaults)
        
        serializer = DiagnosisSerializer(Diagnos, many=False)
    
        return Response({'id': Diagnos.id, 'data': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        message = {
            'detail': f'Error al registrar la ecuesta convocatoria a asamblea: {str(e)}'}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
    
    
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_answer(request, pk):
    try:
        answer = Diagnosis.objects.get(id=pk)
        model = request.data.get('model_answer')
        answer.model_answer = model
        answer.save()
        return Response({'status': 'actualizado'}, status=status.HTTP_200_OK)
    except Diagnosis.DoesNotExist:
        return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_diagnosis(request):
    """
    Get all Diagnosis

    """
    try:
        diag = Diagnosis.objects.all().order_by('-created_at')
        data = []
        for n in diag:
            data.append({
            'id': n.id,
            'model_result': n.model_result,
            'user': n.user.name,
            'created_at': n.created_at
            })
        return Response(data)
    except:
        message = {"detail": "No hay Diagnosticos registrados"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_diagnosis_detail(request, pk):
    """
    Get Diagnosis Detail

    """
    try:
        diag = Diagnosis.objects.filter(id=pk)
        data = []
        for n in diag:
            location = obtener_direccion_desde_coordenadas(n.ubicacion)
            data.append({
            'id': n.id,
            'analyzed_image': n.analyzed_image.url if n.analyzed_image else None,
            'model_result': n.model_result,
            'model_answer': n.model_answer,
            'ubicacion': location,
            'user': n.user.name + " " + n.user.last_name,
            'created_at': n.created_at
            })
        return Response(data)
    except:
        message = {"detail": "No hay Diagnosticos registrados"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)     

def obtener_direccion_desde_coordenadas(coordenadas):
    try:
        lat, lon = coordenadas.split(",")
        url = 'https://nominatim.openstreetmap.org/reverse'
        params = {
            'format': 'json',
            'lat': lat.strip(),
            'lon': lon.strip(),
            'zoom': 18,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'aquanode/1.0 (acuicultura25@gmail.com)'  # Cambiá esto por algo real
        }
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()  # Lanza error si la respuesta no fue 200 OK
        data = response.json()
        return data.get('display_name', 'Dirección no encontrada')
    except Exception as e:
        return f"Error al obtener dirección: {e}"