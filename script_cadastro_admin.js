document.getElementById('goToLogin').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:5000/admin/cadastrar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ login, senha, email })
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            alert('Erro: ' + (errorData.message || 'Não foi possível cadastrar'));
        }
    } catch (error) {
        alert('Erro na conexão com o servidor.');
    }
});