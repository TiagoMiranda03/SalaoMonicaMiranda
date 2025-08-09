const loginBtn = document.getElementById('loginBtn');
        const errorMsg = document.getElementById('errorMsg');

        loginBtn.addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                errorMsg.style.display = 'block';
                return;
            }
            errorMsg.style.display = 'none';

            // Aqui irias chamar o backend para validar o login.
            // Por agora, só simulo com um alert e limpa campos.
            alert('Login efetuado com sucesso (simulação).');
            document.getElementById('loginForm').reset();

            // Depois de validar, redireciona para a página principal, por ex:
             window.location.href = 'index.html';
        });