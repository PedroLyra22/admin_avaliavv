function criarEstrelas(nota) {
    const maxEstrelas = 5;
    let estrelasHtml = '';
    const arredondada = Math.round(nota);
    for (let i = 1; i <= maxEstrelas; i++) {
        if (i <= arredondada) {
            estrelasHtml += '<span class="star">&#9733;</span>';
        } else {
            estrelasHtml += '<span class="star empty">&#9733;</span>';
        }
    }
    return estrelasHtml;
}

function getEstandeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('estande_id');
}

async function carregarFeedback(estandeId) {
    if (!estandeId) {
        document.getElementById('message').textContent = 'ID do estande não especificado na URL.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/feed_back_estande/${estandeId}`);

        if (!response.ok) {
            const data = await response.json();
            document.getElementById('message').textContent = data.message || 'Erro ao carregar dados do Estande.';
            return;
        }

        const dados = await response.json();

        const tabela = document.getElementById('feedback-table');
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';

        const aspectos = [
            { label: 'Apresentação', key: 'media_apresentacao' },
            { label: 'Idéia', key: 'media_nota_ideia' },
            { label: 'Experiência', key: 'media_nota_experiencia' }
        ];

        aspectos.forEach(({label, key}) => {
            const media = Number(dados[key]);
            const tr = document.createElement('tr');

            const tdAspecto = document.createElement('td');
            tdAspecto.textContent = label;

            const tdMedia = document.createElement('td');
            tdMedia.textContent = media !== null ? media.toFixed(2) : 'N/A';

            const tdEstrelas = document.createElement('td');
            tdEstrelas.innerHTML = media !== null ? criarEstrelas(media) : '—';

            tr.appendChild(tdAspecto);
            tr.appendChild(tdMedia);
            tr.appendChild(tdEstrelas);

            tbody.appendChild(tr);
        });

        tabela.style.display = 'table';
        document.getElementById('message').textContent = '';

    } catch (error) {
        document.getElementById('message').textContent = 'Erro ao conectar com o servidor.';
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const estandeId = getEstandeId();

    carregarFeedback(estandeId);
});
