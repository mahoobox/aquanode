from django.core.management.base import BaseCommand
from .tasks import delete_old_videos_task

class Command(BaseCommand):
    help = 'Dispara la tarea de Celery para eliminar videos antiguos.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Disparando la tarea de eliminación de videos antiguos..."))
        result = delete_old_videos_task.delay()
        self.stdout.write(self.style.SUCCESS(f"La tarea ha sido encolada con el ID: {result.id}"))
