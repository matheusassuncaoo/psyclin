document.addEventListener("DOMContentLoaded", () => {
    // Seletores
    const btnSidebarToggle = document.getElementById("btn-sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".flex-1");
    const notificationsDropdown = document.getElementById("notifications-dropdown");
    const userDropdown = document.getElementById("user-dropdown");
    const mobileSearchToggle = document.getElementById("mobile-search-toggle");
    const mobileSearchBar = document.getElementById("mobile-search-bar");

    // Alternar o sidebar
    if (btnSidebarToggle && sidebar && mainContent) {
        btnSidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("-translate-x-full");
            sidebar.classList.toggle("translate-x-0");

        });
    }

    // Alternar barra de pesquisa no mobile
    if (mobileSearchToggle && mobileSearchBar) {
        mobileSearchToggle.addEventListener("click", () => {
            mobileSearchBar.classList.toggle("hidden");
        });
    }

    // Fechar dropdowns ao clicar fora
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#notifications-btn") && !e.target.closest("#notifications-dropdown")) {
            notificationsDropdown.classList.add("hidden");
        }
        if (!e.target.closest("#user-menu-button") && !e.target.closest("#user-dropdown")) {
            userDropdown.classList.add("hidden");
        }
    });

    // Abrir dropdowns ao clicar nos botões
    document.getElementById("notifications-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        notificationsDropdown.classList.toggle("hidden");
    });

    document.getElementById("user-menu-button").addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
    });

    // Inicializar Feather Icons
    if (typeof feather !== "undefined") {
        feather.replace();
    }
});

// Função para exibir o número de profissionais ativos
function show(data) {
    const countElement = document.getElementById("active-professionals-count");
    if (countElement) {
        // Filtrar os profissionais com statusProf = 1
        const activeProfessionals = data.filter(professional => professional.statusProf === 1);
        // Atualizar o contador com o número de profissionais ativos
        countElement.textContent = activeProfessionals.length;
    }
}

// Função para ocultar o loader
function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
        loader.classList.add('hidden');
    }
}

// Função para buscar dados da API
async function getAPI(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        console.log(data);
        if (response) hideLoading();
        show(data);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

// URL da API
const url = "http://localhost:8080/profissional/status/1";

// Chamada da API
getAPI(url);