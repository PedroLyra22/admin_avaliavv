document.getElementById('goToCadastro').addEventListener('click', () => {
    window.location.href = 'cadastro.html';
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:5000/admin/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ login, senha })
        });

        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin_area.html';
        } else {
            const errorData = await response.json();
            alert('Erro: ' + errorData.erro);
        }
    } catch (error) {
        alert('Erro na conexão com o servidor.');
    }
});