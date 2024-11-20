from django.shortcuts import render, redirect
from .models import Noticia
from .forms import NoticiaForm
from django.http import JsonResponse
from datetime import datetime

# Create your views here.
def index(request):
    form = NoticiaForm()
    return render(request, 'index.html', {'form': form})

# Função para salvar a notícia no banco de dados via AJAX
def adicionar_noticia(request):
    if request.method == 'POST':
        form = NoticiaForm(request.POST, request.FILES)
        if form.is_valid():
            noticia = form.save()  # Salva a notícia no banco de dados
            # Retorna os dados da nova notícia para o frontend
            return JsonResponse({
                'latitude': noticia.latitude,
                'longitude': noticia.longitude,
                'titulo': noticia.titulo,
                'resumo': noticia.resumo,
                'icone' : noticia.icone,          
            })
    return JsonResponse({'error': 'Formulário inválido'}, status=400)

# Função para retornar os markers (LAT, LONG) em formato JSON
def get_markers(request):
    noticias = Noticia.objects.all().order_by('-data').values('latitude', 'longitude', 'titulo', 'resumo')
    return JsonResponse(list(noticias), safe=False)

def get_markers(request):
    # Recebe o mês e o dia passados como parâmetros GET
    mes = request.GET.get('mes')
    dia = request.GET.get('dia')
    
    # Filtra notícias por data, se mês e dia forem fornecidos
    if mes and dia:
        try:
            data_selecionada = datetime(year=2024, month=int(mes), day=int(dia))
            noticias = Noticia.objects.filter(data=data_selecionada).values('latitude', 'longitude', 'titulo', 'resumo', 'icone')
        except ValueError:
            return JsonResponse({'error': 'Data inválida'}, status=400)
    else:
        noticias = Noticia.objects.all().values('latitude', 'longitude', 'titulo', 'resumo')
    
    return JsonResponse(list(noticias), safe=False)

