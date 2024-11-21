from django.db import models
from django.utils.timezone import now
from datetime import timedelta, datetime


class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    resumo = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    imagem = models.ImageField(upload_to='imagens/', null=True, blank=True)
    link = models.URLField(max_length=200)
    icone = models.CharField(max_length=100, default='locationIcon')
    data = models.DateTimeField(null=True)  # Data com hora para precisão
    duracao = models.PositiveIntegerField(default=1)  # Duração em dias
    data_adicionado = models.DateTimeField(default=now)  # Quando a notícia foi criada

    def esta_visivel_em(self, data_consulta):
        """
        Verifica se a notícia está visível em uma data específica, considerando apenas a parte da data.
        """
        if self.data:
            # Trabalhar com objetos `datetime.date` diretamente
            data_inicio = self.data.date() if isinstance(self.data, datetime) else self.data
            data_final = data_inicio + timedelta(days=self.duracao - 1)
            return data_inicio <= data_consulta <= data_final
        return False

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Notícia"
        verbose_name_plural = "Notícias"
        ordering = ['-data_adicionado']
