function setFeatherIcons() {
    feather.replace();
}

function setDashboards() {
    //a ideia é atualizar o dashboard com os dados do banco de dados
    //paciente, medico, enfermeiro, usuario


}

// Utilitário para atualizar contadores do dashboard de forma expansível
export function updateDashboardCounts(counts = {}) {
    const defaultIds = {
        profissionais: "active-professionals-count",
        atender: "attend-count",
        anamnese: "anamnese-count",
        encontros: "encontros-count",
        relatorios: "relatorios-count",
        historico: "historico-count"
    };

    Object.entries(defaultIds).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = counts[key] !== undefined ? counts[key] : "000";
    });
}

// Loader utilitário
export function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');
}

// Notificações expansível
export class NotificationManager {
    constructor({ bellId, dropdownId, badgeId, listId }) {
        this.bell = document.getElementById(bellId);
        this.dropdown = document.getElementById(dropdownId);
        this.badge = document.getElementById(badgeId);
        this.list = document.getElementById(listId);
        this.notifications = [];
        this._setupEvents();
    }

    _setupEvents() {
        if (this.bell) {
            this.bell.addEventListener("click", () => {
                this.dropdown.classList.toggle("hidden");
            });
        }
        document.addEventListener("click", (e) => {
            if (
                this.bell && this.dropdown &&
                !this.bell.contains(e.target) &&
                !this.dropdown.contains(e.target)
            ) {
                this.dropdown.classList.add("hidden");
            }
        });
    }

    setNotifications(notifications) {
        this.notifications = notifications;
        this.render();
    }

    markAsRead(id) {
        const n = this.notifications.find(n => n.id === id);
        if (n) n.read = true;
        this.render();
    }

    render() {
        if (!this.list) return;
        this.list.innerHTML = "";
        const unreadCount = this.notifications.filter(n => !n.read).length;

        // Badge
        if (this.badge) {
            if (unreadCount > 0) {
                this.badge.textContent = unreadCount;
                this.badge.classList.remove("hidden");
                this.bell.classList.add("animate-shake");
                setTimeout(() => this.bell.classList.remove("animate-shake"), 1000);
            } else {
                this.badge.classList.add("hidden");
            }
        }

        // Lista
        if (this.notifications.length === 0) {
            const li = document.createElement("li");
            li.className = "px-4 py-2 text-sm text-gray-600";
            li.textContent = "Sem notificações";
            this.list.appendChild(li);
        } else {
            this.notifications.forEach(notification => {
                const li = document.createElement("li");
                li.className = `px-4 py-2 text-sm cursor-pointer ${notification.read ? "text-gray-400" : "text-gray-600 font-medium"}`;
                li.textContent = notification.message;
                li.addEventListener("click", () => this.markAsRead(notification.id));
                this.list.appendChild(li);
            });
        }
    }
}