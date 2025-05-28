const mainIp = '10.0.1.132'
const portBackendApi = 5000
const baseUrlBackend = `http://${mainIp}:${portBackendApi}`

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
        const evento_id = params.get("evento_id");

        if (!evento_id) {
            mostrarMensagem("ID do evento não encontrado na URL.", true);
            return;
        }

        const data = {
            nota_equipe: getNota("nota_equipe"),
            nota_infraestrutura: getNota("nota_infraestrutura"),
            nota_organizacao: getNota("nota_organizacao"),
            nota_experiencia: getNota("nota_experiencia"),
            evento_id: parseInt(evento_id)
        };

        if (Object.values(data).some(v => v === null)) {
            mostrarMensagem("Por favor, selecione todas as notas.", true);
            return;
        }


        try {
            const response = await fetch(`${baseUrlBackend}/avaliacao_evento`, {
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

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});

