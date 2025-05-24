const isLoggedIn = localStorage.getItem('adminLoggedIn');
if (!isLoggedIn) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('admin_user_id');
    localStorage.removeItem('admin_user_name');
    window.location.href = 'login.html';
});