# Generated by Django 5.1.1 on 2024-09-03 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('google', '0006_rename_name_footballclubs_titulo_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='footballclubs',
            name='resumo',
            field=models.TextField(null=True),
        ),
    ]
