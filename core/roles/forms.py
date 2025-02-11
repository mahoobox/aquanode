from django import forms
from django.core import validators


class RoleValidator(forms.Form):
    """
        Role validator

    """
    name = forms.CharField(
        max_length=50,
        validators=[
            validators.RegexValidator(
                regex=r'^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$',
                code='invalid_name'
            )
        ])
