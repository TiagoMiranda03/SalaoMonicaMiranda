const loginBTN = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

loginBTN.addEventListener('click', async() =>{
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email  || !password){
        errorMsg.style.display = 'block';
        errorMsg.textContent = ' Por favor, preencha todos os campos';
        return
    }
    errorMsg.style.display = 'none';

     try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            // Login bem sucedido - redireciona para a página principal
            window.location.href = 'marcacao.html';
        } else {
            // Mostrar mensagem de erro vinda do backend
            errorMsg.style.display = 'block';
            errorMsg.textContent = data.error || 'Erro no login';
        }
    } catch (e) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Erro na conexão. Tente novamente.';
  }

})
