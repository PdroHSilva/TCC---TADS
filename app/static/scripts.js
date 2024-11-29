document.addEventListener('DOMContentLoaded', function () {
    // Inicializa o mapa
    var map = L.map('mapa').setView([-20.789, -51.700], 15); // Três Lagoas-MS
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Camada para gerenciar marcadores
    var markersCluster = L.markerClusterGroup(); // Cria o grupo de clusters

    // Adicione o cluster ao mapa
    map.addLayer(markersCluster);

    // Armazena os marcadores adicionados no mapa
    var markerMap = new Map();

    // Mapeamento de ícones
    var icone = {
        carIcon: L.icon({
            iconUrl: '/static/imgs/icon1.png',
            iconSize: [35, 50],
            iconAnchor: [22, 44],
            popupAnchor: [-3, -76],
        }),
        theaterIcon: L.icon({
            iconUrl: '/static/imgs/icon2.png',
            iconSize: [35, 50],
            iconAnchor: [22, 44],
            popupAnchor: [-3, -76],
        }),
        homeIcon: L.icon({
            iconUrl: '/static/imgs/icon4.png',
            iconSize: [35, 50],
            iconAnchor: [22, 44],
            popupAnchor: [-3, -76],
        }),
        locationIcon: L.icon({
            iconUrl: '/static/imgs/icon3.png',
            iconSize: [35, 50],
            iconAnchor: [22, 44],
            popupAnchor: [-3, -76],
        }),
    };

    // Adicionar marcador ao mapa
    function adicionarMarcador(latitude, longitude, titulo, resumo, iconName) {
        var icon = icone[iconName] || icone.locationIcon;
    
        // Crie o marcador
        var marker = L.marker([latitude, longitude], { icon: icon });
        marker.bindPopup(`<strong>${titulo}</strong><br>${resumo}`);
    
        // Adicione o marcador ao cluster
        markersCluster.addLayer(marker);
    
        // Salve o marcador no Map para referências futuras
        markerMap.set(titulo, marker);
    }

    // Limpar todos os marcadores
    function limparMarcadores() {
        markersCluster.clearLayers(); // Limpa os clusters
        markerMap.clear(); // Limpa o mapa de marcadores rastreados
    }

    // Carregar marcadores filtrados
    function carregarMarcadoresFiltrados(mes, dia) {
        return new Promise((resolve, reject) => {
            fetch(`/get_markers/?mes=${mes}&dia=${dia}`)
                .then((response) => response.json())
                .then((data) => {
                    limparMarcadores(); // Limpa os marcadores existentes
                    data.forEach((noticia) => {
                        if (!isNaN(noticia.latitude) && !isNaN(noticia.longitude)) {
                            adicionarMarcador(
                                noticia.latitude,
                                noticia.longitude,
                                noticia.titulo,
                                noticia.resumo,
                                noticia.icone
                            );
                        }
                    });
                    resolve(); // Marcadores carregados
                })
                .catch((error) => {
                    console.error('Erro ao carregar marcadores filtrados:', error);
                    reject(error); // Rejeita em caso de erro
                });
        });
    }
    // Configurar data atual no filtro
    const datepicker = document.getElementById('datepicker');
    function configurarDataAtual() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();

        if (datepicker) {
            datepicker.value = `${ano}-${mes}-${dia}`;
            carregarMarcadoresFiltrados(mes, dia);
        }
    }

    configurarDataAtual();

    // Alternar visibilidade do formulário
    const toggleNewsButton = document.getElementById('toggle-news');
    const formSection = document.getElementById('form-section');
    if (toggleNewsButton && formSection) {
        formSection.style.display = 'none';
        const closeButton = document.getElementById('close-form');

        toggleNewsButton.addEventListener('click', () => {
            formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
            map.getContainer().classList.toggle('blur-background');
        });

        closeButton.addEventListener('click', () => {
            formSection.style.display = 'none';
            map.getContainer().classList.remove('blur-background');
        });
    }

    // Enviar formulário de notícias via AJAX
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            // Certifica-se de que a data e hora estão sendo enviadas corretamente
            const dataField = form.querySelector('[name="data"]');
            if (!dataField.value) {
                alert('Por favor, insira uma data e hora válidas.');
                return;
            }

            fetch('/adicionar_noticia/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.error) {
                        const hoje = new Date();
                        const dia = String(hoje.getDate()).padStart(2, '0');
                        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                        adicionarMarcador(data.latitude, data.longitude, data.titulo, data.resumo, data.icone);
                        form.reset();
                        formSection.style.display = 'none';
                        map.getContainer().classList.remove('blur-background');
                        carregarMarcadoresFiltrados(mes, dia); // Atualiza o mapa para o dia atual
                        carregarUltimasNoticias(); // Atualiza o drawer após adicionar uma notícia
                    } else {
                        alert('Erro ao enviar a notícia: ' + data.error);
                    }
                })
                .catch((error) => console.error('Erro ao enviar notícia:', error));
        });
    }

    function getRelativeTime(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);
    
        // Conversão do tempo decorrido
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        const rtf = new Intl.RelativeTimeFormat('pt-br', { numeric: 'auto' });
    
        if (minutes < 60) {
            return rtf.format(-minutes, 'minute'); // Tempo em minutos
        } else if (hours < 24) {
            return rtf.format(-hours, 'hour'); // Tempo em horas
        } else {
            return rtf.format(-days, 'day'); // Tempo em dias
        }
    }

    // Carregar últimas notícias no drawer
    const drawer = document.getElementById('drawer');
    const newsHistory = document.getElementById('news-history');
    const refreshButton = document.getElementById('refresh-news');

    function carregarUltimasNoticias() {
        newsHistory.innerHTML = '<div class="loading-spinner"></div>'; // Adiciona o spinner de loading
        fetch('/get_noticias_intervalo/')
            .then((response) => response.json())
            .then((data) => {
                newsHistory.innerHTML = ''; // Remove o spinner de loading
                data.forEach((noticia) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                    <div class="news-item">
                        <div class="news-header">
                            <h3 class="news-title">${noticia.titulo}</h3>
                            <a href="${noticia.link}" target="_blank" class="news-source">Fonte</a>
                        </div>
                        <p class="news-summary">${noticia.resumo}</p>
                        ${noticia.imagem ? `<img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-image">` : ''}
                        <div class="news-meta">
                            <small>Adicionado ${getRelativeTime(noticia.data_adicionado)}</small><br>
                            <small>Duração: ${noticia.duracao} dias</small>
                        </div>
                    </div>
                    `;
                    
                    listItem.addEventListener('click', () => {
                        // Obter a data inicial da notícia e a duração
                        const [anoInicial, mesInicial, diaInicial] = noticia.data.split('T')[0].split('-');
                        const dataInicial = new Date(anoInicial, mesInicial - 1, diaInicial); // Converte para Date
                        const duracao = noticia.duracao; // Duração em dias
                    
                        // Obter a data atual selecionada no filtro
                        const dataSelecionada = new Date(datepicker.value);
                    
                        // Verifica se a data selecionada está no intervalo da notícia
                        const dataFinal = new Date(dataInicial);
                        dataFinal.setDate(dataInicial.getDate() + duracao - 1); // Adiciona a duração
                    
                        if (dataSelecionada >= dataInicial && dataSelecionada <= dataFinal) {
                            // A data selecionada está no intervalo da notícia
                            carregarMarcadoresFiltrados(
                                String(dataSelecionada.getMonth() + 1).padStart(2, '0'),
                                String(dataSelecionada.getDate()).padStart(2, '0')
                            )
                                .then(() => {
                                    const marker = markerMap.get(noticia.titulo); // Busca o marcador pelo título
                                    if (marker) {
                                        map.setView(marker.getLatLng(), 16, { animate: true }); // Centraliza no marcador
                                        marker.openPopup(); // Abre o popup do marcador
                                        drawer.classList.remove('open'); // Fecha o drawer
                                    } else {
                                        console.error(`Marcador não encontrado para a notícia: ${noticia.titulo}`);
                                    }
                                })
                                .catch((error) => console.error('Erro ao recarregar marcadores:', error));
                        } else {
                            // Se a data não está no intervalo, filtra para a data inicial da notícia
                            datepicker.value = `${anoInicial}-${mesInicial}-${diaInicial}`; // Atualiza o datepicker para a data inicial
                            carregarMarcadoresFiltrados(mesInicial, diaInicial)
                                .then(() => {
                                    const marker = markerMap.get(noticia.titulo); // Busca o marcador pelo título
                                    if (marker) {
                                        map.setView(marker.getLatLng(), 16, { animate: true }); // Centraliza no marcador
                                        marker.openPopup(); // Abre o popup do marcador
                                        drawer.classList.remove('open'); // Fecha o drawer
                                    } else {
                                        console.error(`Marcador não encontrado para a notícia: ${noticia.titulo}`);
                                    }
                                })
                                .catch((error) => console.error('Erro ao recarregar marcadores:', error));
                        }
                    });
                    
                    newsHistory.appendChild(listItem);
                });
            })
            .catch((error) => console.error('Erro ao carregar últimas notícias:', error));
    }
    

    const toggleDrawerButton = document.getElementById('toggle-drawer');
    const closeDrawerButton = document.getElementById('close-drawer');
    if (toggleDrawerButton && drawer) {
        toggleDrawerButton.addEventListener('click', () => {
            drawer.classList.add('open');
            carregarUltimasNoticias();
        });

        closeDrawerButton.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
    }

    // Botão de atualização no drawer
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            carregarUltimasNoticias();
        });
    }

    // Filtro por data no drawer
    const filterNewsButton = document.getElementById('filter-news-button');
    if (filterNewsButton && datepicker) {
        filterNewsButton.addEventListener('click', () => {
            const selectedDate = datepicker.value;
            if (selectedDate) {
                const [year, month, day] = selectedDate.split('-');
                recarregarMapaComFiltro(month, day); // Atualiza o mapa
                carregarNoticiasFiltradas(month, day); // Atualiza o drawer com as notícias filtradas
            } else {
                alert('Selecione uma data!');
            }
        });
    }

    

    function recarregarMapaComFiltro(mes, dia) {
        const mapaContainer = document.getElementById('mapa');
        mapaContainer.classList.add('loading');

        fetch(`/get_markers/?mes=${mes}&dia=${dia}`)
            .then((response) => response.json())
            .then((data) => {
                limparMarcadores();
                setTimeout(() => {
                    data.forEach((noticia) => {
                        if (!isNaN(noticia.latitude) && !isNaN(noticia.longitude)) {
                            adicionarMarcador(
                                noticia.latitude,
                                noticia.longitude,
                                noticia.titulo,
                                noticia.resumo,
                                noticia.icone
                            );
                        }
                    });
                    mapaContainer.classList.remove('loading');
                }, 1000);
            })
            .catch((error) => {
                console.error('Erro ao filtrar marcadores:', error);
                mapaContainer.classList.remove('loading');
            });
    }
});
