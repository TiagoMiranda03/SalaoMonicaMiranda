// Função para formatar datas
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-PT');
}

// Função para popular a dropdown de serviços
async function carregarServicos() {
  const selectServico = document.getElementById('servico');
  try {
    const res = await fetch('/api/servico');
    if (!res.ok) throw new Error('Erro ao carregar serviços');
    const servicos = await res.json();

    selectServico.innerHTML = '<option value="">Seleciona uma opção</option>';
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = servico.nome;
      selectServico.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

// Função para mostrar as marcações na lista
function adicionarMarcacaoNaLista(marcacao) {
  const lista = document.getElementById('lista-marcacoes');
  const card = document.createElement('div');
  card.classList.add('appointment-card');
  card.innerHTML = `
    <h4>${marcacao.nome_cliente}</h4>
    <p>💇 ${marcacao.servico_nome}</p>
    <p>📅 ${formatDate(marcacao.data)} - ${marcacao.hora}</p>
  `;
  lista.appendChild(card);
}

// Função para carregar e mostrar as próximas marcações
async function carregarMarcacoes() {
  try {
    const res = await fetch('/api/marcacoes');
    if (!res.ok) throw new Error('Erro ao carregar marcações');
    const marcacoes = await res.json();

    const lista = document.getElementById('lista-marcacoes');
    lista.innerHTML = ''; // Limpa lista atual

    if (marcacoes.length === 0) {
      lista.innerHTML = '<p>Não existem marcações.</p>';
      return;
    }

    marcacoes.forEach(adicionarMarcacaoNaLista);
  } catch (error) {
    console.error(error);
  }
}

// Função para limpar os campos do formulário
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("servico").selectedIndex = 0;
  document.getElementById("data").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("descricao").value = "";
}

// Evento de adicionar marcação
document.getElementById("adicionar").addEventListener("click", async function () {
  const nome = document.getElementById("nome").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const descricao = document.getElementById("descricao").value;

  if (!nome || !servico || !data || !hora) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("/api/marcacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_cliente: nome,
        servico_id: servico,
        data,
        hora,
        descricao
      }),
    });

    if (!response.ok) throw new Error("Erro ao gravar marcação");

    const novaMarcacao = await response.json();
    adicionarMarcacaoNaLista(novaMarcacao);
    limparFormulario();

  } catch (error) {
    console.error(error);
    alert("Não foi possível adicionar a marcação.");
  }
});

// Inicialização ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  carregarServicos();
  carregarMarcacoes();
});
