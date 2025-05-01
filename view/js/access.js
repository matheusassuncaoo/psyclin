feather.replace();

// Simulação de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const academicRecord = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const keepConnected = document.querySelector('input[type="checkbox"]').checked;

    try {
        // Simulação de requisição ao backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                academicRecord,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            // Armazenar token ou dados de sessão
            if (keepConnected) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }
            // Redirecionar para o dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Registro Acadêmico ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao conectar com o servidor.');
    }
});