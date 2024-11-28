from django.contrib import admin
from django.urls import path
from GeoFeed import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls),
    path('adicionar_noticia/', views.adicionar_noticia, name='adicionar_noticia'),
    path('get_markers/', views.get_markers, name='get_markers'),
    path('contato/', views.contato, name='contato'),
    path('get_noticias_intervalo/', views.get_noticias_intervalo, name='get_noticias_intervalo'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)