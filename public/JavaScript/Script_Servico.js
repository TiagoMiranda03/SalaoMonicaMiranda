const btnAddService = document.getElementById('btnAddService');
const form = document.getElementById('addServiceForm');
const servicesList = document.getElementById('servicesList');

btnAddService.addEventListener('click', () => {
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  btnAddService.textContent = form.style.display === 'none' ? '➕ Adicionar Serviço' : '✖ Fechar';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('serviceName').value.trim();
  const preco = parseFloat(document.getElementById('servicePrice').value);

  if (!nome || isNaN(preco) || preco < 0) {
    alert('Por favor, preencha corretamente o nome e o preço.');
    return;
  }

  try {
    const response = await fetch('/api/servico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao adicionar serviço');
    }

    const novoServico = await response.json();

    const card = document.createElement('div');
    card.classList.add('appointment-card');
    card.innerHTML = `
      <h4>${novoServico.nome}</h4>
      <p>Preço: ${Number(novoServico.preco).toFixed(2)}€</p>
    `;
    servicesList.appendChild(card);

    form.reset();
    form.style.display = 'none';
    btnAddService.textContent = '➕ Adicionar Serviço';

  } catch (error) {
    console.error('Erro ao adicionar serviço:', error);
    alert(error.message);
  }
});


async function carregarServicos() {
  try {
    const res = await fetch('/api/servico');
    if (!res.ok) throw new Error('Erro ao carregar serviços');
    const servicos = await res.json();

    console.log('Serviços recebidos:', servicos);

    servicesList.innerHTML = '';

    servicos.forEach(servico => {
      const card = document.createElement('div');
      card.classList.add('appointment-card');
      const percoNum = Number(servico.preco);
      card.innerHTML = `<h4>${servico.nome}</h4><p>Preço: ${percoNum.toFixed(2)}€</p>`;
      servicesList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    servicesList.innerHTML = '<p>Erro ao carregar serviços.</p>';
  }
}

window.addEventListener('DOMContentLoaded', carregarServicos);
