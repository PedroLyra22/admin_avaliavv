document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".stars").forEach(container => {
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.innerHTML = "★";
            star.dataset.value = i;
            star.classList.add("star");
            star.addEventListener("click", function () {
                setStars(container, i);
            });
            container.appendChild(star);
        }
    });

    function setStars(container, rating) {
        [...container.children].forEach(star => {
            const val = parseInt(star.dataset.value);
            star.classList.toggle("selected", val <= rating);
        });
        container.dataset.rating = rating;
    }

    document.getElementById("formAvaliacao").addEventListener("submit", async function (e) {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const estande_id = params.get("estande_id");

        if (!estande_id) {
            mostrarMensagem("ID do estande não encontrado na URL.", true);
            return;
        }

        const data = {
            nota_apresentacao: getNota("nota_apresentacao"),
            nota_ideia: getNota("nota_ideia"),
            nota_experiencia: getNota("nota_experiencia"),
            estande_id: parseInt(estande_id)
        };

        if (
            data.nota_apresentacao === null ||
            data.nota_ideia === null ||
            data.nota_experiencia === null
        ) {
            mostrarMensagem("Por favor, selecione todas as notas.", true);
            return;
        }


        try {
            const response = await fetch("http://localhost:5000/avaliacao_estande", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensagem("Avaliação enviada com sucesso!", false);
                document.getElementById("formAvaliacao").reset();
                document.querySelectorAll(".stars").forEach(s => {
                    s.dataset.rating = "";
                    [...s.children].forEach(star => star.classList.remove("selected"));
                });
            } else {
                mostrarMensagem(result.message || "Erro ao enviar avaliação.", true);
            }
        } catch (err) {
            mostrarMensagem("Erro de conexão com o servidor.", true);
        }
    });

    function getNota(name) {
        const el = document.querySelector(`.stars[data-name="${name}"]`);
        return el?.dataset.rating ? parseInt(el.dataset.rating) : null;
    }

    function mostrarMensagem(msg, erro) {
        const div = document.getElementById("mensagem");
        div.textContent = msg;
        div.className = erro ? "mensagem erro" : "mensagem sucesso";
    }
});
