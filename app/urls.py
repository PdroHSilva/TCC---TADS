from django.contrib import admin
from django.urls import path
from GeoFeed import views

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls),
    path('adicionar_noticia/', views.adicionar_noticia, name='adicionar_noticia'),
    path('get_markers/', views.get_markers, name='get_markers'),
    path('contato/', views.contato, name='contato'),
]
