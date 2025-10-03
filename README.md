# AquaNode - Sistema Inteligente de Monitoreo Acuícola

![AquaNode](https://via.placeholder.com/1200x300.png?text=AquaNode+Project)

AquaNode es una plataforma integral para el monitoreo y diagnóstico inteligente de parámetros de calidad del agua en entornos acuícolas. Combina un backend robusto construido con Django y un frontend moderno y reactivo con React.

## Características Principales

*   **Dashboard Interactivo:** Visualización en tiempo real de los parámetros del agua.
*   **Gestión de Usuarios y Roles:** Sistema de permisos granular para Super Administradores, Administradores y Operarios.
*   **Diagnóstico de Eventos:** Registro y análisis de eventos con capacidad de almacenar evidencia en video.
*   **Importación de Datos:** Tarea asíncrona para importar mediciones de calidad del agua desde archivos Excel alojados en Google Drive.
*   **Notificaciones:** Integración con Firebase Cloud Messaging (FCM) para enviar notificaciones a los usuarios.
*   **API RESTful:** Backend expuesto a través de una API segura con autenticación JWT.

## Stack Tecnológico

### Backend
*   **Framework:** Django
*   **API:** Django REST Framework
*   **Tareas Asíncronas:** Celery con Redis/RabbitMQ
*   **Autenticación:** Simple JWT
*   **Base de Datos:** PostgreSQL (recomendado)
*   **Análisis de Datos:** Pandas, NumPy

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Lenguaje:** TypeScript
*   **UI:** Tailwind CSS, Material-Tailwind
*   **Gestión de Estado:** Zustand
*   **Data Fetching:** TanStack Query (React Query)
*   **Formularios:** React Hook Form
*   **Gráficos:** Chart.js, Recharts

## Prerrequisitos

*   Python 3.8+
*   Node.js 18+ y npm/yarn
*   PostgreSQL (o la base de datos de tu elección)
*   Redis o RabbitMQ (para Celery)
*   Una cuenta de Google con acceso a la API de Google Drive y un Service Account.

## Instalación

Sigue estos pasos para configurar el entorno de desarrollo local.

### 1. Backend (Django)

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/aquanode.git
cd aquanode

# 2. Crea y activa un entorno virtual
python -m venv venv
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# 3. Instala las dependencias de Python
pip install -r requirements.txt

# 4. Configura las variables de entorno
# Crea un archivo .env en la raíz del proyecto y añade las siguientes variables:
# SECRET_KEY=tu_clave_secreta
# DEBUG=True
# DATABASE_URL=postgres://user:password@host:port/dbname
# CELERY_BROKER_URL=redis://localhost:6379/0
# GOOGLE_DRIVE_FOLDER_ID=tu_id_de_carpeta_de_google_drive
# BACKEND_URL_BASE=http://127.0.0.1:8000

# 5. Coloca el archivo service-account.json de Google en la raíz del proyecto.

# 6. Aplica las migraciones de la base de datos
python manage.py migrate

# 7. Crea un superusuario
python manage.py createsuperuser
```

### 2. Frontend (React)

```bash
# 1. Navega a la carpeta del frontend
cd aquanode/frontend

# 2. Instala las dependencias de Node.js
npm install
```

## Ejecución

Necesitarás 4 terminales separadas para ejecutar todos los servicios.

1.  **Ejecutar el Backend de Django:**
    ```bash
    # Desde la raíz del proyecto (aquanode/)
    python manage.py runserver
    ```

2.  **Ejecutar el Frontend de React:**
    ```bash
    # Desde la carpeta aquanode/frontend/
    npm run dev
    ```

3.  **Ejecutar el Broker de Celery (ej. Redis):**
    Asegúrate de que tu servidor Redis esté en ejecución.

4.  **Ejecutar el Worker de Celery:**
    ```bash
    # Desde la raíz del proyecto (aquanode/)
    celery -A aquanode worker -l info
    ```

Ahora puedes acceder a la aplicación en `http://localhost:5173` (o el puerto que Vite te indique).

## Comandos de Gestión

### Eliminar Videos Antiguos
Puedes disparar la tarea de Celery para eliminar videos con más de 30 días de antigüedad.
```bash
python manage.py delete_old_videos
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un *issue* para discutir cambios importantes antes de realizar un *pull request*.