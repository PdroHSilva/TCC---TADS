# Generated by Django 5.1.2 on 2024-11-20 20:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GeoFeed', '0004_noticia_duracao_alter_noticia_icone'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='noticia',
            options={'ordering': ['-data'], 'verbose_name': 'Notícia', 'verbose_name_plural': 'Notícias'},
        ),
        migrations.AlterField(
            model_name='noticia',
            name='data',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]