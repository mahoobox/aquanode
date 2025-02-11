from django import forms
from django.core import validators


class UserValidator(forms.Form):
    name = forms.CharField(
        max_length=100,
        validators=[
            validators.RegexValidator(
                regex=r'^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$',
                code='invalid_name'
            )
        ])
    last_name = forms.CharField(
        max_length=100,
        validators=[
            validators.RegexValidator(
                regex=r'^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$',
                code='invalid_last_name'
            )
        ])
    email = forms.EmailField(
        max_length=100,
        validators=[
            validators.EmailValidator(
                code='invalid_email'
            )
        ])