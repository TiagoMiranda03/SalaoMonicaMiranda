const btnAddService = document.getElementById('btnAddService');
const form = document.getElementById('addServiceForm');
const servicesList = document.getElementById('servicesList');

btnAddService.addEventListener('click', () => {
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  btnAddService.textContent = form.style.display === 'none' ? '➕ Adicionar Serviço' : '✖ Fechar';
});

function criarCardServico(servico) {
  const card = document.createElement('div');
  card.classList.add('appointment-card');
  card.dataset.id = servico.id; // guardamos o id para usar depois

  card.innerHTML = `
    <h4>${servico.nome}</h4>
    <p>Preço: ${Number(servico.preco).toFixed(2)}€</p>
    <div class="btn-group">
      <button class="btnEditar btn btn-edit">✏️ Editar </button>
      <button class="btnEliminar btn btn-delete ">🗑️ Eliminar</button>
    </div>
  `;

  // Botão eliminar
  card.querySelector('.btnEliminar').addEventListener('click', async () => {
    if (confirm(`Eliminar o serviço "${servico.nome}"?`)) {
      try {
        const res = await fetch(`/api/servico/${servico.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao eliminar serviço');
        card.remove();
      } catch (err) {
        alert(err.message);
      }
    }
  });

  // Botão editar
  card.querySelector('.btnEditar').addEventListener('click', () => {
    // Substitui o conteúdo do card por inputs para edição
    card.innerHTML = `
      <input type="text" class="editNome" value="${servico.nome}" />
      <input type="number" class="editPreco" min="0" step="0.01" value="${Number(servico.preco).toFixed(2)}" />
      <div class="btn-group">
        <button class="btn btn-edit btnGuardar">💾 Guardar</button>
        <button class="btn btn-delete btnCancelar">❌ Cancelar</button>
      </div>    
      `;

    // Cancelar edição
    card.querySelector('.btnCancelar').addEventListener('click', () => {
      // Recria o card original
      const novoCard = criarCardServico(servico);
      card.replaceWith(novoCard);
    });

    // Guardar edição
    card.querySelector('.btnGuardar').addEventListener('click', async () => {
      const novoNome = card.querySelector('.editNome').value.trim();
      const novoPreco = parseFloat(card.querySelector('.editPreco').value);

      if (!novoNome || isNaN(novoPreco) || novoPreco < 0) {
        alert('Por favor, preencha corretamente o nome e o preço.');
        return;
      }

      try {
        const res = await fetch(`/api/servico/${servico.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: novoNome, preco: novoPreco }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Erro ao atualizar serviço');
        }

        const servicoAtualizado = await res.json();

        // Atualiza o card com os novos dados
        const novoCard = criarCardServico(servicoAtualizado);
        card.replaceWith(novoCard);

      } catch (err) {
        alert(err.message);
      }
    });
  });

  return card;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('serviceName').value.trim();
  const price = parseFloat(document.getElementById('servicePrice').value);

  if (!name || isNaN(price) || price < 0) {
    alert('Por favor, preencha corretamente o nome e o preço.');
    return;
  }

  try {
    const response = await fetch('/api/servico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: name, preco: price }),
    });

    if (!response.ok) throw new Error('Erro ao adicionar serviço');

    // Em vez de await response.json(), vamos garantir que o corpo é texto e tentar interpretar:
    const text = await response.text();
    let novoServico;
    try {
      novoServico = JSON.parse(text);
    } catch {
      // Se falhar o parse, criamos um objeto básico (pode ajustar conforme necessário)
      novoServico = { nome: name, preco: price };
    }

    // Atualiza a lista adicionando o novo serviço
    const card = criarCardServico(novoServico);
    servicesList.appendChild(card);

    form.reset();
    form.style.display = 'none';
    btnAddService.textContent = '➕ Adicionar Serviço';

  } catch (error) {
    console.error(error);
    alert('Erro ao adicionar serviço');
  }
});

async function carregarServicos() {
  try {
    const res = await fetch('/api/servico');
    if (!res.ok) throw new Error('Erro ao carregar serviços');
    const servicos = await res.json();

    servicesList.innerHTML = '';

    servicos.forEach(servico => {
      const card = criarCardServico(servico);
      servicesList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    servicesList.innerHTML = '<p>Erro ao carregar serviços.</p>';
  }
}

window.addEventListener('DOMContentLoaded', carregarServicos);
