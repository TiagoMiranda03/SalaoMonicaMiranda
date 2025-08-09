const monthYear = document.getElementById("monthYear");
        const calendarDays = document.getElementById("calendarDays");
        const modal = document.getElementById("modal");
        const modalClose = document.getElementById("modalClose");
        const eventList = document.getElementById("eventList");

        let currentDate = new Date();
        // Exemplo de eventos (podes ligar ao backend depois)
        const events = {
            "2025-08-11": [
                { nome: "João Santos", servico: "Corte Masculino", hora: "10:00" },
                { nome: "Carla Sousa", servico: "Coloração", hora: "14:30" },
                { nome: "Carla Sousa", servico: "Coloração", hora: "14:30" },
                { nome: "Carla Sousa", servico: "Coloração", hora: "14:30" }
            ],
            "2025-08-15": [
                { nome: "Ana Silva", servico: "Penteado", hora: "09:00" }
            ],
            "2026-01-01":[
                {nome : "Monica Miranda", servico:"alisamento", hora: "12:30"}
            ]
        };

        function renderCalendar() {
            calendarDays.innerHTML = "";
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDay = firstDay.getDay();
            const daysInMonth = lastDay.getDate();

            monthYear.textContent = firstDay.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

            const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
            daysOfWeek.forEach(day => {
                const div = document.createElement("div");
                div.classList.add("day-name");
                div.textContent = day;
                calendarDays.appendChild(div);
            });

            for (let i = 0; i < startDay; i++) {
                calendarDays.appendChild(document.createElement("div"));
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("day");
                dayDiv.textContent = day;

                if (events[dateKey]) {
                    dayDiv.classList.add("has-event");
                    dayDiv.addEventListener("click", () => {
                        showModal(dateKey);
                    });
                }

                calendarDays.appendChild(dayDiv);
            }
        }

        function showModal(dateKey) {
            const dayEvents = events[dateKey];
            eventList.innerHTML = "";

            if (!dayEvents || dayEvents.length === 0) {
                eventList.innerHTML = "<li>Não existem marcações para este dia.</li>";
            } else {
                dayEvents.forEach(event => {
                    const li = document.createElement("li");
                    li.textContent = `${event.hora} - ${event.nome} (${event.servico})`;
                    eventList.appendChild(li);
                });
            }
            modal.style.display = "flex";
        }

        modalClose.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Fecha o modal se clicares fora do conteúdo
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        document.getElementById("prevMonth").addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById("nextMonth").addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        renderCalendar();