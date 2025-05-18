import { updateDashboardCounts, hideLoading, NotificationManager } from './global.js';

// Exemplo de função para buscar dados do backend e atualizar o dashboard
async function fetchDashboardData() {
    try {
        // Exemplo: buscar profissionais ativos
        const profRes = await fetch("http://localhost:8080/profissional/status/1");
        const profissionais = await profRes.json();

        // Aqui você pode adicionar outras requisições para "atender", "anamnese", etc.
        // Exemplo fictício:
        // const atenderRes = await fetch("http://localhost:8080/atender");
        // const atender = await atenderRes.json();

        // Atualiza os contadores do dashboard
        updateDashboardCounts({
            profissionais: profissionais.length,
            // atender: atender.length,
            // anamnese: ...,
            // encontros: ...,
            // relatorios: ...,
            // historico: ...
        });

        hideLoading();
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        hideLoading();
    }
}

// Exemplo de inicialização das notificações
function setupNotifications() {
    const notificationManager = new NotificationManager({
        bellId: "notification-bell",
        dropdownId: "notification-dropdown",
        badgeId: "notification-badge",
        listId: "notification-list"
    });

    // Simulação de notificações
    notificationManager.setNotifications([
        { id: 1, message: "Nova mensagem de um paciente", read: false },
        { id: 2, message: "Consulta agendada para amanhã", read: false },
        { id: 3, message: "Relatório enviado com sucesso", read: true }
    ]);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardData();
    setupNotifications();
});