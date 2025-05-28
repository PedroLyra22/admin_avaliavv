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
        const response = await fetch(`${baseUrlBackend}/estande`, {
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

function baixarQRCode(url) {
    const qrcodeContainer = document.createElement('div');
    const qr = new QRCode(qrcodeContainer, {
        text: url,
        width: 256,
        height: 256
    });

    setTimeout(() => {
        const img = qrcodeContainer.querySelector('img');
        if (img) {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'qrcode.png';
            link.click();
        }
    }, 300);
}


async function carregarEstandes() {
    try {
        const baseUrlBackend = localStorage.getItem('baseUrlBackend');
        const response = await fetch(`${baseUrlBackend}/estande?admin_user_id=${adminId}`);
        const estandes = await response.json();
        const lista = document.getElementById('estandes-lista');
        lista.innerHTML = '';

        if (Array.isArray(estandes) && estandes.length > 0) {
            estandes.forEach(estande => {
                const div = document.createElement('div');
                div.classList.add('estande');
                const baseUrlFront = localStorage.getItem('baseUrlFront');

                const imagemHTML = estande.imagem
                    ? `<img src="${estande.imagem}" alt="Imagem do estande ${estande.nome}" />`
                    : '<img src="default.jpeg" alt="Imagem padrão do estande" />';

                div.innerHTML = `
                    ${imagemHTML}
                    <div class="estande-conteudo">
                        <h3>${estande.nome}</h3>
                        <p><strong>Tema:</strong> ${estande.tema}</p>
                        <p><strong>Descrição:</strong> ${estande.descricao}</p>
                        <p><strong>ID do Evento:</strong> ${estande.evento_id}</p>
                        <div class="botoes-acoes">
                            <button class="btn-excluir" onclick="deletarEstande(${estande.id})">Excluir</button>
                            <button class="btn-qrcode" onclick="baixarQRCode('${baseUrlFront}/avalia_estande.html?estande_id=${estande.id}', '${estande.nome}')">Baixar QR Code</button>
                        </div>
                        <button class="btn-feedback" onclick="window.location.href='${baseUrlFront}/feed_back_estande.html?estande_id=${estande.id}'">Ver Feedback</button>
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
        const baseUrlBackend = localStorage.getItem('baseUrlBackend');
        const response = await fetch(`${baseUrlBackend}/estande/${id}`, {
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
