from django import forms
from .models import Noticia

class NoticiaForm(forms.ModelForm):
    class Meta:
        model = Noticia
        fields = ['titulo', 'resumo', 'latitude', 'longitude', 'imagem', 'link', 'icone', 'data', 'duracao']
        widgets = {
            'data': forms.DateTimeInput(attrs={
                'type': 'datetime-local',  # Adiciona campo de data e hora
                'placeholder': 'Selecione a data e hora',
                'class': 'form-control'
            }),
            'duracao': forms.NumberInput(attrs={
                'placeholder': 'Duração em dias',
                'class': 'form-control',
                'min': 1
            }),
            'titulo': forms.TextInput(attrs={
                'placeholder': 'Título da notícia',
                'class': 'form-control'
            }),
            'resumo': forms.Textarea(attrs={
                'placeholder': 'Resumo da notícia',
                'class': 'form-control',
                'rows': 3
            }),
            'latitude': forms.NumberInput(attrs={
                'placeholder': 'Latitude',
                'class': 'form-control'
            }),
            'longitude': forms.NumberInput(attrs={
                'placeholder': 'Longitude',
                'class': 'form-control'
            }),
            'icone': forms.Select(attrs={
                'class': 'form-control'
            }),
            'link': forms.URLInput(attrs={
                'placeholder': 'https://www.exemplo.com.br',
                'class': 'form-control'
            }),
        }
