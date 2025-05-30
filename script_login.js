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
            const data = await response.json();
            alert('Login realizado com sucesso!');
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('admin_user_id', data.id);
            localStorage.setItem('admin_user_name', data.name);

            window.location.href = 'admin_area.html';
        } else {
            const errorData = await response.json();
            alert('Erro: ' + errorData.erro);
        }
    } catch (error) {
        alert('Erro na conexão com o servidor.');
    }
});