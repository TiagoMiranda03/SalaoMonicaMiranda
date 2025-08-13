const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const eventList = document.getElementById('eventList');

let currentDate = new Date();
let todasMarcacoes = []; // Guardar todas as marcações carregadas

// Função para buscar todas as marcações e marcar os dias no calendário
async function carregarMarcacoesEMarcarDias() {
    try {
        const res = await fetch('/api/marcacoes');
        if (!res.ok) throw new Error('Erro ao buscar marcações');
        todasMarcacoes = await res.json();
        marcarDiasNoCalendario(todasMarcacoes);
    } catch (error) {
        console.error('Erro ao buscar marcações:', error);
    }
}

// Renderizar calendário
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${date.toLocaleString('pt-PT', { month: 'long' })} ${year}`;
    calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        const fullDate = new Date(year, month, day);
        const dateStr = fullDate.toISOString().split('T')[0];
        dayDiv.dataset.date = dateStr;

        dayDiv.addEventListener('click', () => openModal(dateStr));
        calendarDays.appendChild(dayDiv);
    }

    carregarMarcacoesEMarcarDias();
}

// Abrir modal com marcações do dia
async function openModal(dateStr) {
    eventList.innerHTML = '<li>Carregando...</li>';
    modal.style.display = 'flex'; // ou 'block', depende do CSS que já tens

    try {
        const res = await fetch('/api/marcacoes');
        if (!res.ok) throw new Error('Erro ao carregar marcações');
        const marcacoes = await res.json();

        const marcacoesDoDia = marcacoes.filter(m => m.data.split('T')[0] === dateStr);

        if (marcacoesDoDia.length === 0) {
            eventList.innerHTML = '<li>Sem marcações para este dia</li>';
        } else {
            eventList.innerHTML = '';
            marcacoesDoDia.forEach(m => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${m.hora}</strong> - ${m.nome_cliente} (${m.servico_nome})
                    <div class="button-group">
                        <button class="edit-btn" onclick="editAppointment('${m.id}')">✏️ Editar</button>
                        <button class="delete-btn" onclick="deleteAppointment('${m.id}')">🗑️ Eliminar</button>
                    </div>
                `;
                eventList.appendChild(li);
            });
        }
    } catch (err) {
        console.error(err);
        eventList.innerHTML = '<li>Erro ao carregar marcações</li>';
    }
}


function editAppointment(id) {
    const novoNome = prompt("Novo nome para a marcação:");
    if (novoNome) {
        fetch(`/api/marcacoes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome_cliente: novoNome })
        }).then(res => {
            if (res.ok) {
                alert("Marcação editada com sucesso!");
                carregarMarcacoesEMarcarDias(); // Atualiza a agenda
                modal.style.display = 'none';
            }
        });
    }
}

function deleteAppointment(id) {
    if (confirm("Tens a certeza que queres eliminar esta marcação?")) {
        fetch(`/api/marcacoes/${id}`, { method: "DELETE" })
            .then(res => {
                if (res.ok) {
                    alert("Marcação eliminada!");
                    carregarMarcacoesEMarcarDias(); // Atualiza a agenda
                    modal.style.display = 'none';
                } else {
                    alert("Não foi possível eliminar a marcação.");
                }
            }).catch(err => {
                console.error(err);
                alert("Erro ao eliminar a marcação.");
            });
    }
}

// Fechar modal
modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Navegação do calendário
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Marcar os dias com marcações
function marcarDiasNoCalendario(marcacoes) {
    const diasComMarcacoes = marcacoes.map(m => m.data.split('T')[0]);
    document.querySelectorAll('.day').forEach(diaEl => {
        const dataDia = diaEl.getAttribute('data-date');
        if (diasComMarcacoes.includes(dataDia)) {
            diaEl.classList.add('dia-com-marcacao');
        }
    });
}

// Inicializa
renderCalendar(currentDate);
