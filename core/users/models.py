from django.db import models # type: ignore
from core.roles.models import Role
from django.forms import model_to_dict  # type: ignore
from django.contrib.auth.models import ( # type: ignore
    AbstractBaseUser, PermissionsMixin, UserManager
)

# Create your models here.


class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Se requiere un email')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)

        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email=None, password=None, **extra_fields):
        """Crea y devuelve un superusuario con el email y la contraseña dados."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # Asegúrate de que el superusuario tenga al menos un email
        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField('name', max_length=100, null=False)
    last_name = models.CharField(
        'last_name', max_length=100, null=False)
    email = models.EmailField('email', unique=True, null=False)
    password = models.CharField(
        'password', max_length=100, null=False)
    fcm_token = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.ImageField('avatar', default='avatar.png')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField('created_at', auto_now_add=True)
    updated_at = models.DateTimeField('updated_at', auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['id']

