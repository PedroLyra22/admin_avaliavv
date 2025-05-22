const API = 'http://127.0.0.1:5000';

const estandeForm = document.getElementById('estandeForm');
const listaEstandes = document.getElementById('listaEstandes');

estandeForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(estandeForm));
    const res = await fetch(`${API}/estande`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        estandeForm.reset();
        loadEstandes();
    }
});

async function loadEstandes() {
    const res = await fetch(`${API}/estande`);
    const estandes = await res.json();
    listaEstandes.innerHTML = '';
    estandes.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.nome} - ${e.tema}`;
        const del = document.createElement('button');
        del.textContent = 'Excluir';
        del.onclick = async () => {
            await fetch(`${API}/estande/${e.id}`, { method: 'DELETE' });
            loadEstandes();
        };
        li.appendChild(del);
        listaEstandes.appendChild(li);
    });
}
loadEstandes();
