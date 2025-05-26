const adminId = localStorage.getItem('admin_user_id');
const isLoggedIn = localStorage.getItem('adminLoggedIn');

if (!adminId || !isLoggedIn) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
}

document.getElementById('evento-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const evento = {
        nome: document.getElementById('nome').value,
        data_inicial: document.getElementById('data_inicial').value,
        data_final: document.getElementById('data_final').value,
        imagem: document.getElementById('imagem').value,
        descricao: document.getElementById('descricao').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        admin_user_id: adminId
    };

    try {
        const response = await fetch('http://localhost:5000/evento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento)
        });

        if (response.ok) {
            alert('Evento cadastrado com sucesso!');
            this.reset();
            carregarEventos();
        } else {
            alert('Erro ao cadastrar evento.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar evento:', error);
        alert('Erro ao cadastrar evento.');
    }
});

function formatarData(dataIso) {
    const data = new Date(dataIso);
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
}

async function carregarEventos() {
    try {
        const response = await fetch(`http://localhost:5000/evento?admin_user_id=${adminId}`);
        const eventos = await response.json();
        const lista = document.getElementById('eventos-lista');
        lista.innerHTML = '';

        if (Array.isArray(eventos) && eventos.length > 0) {
            eventos.forEach(evento => {
                const div = document.createElement('div');
                div.classList.add('evento');

                const imagemHTML = evento.imagem
                    ? `<img src="${evento.imagem}" alt="Imagem do evento ${evento.nome}" />`
                    : '<img src="default.jpeg" alt="Imagem padrão do evento" />';


                div.innerHTML = `
							  ${imagemHTML}
							  <div class="evento-conteudo">
							    <h3>${evento.nome}</h3>
							    <p><strong>Período:</strong> ${formatarData(evento.data_inicial)} até ${formatarData(evento.data_final)}</p>
							    <p><strong>Endereço:</strong> ${evento.rua}, ${evento.numero} - ${evento.bairro}, ${evento.cidade}</p>
							    <p><strong>Descrição:</strong> ${evento.descricao}</p>
							    <button class="btn-excluir" onclick="deletarEvento(${evento.id})">Excluir</button>
							  </div>
							`;

                lista.appendChild(div);
            });
        } else {
            lista.innerHTML = '<p>Nenhum evento encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        alert('Erro ao carregar eventos.');
    }
}

async function deletarEvento(id) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
        const response = await fetch(`http://localhost:5000/evento/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_user_id: adminId })
        });

        if (response.ok) {
            alert('Evento excluído com sucesso!');
            carregarEventos();
        } else {
            const erro = await response.json();
            alert(`Erro ao excluir evento: ${erro.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        alert('Erro ao excluir evento.');
    }
}

function logout() {
    localStorage.removeItem('admin_user_id');
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

function voltarParaCadastro() {
    window.location.href = 'admin_area.html';
}

carregarEventos();
