# Generated by Django 5.1.2 on 2024-11-21 01:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GeoFeed', '0015_alter_noticia_duracao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='noticia',
            name='duracao',
            field=models.PositiveIntegerField(default=30),
        ),
    ]
