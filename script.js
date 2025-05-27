const isLoggedIn = localStorage.getItem('adminLoggedIn');
if (!isLoggedIn) {
    alert('Você precisa estar logado para acessar esta página.');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('admin_user_id');
    localStorage.removeItem('admin_user_name');
    window.location.href = 'login.html';
} else {
    window.location.href = 'admin_area.html';
}