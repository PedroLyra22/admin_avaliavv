const isLoggedIn = localStorage.getItem('adminLoggedIn');

function setConfig(){
    const mainIp = '10.0.1.132'
    const portBackendApi = 5000
    const baseUrlFront = `http://${mainIp}/notalise`
    const baseUrlBackend = `http://${mainIp}:${portBackendApi}`

    localStorage.setItem('baseUrlFront', baseUrlFront);
    localStorage.setItem('baseUrlBackend', baseUrlBackend);
}

setConfig();

if (!isLoggedIn) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
} else {
    window.location.href = 'admin_area.html';
}



