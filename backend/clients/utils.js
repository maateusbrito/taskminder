// utils.js

// Função para obter o token
function getToken() {
    return localStorage.getItem('token');
}

// Função para obter o ID do usuário
async function getUserId() {
    const token = getToken();
    if (!token) {
        console.error('Token não encontrado');
        return null;
    }
    try {
        const response = await fetch('http://localhost:3000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            return userData._id;
        } else {
            console.error('Erro ao carregar dados do usuário');
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// Função para carregar dados do usuário
async function loadUserData(usernameElement) {
    const token = getToken();
    if (!token) {
        console.error('Token não encontrado');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            usernameElement.textContent = userData.name;
        } else {
            console.error('Erro ao carregar dados do usuário');
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}
