document.addEventListener('DOMContentLoaded', function () {
    // Inicializa o mapa
    var map = L.map('mapa').setView([-20.789, -51.700], 15); // Três Lagoas-MS
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Camada para gerenciar marcadores
    var markersLayer = L.layerGroup().addTo(map);

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
        var marker = L.marker([latitude, longitude], { icon: icon }).addTo(markersLayer);
        marker.bindPopup(`<strong>${titulo}</strong><br>${resumo}`);
    }

    // Limpar todos os marcadores
    function limparMarcadores() {
        markersLayer.clearLayers();
    }

    // Carregar marcadores filtrados
    function carregarMarcadoresFiltrados(mes, dia) {
        fetch(`/get_markers/?mes=${mes}&dia=${dia}`)
            .then((response) => response.json())
            .then((data) => {
                limparMarcadores();
                console.log("Dados recebidos do servidor:", data);
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
            })
            .catch((error) => console.error('Erro ao carregar marcadores filtrados:', error));
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
                    console.log("Resposta do servidor após adicionar notícia:", data);
                    if (!data.error) {
                        const hoje = new Date();
                        const dia = String(hoje.getDate()).padStart(2, '0');
                        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
                        adicionarMarcador(data.latitude, data.longitude, data.titulo, data.resumo, data.icone);
                        form.reset();
                        formSection.style.display = 'none';
                        map.getContainer().classList.remove('blur-background');
                        carregarMarcadoresFiltrados(mes, dia); // Atualiza o mapa para o dia atual
                    } else {
                        alert('Erro ao enviar a notícia: ' + data.error);
                    }
                })
                .catch((error) => console.error('Erro ao enviar notícia:', error));
        });
    }

    // Carregar últimas notícias no drawer
    const drawer = document.getElementById('drawer');
    const newsHistory = document.getElementById('news-history');
    function carregarUltimasNoticias() {
        fetch('/get_markers/')
            .then((response) => response.json())
            .then((data) => {
                newsHistory.innerHTML = '';
                data.forEach((noticia) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>${noticia.titulo}</strong>
                        <p>${noticia.resumo}</p>
                        <small>Adicionado em: ${new Date(noticia.data_adicionado).toLocaleString()}<br>Duração: ${noticia.duracao} dias</small>
                    `;
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

    // Filtro por data no drawer
    const filterNewsButton = document.getElementById('filter-news-button');
    if (filterNewsButton && datepicker) {
        filterNewsButton.addEventListener('click', () => {
            const selectedDate = datepicker.value;
            if (selectedDate) {
                const [year, month, day] = selectedDate.split('-');
                carregarMarcadoresFiltrados(month, day);
                drawer.classList.remove('open');
            } else {
                alert('Selecione uma data!');
            }
        });
    }
});
