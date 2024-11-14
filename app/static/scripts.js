document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o mapa
    var map = L.map('mapa').setView([-20.789, -51.700], 15);  // Três Lagoas-MS
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Camada para gerenciar marcadores
    var markersLayer = L.layerGroup().addTo(map);

    // Função para adicionar marcadores
    function adicionarMarcador(latitude, longitude, titulo, resumo, iconName) {
        console.log('Adicionando marcador:', latitude, longitude);
        console.log('Icone recebido:', iconName);
        var icon = icone[iconName] ? icone[iconName] : locationIcon;

        if (!icon) {
            console.error('Ícone não definido para:', iconName);
            return;
        }

        var marker = L.marker([latitude, longitude],{icon: icon}).addTo(markersLayer);
        marker.bindPopup('<strong>' + titulo + '</strong><br>' + resumo);
    }
    // Defina diferentes ícones para usar no mapa
    var carIcon = L.icon({
        iconUrl: '/static/imgs/icon1.png',
        iconSize: [35, 50],
        iconAnchor: [22, 44],
        popupAnchor: [-3, -76]
    });

    var theaterIcon = L.icon({
        iconUrl: '/static/imgs/icon2.png',
        iconSize: [35, 50],
        iconAnchor: [22, 44],
        popupAnchor: [-3, -76]
    });

    var homeIcon = L.icon({
        iconUrl: 'static/imgs/icon4.png',
        iconSize: [35, 50],
        iconAnchor: [22, 44],
        popupAnchor: [-3, -76]
    });
    
    var locationIcon = L.icon({
        iconUrl: 'static/imgs/icon3.png',
        iconSize: [35, 50],
        iconAnchor: [22, 44],
        popupAnchor: [-3, -76]
    })    
   

    // Mapeamento de nome de ícone para o objeto L.Icon correspondente
    var icone = {
        "carIcon": carIcon,
        "theaterIcon": theaterIcon,
        "homeIcon": homeIcon,
        "locationIcon": locationIcon
    };

    // Função para limpar todos os marcadores
    function limparMarcadores() {
        markersLayer.clearLayers();
    }

    // Função para carregar e adicionar os marcadores filtrados por mês e dia
    function carregarMarcadoresFiltrados(mes, dia) {
        fetch(`/get_markers/?mes=${mes}&dia=${dia}`)
            .then(response => response.json())
            .then(data => {
                limparMarcadores();
                data.forEach(noticia => {
                    if (!isNaN(noticia.latitude) && !isNaN(noticia.longitude)) {
                        adicionarMarcador(noticia.latitude, noticia.longitude, noticia.titulo, noticia.resumo, noticia.icone);
                    } else {
                        console.error('Coordenadas inválidas:', noticia.latitude, noticia.longitude);
                    }
                });
            })
            .catch(error => console.error('Erro ao carregar marcadores filtrados:', error));
    }

    // Alternar visibilidade do formulário
    const toggleNewsButton = document.getElementById('toggle-news');
    const formSection = document.getElementById('form-section');
    if (toggleNewsButton && formSection) {
        formSection.style.display = 'none'; // Ocultar o formulário inicialmente

        const closeButton = document.getElementById('close-form');

        function fecharFormulario() {
            formSection.style.display = 'none';
            map.getContainer().classList.remove('blur-background');
        }

        closeButton.addEventListener('click', fecharFormulario);

        toggleNewsButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (formSection.style.display === 'none' || formSection.style.display === '') {
                formSection.style.display = 'block'; // Exibir o formulário
                map.getContainer().classList.add('blur-background'); // Adicionar desfoque ao mapa
            } else {
                formSection.style.display = 'none'; // Ocultar o formulário
                map.getContainer().classList.remove('blur-background'); // Remover o desfoque do mapa
            }
        });
    } else {
        console.error("Botão 'toggle-news' ou seção 'form-section' não encontrado.");
    }

    // Função para atualizar o seletor de dias com base no mês selecionado
    const mesSeletor = document.getElementById('mes-seletor');
    const diaSeletor = document.getElementById('dia-seletor');

    function atualizarSelecaoDia() {
        const mesSelecionado = parseInt(mesSeletor.value, 10);

        diaSeletor.innerHTML = '<option value="">Selecione o dia</option>';
        diaSeletor.disabled = false;

        let diasNoMes;
        switch (mesSelecionado) {
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                diasNoMes = 31;
                break;
            case 4: case 6: case 9: case 11:
                diasNoMes = 30;
                break;
            case 2:
                diasNoMes = 29;
                break;
            default:
                diasNoMes = 0;
                console.error("Mês selecionado inválido:", mesSelecionado);
        }

        for (let i = 1; i <= diasNoMes; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            diaSeletor.appendChild(option);
        }
    }

    if (mesSeletor && diaSeletor) {
        mesSeletor.addEventListener('change', function() {
            atualizarSelecaoDia();
            if (mesSeletor.value && diaSeletor.value) {
                carregarMarcadoresFiltrados(mesSeletor.value, diaSeletor.value);
            }
        });

        diaSeletor.addEventListener('change', function() {
            if (mesSeletor.value && diaSeletor.value) {
                carregarMarcadoresFiltrados(mesSeletor.value, diaSeletor.value);
            }
        });
    } else {
        console.error("Seletores de mês ou dia não encontrados.");
    }

    // Submissão do formulário de notícias via AJAX
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            

            const icone = document.querySelector('input[name="icone"]:checked').value;

            fetch("/adicionar_noticia/", {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    adicionarMarcador(data.latitude, data.longitude, data.titulo, data.resumo, data.icone);
                    form.reset();
                    formSection.style.display = 'none';
                    map.getContainer().classList.remove('blur-background');
                } else {
                    alert('Erro ao enviar a notícia');
                }
            })
            .catch(error => console.error('Erro ao enviar notícia:', error));
        });
    } else {
        console.error("Formulário de notícias não encontrado.");
    }
});
