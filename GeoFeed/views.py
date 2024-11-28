from django.shortcuts import render
from django.http import JsonResponse
from .models import Noticia
from .forms import NoticiaForm
from django.utils.timezone import now, make_aware, localtime
from datetime import datetime, timedelta


def index(request):
    form = NoticiaForm()
    return render(request, 'index.html', {'form': form})

def contato(request):
    return render(request, 'contato.html')

def adicionar_noticia(request):
    if request.method == 'POST':
        form = NoticiaForm(request.POST, request.FILES)
        if form.is_valid():
            noticia = form.save(commit=False)

            # Ajusta a data fornecida para incluir timezone, se necessário
            if noticia.data and not noticia.data.tzinfo:
                noticia.data = make_aware(noticia.data)

            noticia.save()
            return JsonResponse({
                'latitude': noticia.latitude,
                'longitude': noticia.longitude,
                'titulo': noticia.titulo,
                'resumo': noticia.resumo,
                'icone': noticia.icone,
                'data_adicionado': noticia.data_adicionado.isoformat(),
                'duracao': noticia.duracao,
            })
        else:
            return JsonResponse({'error': 'Formulário inválido', 'details': form.errors}, status=400)
    return JsonResponse({'error': 'Método inválido'}, status=405)


def get_markers(request):
    mes = request.GET.get('mes')
    dia = request.GET.get('dia')

    try:
        if mes and dia:
            data_selecionada = datetime(year=now().year, month=int(mes), day=int(dia)).date()
        else:
            data_selecionada = now().date()

        noticias_visiveis = []
        noticias = Noticia.objects.all()
        for noticia in noticias:
            if noticia.esta_visivel_em(data_selecionada):
                noticias_visiveis.append({
                    'latitude': noticia.latitude,
                    'longitude': noticia.longitude,
                    'titulo': noticia.titulo,
                    'resumo': noticia.resumo,
                    'icone': noticia.icone,
                    'data_adicionado': localtime(noticia.data_adicionado).isoformat(),
                    'duracao': noticia.duracao,
                })

        return JsonResponse(noticias_visiveis, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'Erro inesperado: {str(e)}'}, status=500)
    
def get_noticias_intervalo(request):
    try:
        inicio = datetime(2024, 1, 1)
        fim = datetime(2025, 12, 31)
        noticias = Noticia.objects.filter(data_adicionado__range=(inicio, fim))

        response_data = [
            {
                'latitude': noticia.latitude,
                'longitude': noticia.longitude,
                'titulo': noticia.titulo,
                'resumo': noticia.resumo,
                'imagem': noticia.imagem.url if noticia.imagem else None,
                'link': noticia.link,
                'icone': noticia.icone,
                'data_adicionado': localtime(noticia.data_adicionado).isoformat(),
                'duracao': noticia.duracao,
                'data': noticia.data,
            }
            for noticia in noticias
        ]

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'Erro ao buscar notícias: {str(e)}'}, status=500)
