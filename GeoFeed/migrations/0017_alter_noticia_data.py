# Generated by Django 5.1.2 on 2024-11-21 02:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GeoFeed', '0016_alter_noticia_duracao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='noticia',
            name='data',
            field=models.DateTimeField(null=True),
        ),
    ]