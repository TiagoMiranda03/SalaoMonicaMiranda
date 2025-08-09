document.getElementById("adicionar").addEventListener("click", function () {
    const nome = document.getElementById("nome").value;
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if (!nome || !servico || !data || !hora) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const lista = document.getElementById("lista-marcacoes");

    const card = document.createElement("div");
    card.classList.add("appointment-card");
    card.innerHTML = `
        <h4>${nome}</h4>
        <p>💇 ${servico}</p>
        <p>📅 ${data} - ${hora}</p>
    `;

    lista.appendChild(card);

    document.getElementById("nome").value = "";
    document.getElementById("servico").selectedIndex = 0;
    document.getElementById("data").value = "";
    document.getElementById("hora").value = "";
});
