const btnAddService = document.getElementById('btnAddService');
        const form = document.getElementById('addServiceForm');
        const servicesList = document.getElementById('servicesList');

        btnAddService.addEventListener('click', () => {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
            btnAddService.textContent = form.style.display === 'none' ? '➕ Adicionar Serviço' : '✖ Fechar';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('serviceName').value.trim();
            const emoji = document.getElementById('serviceEmoji').value.trim();
            const price = parseFloat(document.getElementById('servicePrice').value);

            if (!name || isNaN(price) || price < 0) {
                alert('Por favor, preencha corretamente o nome e o preço.');
                return;
            }

            // Criar novo serviço
            const card = document.createElement('div');
            card.classList.add('appointment-card');
            card.innerHTML = `<h4>${emoji ? emoji + ' ' : ''}${name}</h4><p>Preço: ${price.toFixed(2)}€</p>`;

            servicesList.appendChild(card);

            // Reset formulário
            form.reset();
            form.style.display = 'none';
            btnAddService.textContent = '➕ Adicionar Serviço';
        });