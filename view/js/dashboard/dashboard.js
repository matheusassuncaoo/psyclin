/**
 * @fileoverview Script principal para o Dashboard do Psyclin
 * Gerencia a interatividade da interface, incluindo sidebars, dropdowns e carregamento de dados da API
 * @version 1.2.0
 * @author Matheus Assunção
 */

// Importar o serviço do dashboard
// Nota: Certifique-se de incluir o script do serviço antes do dashboard.js no HTML
// <script src="../services/dashboardService.js"></script>

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar componentes da interface
    inicializarInterface();

    // Inicializar o dashboard
    inicializarDashboard();
});

/**
 * Inicializa todos os componentes interativos da interface
 */
function inicializarInterface() {
    // Seletores dos elementos principais
    const btnAlternarSidebar = document.getElementById("btn-sidebar-toggle");
    const barraLateral = document.getElementById("sidebar");
    const conteudoPrincipal = document.querySelector(".flex-1");
    const dropdownNotificacoes = document.getElementById("notifications-dropdown");
    const dropdownUsuario = document.getElementById("user-dropdown");
    const btnPesquisaMobile = document.getElementById("button-mobile-search");
    const barraPesquisaMobile = document.getElementById("mobile-search-bar");
    const btnNotificacao = document.getElementById("button-notification");
    const btnUsuario = document.getElementById("user-menu-button");

    // Configurar barra lateral
    configurarBarraLateral(btnAlternarSidebar, barraLateral, conteudoPrincipal);

    // Configurar barra de pesquisa móvel
    configurarPesquisaMobile(btnPesquisaMobile, barraPesquisaMobile);

    // Configurar dropdowns
    configurarDropdowns(dropdownNotificacoes, dropdownUsuario, btnNotificacao, btnUsuario);

    // Inicializar ícones
    inicializarIcones();
}

/**
 * Configura o comportamento da barra lateral
 * @param {HTMLElement} botao - Botão para alternar a barra lateral
 * @param {HTMLElement} sidebar - Elemento da barra lateral
 * @param {HTMLElement} conteudo - Conteúdo principal que será ajustado
 */
function configurarBarraLateral(botao, sidebar, conteudo) {
    if (botao && sidebar && conteudo) {
        botao.addEventListener("click", () => {
            sidebar.classList.toggle("-translate-x-full");
            //sidebar.classList.toggle("translate-x-0");

            // Ajustar margem do conteúdo principal apenas em telas maiores
            if (window.innerWidth >= 768) {
                if (sidebar.classList.contains("translate-x-0")) {
                    conteudo.style.marginLeft = "16rem"; // 256px
                } else {
                    conteudo.style.marginLeft = "0";
                }
            }
        });
    }
}

/**
 * Configura a barra de pesquisa móvel
 * @param {HTMLElement} botao - Botão para mostrar/ocultar a barra de pesquisa
 * @param {HTMLElement} barraPesquisa - Elemento da barra de pesquisa
 */
function configurarPesquisaMobile(botao, barraPesquisa) {
    if (botao && barraPesquisa) {
        botao.addEventListener("click", () => {
            barraPesquisa.classList.toggle("hidden");
        });
    }
}

/**
 * Configura o comportamento dos dropdowns
 * @param {HTMLElement} dropdownNotificacoes - Dropdown de notificações
 * @param {HTMLElement} dropdownUsuario - Dropdown do usuário
 * @param {HTMLElement} btnNotificacao - Botão para abrir dropdown de notificações
 * @param {HTMLElement} btnUsuario - Botão para abrir dropdown do usuário
 */
function configurarDropdowns(dropdownNotificacoes, dropdownUsuario, btnNotificacao, btnUsuario) {
    const btnNotificacaoMobile = document.getElementById("button-mobile-notification");
    const dropdownNotificacoesMobile = document.getElementById("mobile-notifications-dropdown");

    // Fechar dropdowns ao clicar fora
    document.addEventListener("click", (evento) => {
        if (dropdownNotificacoes && !evento.target.closest("#button-notification") &&
            !evento.target.closest("#notifications-dropdown")) {
            dropdownNotificacoes.classList.add("hidden");
        }

        if (dropdownNotificacoesMobile && !evento.target.closest("#button-mobile-notification") &&
            !evento.target.closest("#mobile-notifications-dropdown")) {
            dropdownNotificacoesMobile.classList.add("hidden");
        }

        if (dropdownUsuario && !evento.target.closest("#user-menu-button") &&
            !evento.target.closest("#user-dropdown")) {
            dropdownUsuario.classList.add("hidden");
        }
    });

    // Configurar botão de notificações desktop
    if (btnNotificacao && dropdownNotificacoes) {
        btnNotificacao.addEventListener("click", (evento) => {
            evento.preventDefault();
            evento.stopPropagation();
            dropdownNotificacoes.classList.toggle("hidden");
            if (dropdownUsuario) dropdownUsuario.classList.add("hidden");
        });
    }

    // Configurar botão de notificações mobile
    if (btnNotificacaoMobile && dropdownNotificacoesMobile) {
        btnNotificacaoMobile.addEventListener("click", (evento) => {
            evento.preventDefault();
            evento.stopPropagation();
            dropdownNotificacoesMobile.classList.toggle("hidden");
            if (dropdownUsuario) dropdownUsuario.classList.add("hidden");
        });
    }

    // Configurar botão de usuário
    if (btnUsuario && dropdownUsuario) {
        btnUsuario.addEventListener("click", (evento) => {
            evento.stopPropagation();
            dropdownUsuario.classList.toggle("hidden");
            if (dropdownNotificacoes) dropdownNotificacoes.classList.add("hidden");
            if (dropdownNotificacoesMobile) dropdownNotificacoesMobile.classList.add("hidden");
        });
    }
}

