// api.js

// Função para registrar usuário
export async function registerUser(nome, sobrenome, dataNascimento, email, senha) {
    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            sobrenome,
            dataNascimento,
            email,
            senha,
        }),
    });

    const data = await response.json();
    return data;
}

// Função para logar usuário
export async function loginUser(email, senha) {
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            senha,
        }),
    });

    if (!response.ok) {
        throw new Error('Erro ao fazer login');
    }

    const data = await response.json();
    return data;
}
