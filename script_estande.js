const adminId = localStorage.getItem('admin_user_id');
const isLoggedIn = localStorage.getItem('adminLoggedIn');

if (!adminId || !isLoggedIn) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
}

document.getElementById('estande-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const estande = {
        nome: document.getElementById('nome').value,
        tema: document.getElementById('tema').value,
        imagem: document.getElementById('imagem').value,
        descricao: document.getElementById('descricao').value,
        evento_id: parseInt(document.getElementById('evento_id').value),
        admin_user_id: parseInt(adminId)
    };

    try {
        const response = await fetch('http://localhost:5000/estande', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estande)
        });

        if (response.ok) {
            alert('Estande cadastrado com sucesso!');
            this.reset();
            carregarEstandes();
        } else {
            alert('Erro ao cadastrar estande.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar estande:', error);
        alert('Erro ao cadastrar estande.');
    }
});

async function carregarEstandes() {
    try {
        const response = await fetch(`http://localhost:5000/estande?admin_user_id=${adminId}`);
        const estandes = await response.json();
        const lista = document.getElementById('estandes-lista');
        lista.innerHTML = '';

        if (Array.isArray(estandes) && estandes.length > 0) {
            estandes.forEach(estande => {
                const div = document.createElement('div');
                div.classList.add('estande');

                const imagemHTML = estande.imagem ? `<img src="${estande.imagem}" alt="Imagem do estande ${estande.nome}" />` : '';

                div.innerHTML = `
                    ${imagemHTML}
                    <div class="estande-conteudo">
                        <h3>${estande.nome}</h3>
                        <p><strong>Tema:</strong> ${estande.tema}</p>
                        <p><strong>Descrição:</strong> ${estande.descricao}</p>
                        <p><strong>ID do Evento:</strong> ${estande.evento_id}</p>
                        <button class="btn-excluir" onclick="deletarEstande(${estande.id})">Excluir</button>
                    </div>
                `;

                lista.appendChild(div);
            });
        }
    } catch (error) {
        console.log(error)
    }
}

async function deletarEstande(id) {
    if (!confirm('Tem certeza que deseja excluir este estande?')) return;

    try {
        const response = await fetch(`http://localhost:5000/estande/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_user_id: adminId })
        });

        if (response.ok) {
            alert('Estande excluído com sucesso!');
            carregarEstandes();
        } else {
            const erro = await response.json();
            alert(`Erro ao excluir estande: ${erro.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao excluir estande:', error);
        alert('Erro ao excluir estande.');
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

carregarEstandes();
