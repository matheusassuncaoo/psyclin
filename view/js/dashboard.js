document.addEventListener("DOMContentLoaded", () => {
    // Inicializando os ícones do Feather Icons
    feather.replace();

    // Seletores
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const mobileSearchToggle = document.getElementById("mobile-search-toggle");
    const mobileSearchBar = document.getElementById("mobile-search-bar");
    const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");
    const mainContent = document.querySelector(".flex-1");

    // Função para alternar o sidebar
    const toggleSidebar = () => {
        sidebar.classList.toggle("-translate-x-full");
        sidebar.classList.toggle("translate-x-0");

        // Ajustar o conteúdo principal
        if (sidebar.classList.contains("translate-x-0")) {
            mainContent.style.marginLeft = "16rem"; // Largura do sidebar (64px * 4)
        } else {
            mainContent.style.marginLeft = "0";
        }
    };

    // Função para alternar a barra de pesquisa no mobile
    const toggleMobileSearch = () => {
        mobileSearchBar.classList.toggle("hidden");
    };

    // Função para alternar dropdowns
    const toggleDropdown = (toggle) => {
        const dropdownMenu = document.querySelector(`#${toggle.getAttribute("data-dropdown-toggle")}`);
        if (dropdownMenu) dropdownMenu.classList.toggle("hidden");
    };

    // Fechar dropdowns quando clicar fora
    const closeDropdownsOnClickOutside = (e) => {
        dropdownToggles.forEach((toggle) => {
            const dropdownMenu = document.querySelector(`#${toggle.getAttribute("data-dropdown-toggle")}`);
            if (
                dropdownMenu &&
                !toggle.contains(e.target) &&
                !dropdownMenu.contains(e.target)
            ) {
                dropdownMenu.classList.add("hidden");
            }
        });
    };

    // Event Listeners
    if (menuToggle) {
        menuToggle.addEventListener("click", toggleSidebar);
    }

    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener("click", toggleMobileSearch);
    }

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            toggleDropdown(toggle);
        });
    });

    document.addEventListener("click", closeDropdownsOnClickOutside);
});

function show(data) {
    const countElement = document.getElementById("active-professionals-count");
    if (countElement) {
        // Filtrar os profissionais com statusProf = 1
        const activeProfessionals = data.filter(professional => professional.statusProf === 1);
        // Atualizar o contador com o número de profissionais ativos
        countElement.textContent = activeProfessionals.length;
    }
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
        loader.classList.add('hidden');
    }
}

const url = "http://localhost:8080/profissional/status/1";

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

getAPI(url);

document.addEventListener("DOMContentLoaded", () => {
    const notificationBell = document.getElementById("notification-bell");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const notificationBadge = document.getElementById("notification-badge");
    const notificationList = document.getElementById("notification-list");

    // Simulação de notificações
    const notifications = [
        { id: 1, message: "Nova mensagem de um paciente", read: false },
        { id: 2, message: "Consulta agendada para amanhã", read: false },
        { id: 3, message: "Relatório enviado com sucesso", read: true },
    ];

    // Função para carregar notificações
    const loadNotifications = () => {
        notificationList.innerHTML = ""; // Limpa a lista
        const unreadCount = notifications.filter(n => !n.read).length;

        // Atualiza o badge de notificações
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.remove("hidden");
            notificationBell.classList.add("animate-shake"); // Adiciona animação
            setTimeout(() => notificationBell.classList.remove("animate-shake"), 1000); // Remove animação após 1s
        } else {
            notificationBadge.classList.add("hidden");
        }

        // Adiciona notificações à lista
        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = `px-4 py-2 text-sm ${notification.read ? "text-gray-400" : "text-gray-600 font-medium"}`;
            li.textContent = notification.message;
            li.addEventListener("click", () => markAsRead(notification.id));
            notificationList.appendChild(li);
        });

        // Caso não haja notificações
        if (notifications.length === 0) {
            const li = document.createElement("li");
            li.className = "px-4 py-2 text-sm text-gray-600";
            li.textContent = "Sem notificações";
            notificationList.appendChild(li);
        }
    };

    // Função para marcar notificações como lidas
    const markAsRead = (id) => {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            loadNotifications(); // Recarrega as notificações
        }
    };

    // Exibir/ocultar dropdown ao clicar no sino
    notificationBell.addEventListener("click", () => {
        notificationDropdown.classList.toggle("hidden");
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener("click", (e) => {
        if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.add("hidden");
        }
    });

    // Carregar notificações ao iniciar
    loadNotifications();
});