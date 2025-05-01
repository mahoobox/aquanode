import firebase_admin
from firebase_admin import credentials, messaging

# Inicializar Firebase (solo una vez en tu aplicación)
cred = credentials.Certificate("C:/Users/Davide/Documents/Proyectos Python/aquanode/aquanode/aquanodecore/service-account.json")
firebase_admin.initialize_app(cred)


def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,  # Token FCM del dispositivo destino
    )
    
    try:
        response = messaging.send(message)
        print("Notificación enviada:", response)
    except Exception as e:
        print("Error al enviar:", e)