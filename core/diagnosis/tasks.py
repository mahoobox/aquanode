from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from .models import Events
import logging

logger = logging.getLogger(__name__)

@shared_task(name="core.diagnosis.tasks.delete_old_videos_task")
def delete_old_videos_task():
    one_month_ago = timezone.now() - timedelta(days=30)
    old_videos = Events.objects.filter(created_at__lt=one_month_ago).exclude(video_file='')

    if not old_videos.exists():
        logger.info("No se encontraron videos físicos antiguos para eliminar.")
        return "No se encontraron videos para eliminar."

    count = old_videos.count()
    logger.info(f"Se encontraron {count} videos físicos para eliminar...")

    for video in old_videos:
        if video.video_file:
            try:
                video.video_file.delete(save=False)
                logger.info(f"Archivo de video eliminado: {video.video_file.name} (ID de DB: {video.id})")
            except FileNotFoundError:
                logger.warning(f"Archivo no encontrado para eliminar (ID de DB: {video.id}, Ruta esperada: {video.video_file.path}). El registro de DB se mantiene.")
            except Exception as e:
                logger.error(f"Error al eliminar archivo de video (ID de DB: {video.id}, Ruta: {video.video_file.name}): {e}")
        else:
            logger.warning(f"El registro de video (ID: {video.id}) no tiene un archivo asociado en el campo 'video_file'. Se mantiene el registro.")

    return f"Proceso completado. Se eliminaron {count} videos."
