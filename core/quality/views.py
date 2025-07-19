from django.shortcuts import render #type: ignore
from rest_framework.decorators import api_view, permission_classes #type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response #type: ignore 
from rest_framework import status #type: ignore
from .serializers import QualitySerializer, ParametersSerializer
from .models import Quality, Parameters

# Create your views here.


@api_view(["POST"])
def register_quality(request):
    """
        Register a news quality

        :param request: Request object
        :type request: HttpRequest
        :return: Response object
        :rtype: HttpResponse
        :raises IntegrityError: If the quality already exists
        :raises Exception: If there is an error when registering the quality
    """    
    try:
        data_list = request.data  # Ahora es una lista de diccionarios
        created_qualities = []
    
        for data in data_list:
            defaults = {
                'ubication': data.get('ubicación'),
                'od': data.get('od(ppm)'),
                'odc': data.get('od(%)'),
                'tc': data.get('t°c'),
                'ph': data.get('ph'),
                'ce': data.get('ce'),
                'tds': data.get('tds'),
                'salinity': data.get('salinidad'),
                'date': data.get('fecha'),
                'hour': data.get('hora'),
                'observation': data.get('observaciones'),
            }
            quality = Quality.objects.create(**defaults)
            created_qualities.append(quality)
        
        serializer = QualitySerializer(created_qualities, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        message = {'detail': f'Error al registrar los datos: {str(e)}'}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def register_parameters(request):
    """
    Register a news parameters

        :param request: Request object
        :type request: HttpRequest
        :return: Response object
        :rtype: HttpResponse
        :raises IntegrityError: If the parameters already exists
        :raises Exception: If there is an error when registering the parameters

    """  
    try:
        data_list = request.data  # Ahora es una lista de diccionarios
        created_parameters= []
    
        for data in data_list:
            defaults = {                
                'od': data.get('od(ppm)'),
                'odc': data.get('od(%)'),
                'tc': data.get('t°c'),
                'ph': data.get('ph'),
                'ce': data.get('ce'),
                'tds': data.get('tds'),
                'salinity': data.get('salinidad'),
                'orp': data.get('ORP'),
                'date': data.get('fecha'),
                'hour': data.get('hora'),
                'observation': data.get('observaciones'),
            }
            parameters = Parameters.objects.create(**defaults)
            created_parameters.append(parameters)
        
        serializer = ParametersSerializer(created_parameters, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        message = {'detail': f'Error al registrar los datos: {str(e)}'}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    