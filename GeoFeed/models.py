from django.db import models

class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    resumo = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    imagem = models.ImageField(upload_to='imagens/', null=True, blank=True)
    link = models.URLField(max_length=200)
    icone = models.CharField(max_length=100, default='locationIcon')
    data = models.DateField(null=True)

    def __str__(self):
        return self.titulo

