# Generated by Django 5.1.2 on 2024-11-21 00:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GeoFeed', '0010_remove_noticia_duracao_noticia_duracao_visibilidade'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='noticia',
            name='duracao_visibilidade',
        ),
    ]