/**
 * Inicializa os ícones Feather
 */
function inicializarIcones() {
    if (typeof feather !== "undefined") {
        feather.replace();
    } else {
        console.warn("Biblioteca Feather Icons não encontrada.");
    }
}

/**
 * Inicializa o dashboard carregando os dados
 */
async function inicializarDashboard() {
    const dashboardService = new DashboardService();
    
    try {
        mostrarCarregamento();
        const dados = await dashboardService.buscarDadosDashboard();
        atualizarDashboard(dados);
    } catch (erro) {
        console.error("Erro ao inicializar dashboard:", erro);
        mostrarErro("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.");
    } finally {
        ocultarCarregamento();
    }
}

/**
 * Atualiza todos os contadores do dashboard com os dados recebidos
 * @param {Object} dados - Dados recebidos da API
 */
function atualizarDashboard(dados) {
    // Atualizar contadores dinâmicos
    atualizarContador("active-professionals-count", dados.profissionais.length);
    atualizarContador("active-patients-count", dados.pacientes.length);
    atualizarContador("attend-count", dados.atendimentos);
    atualizarContador("anamnese-count", dados.anamneses);
    atualizarContador("encontros-count", dados.encontros);
    atualizarContador("relatorios-count", dados.relatorios);

    // Atualizar cards com informações adicionais
    atualizarCardsInformativos(dados);
}

/**
 * Atualiza um contador específico
 * @param {string} id - ID do elemento HTML
 * @param {number} valor - Valor a ser exibido
 */
function atualizarContador(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor.toString().padStart(3, '0');
        
        // Adicionar animação de atualização
        elemento.classList.add('animate-pulse');
        setTimeout(() => {
            elemento.classList.remove('animate-pulse');
        }, 1000);
    }
}

/**
 * Atualiza os cards informativos com dados adicionais
 * @param {Object} dados - Dados recebidos da API
 */
function atualizarCardsInformativos(dados) {
    // Exemplo de atualização de cards informativos
    const cardProfissionais = document.getElementById('card-profissionais');
    const cardPacientes = document.getElementById('card-pacientes');
    
    if (cardProfissionais) {
        const profissionaisPorTipo = agruparPorTipo(dados.profissionais);
        cardProfissionais.innerHTML += `
            <div class="mt-2 text-sm text-gray-600">
                <p>Psicólogos: ${profissionaisPorTipo.PSICOLOGO || 0}</p>
                <p>Estagiários: ${profissionaisPorTipo.ESTAGIARIO || 0}</p>
            </div>
        `;
    }

    if (cardPacientes) {
        const pacientesPorEstado = agruparPorEstado(dados.pacientes);
        cardPacientes.innerHTML += `
            <div class="mt-2 text-sm text-gray-600">
                <p>Pacientes por Estado:</p>
                ${Object.entries(pacientesPorEstado)
                    .map(([estado, quantidade]) => `<p>${estado}: ${quantidade}</p>`)
                    .join('')}
            </div>
        `;
    }
}

/**
 * Agrupa profissionais por tipo
 * @param {Array} profissionais - Lista de profissionais
 * @returns {Object} Profissionais agrupados por tipo
 */
function agruparPorTipo(profissionais) {
    return profissionais.reduce((acc, prof) => {
        const tipo = prof.tipoProfissional || 'OUTRO';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
    }, {});
}

/**
 * Agrupa pacientes por estado do RG
 * @param {Array} pacientes - Lista de pacientes
 * @returns {Object} Pacientes agrupados por estado
 */
function agruparPorEstado(pacientes) {
    return pacientes.reduce((acc, pac) => {
        const estado = pac.estdoRgPac || 'NÃO INFORMADO';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {});
}

/**
 * Mostra o indicador de carregamento
 */
function mostrarCarregamento() {
    const carregador = document.querySelector('.loader');
    if (carregador) {
        carregador.classList.remove('hidden');
        carregador.style.display = 'block';
    }
}

/**
 * Oculta o indicador de carregamento
 */
function ocultarCarregamento() {
    const carregador = document.querySelector('.loader');
    if (carregador) {
        carregador.style.display = 'none';
        carregador.classList.add('hidden');
    }
}

/**
 * Exibe uma mensagem de erro na interface
 * @param {string} mensagem - Mensagem de erro a ser exibida
 */
function mostrarErro(mensagem) {
    // Implementação de exibição de erro pode ser adicionada aqui
    console.error(mensagem);

    // Exemplo de implementação com um elemento toast ou alert
    const conteudoPrincipal = document.querySelector('.flex-1');
    if (conteudoPrincipal) {
        const alerta = document.createElement('div');
        alerta.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed bottom-4 right-4 shadow-md';
        alerta.innerHTML = `
            <strong class="font-bold mr-1">Erro!</strong>
            <span class="block sm:inline">${mensagem}</span>
        `;

        conteudoPrincipal.appendChild(alerta);

        // Remover o alerta após 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.parentNode.removeChild(alerta);
            }
        }, 5000);
    }
}