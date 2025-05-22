const API = 'http://127.0.0.1:5000';

const enderecoForm = document.getElementById('enderecoForm');
const enderecoMsg = document.getElementById('enderecoMensagem');
const campoEnderecoId = document.querySelector('input[name="endereco_id"]');

enderecoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(enderecoForm));

    try {
        const res = await fetch(`${API}/endereco`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Erro ao cadastrar endereço");

        const listaRes = await fetch(`${API}/endereco`);
        const todos = await listaRes.json();
        const ultimo = todos[todos.length - 1];

        campoEnderecoId.value = ultimo.id;
        enderecoMsg.textContent = `Endereço cadastrado! ID: ${ultimo.id}`;
        enderecoForm.reset();
    } catch (error) {
        enderecoMsg.textContent = 'Erro ao cadastrar endereço.';
        console.error(error);
    }
});

const eventoForm = document.getElementById('eventoForm');
const listaEventos = document.getElementById('listaEventos');

eventoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(eventoForm));

    try {
        const res = await fetch(`${API}/evento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Erro ao cadastrar evento");

        eventoForm.reset();
        campoEnderecoId.value = "";
        loadEventos();
    } catch (error) {
        console.error("Erro ao cadastrar evento:", error);
    }
});

async function loadEventos() {
    try {
        const res = await fetch(`${API}/evento`);
        const eventos = await res.json();

        listaEventos.innerHTML = '';
        eventos.forEach((e) => {
            const li = document.createElement('li');
            li.textContent = `${e.nome} (${e.data_inicial} - ${e.data_final}) - Endereço ID: ${e.endereco_id}`;

            const del = document.createElement('button');
            del.textContent = 'Excluir';
            del.onclick = async () => {
                await fetch(`${API}/evento/${e.id}`, { method: 'DELETE' });
                loadEventos();
            };

            li.appendChild(del);
            listaEventos.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

loadEventos();
