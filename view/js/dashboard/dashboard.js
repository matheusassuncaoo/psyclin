/**
 * @fileoverview Script principal para o Dashboard do Psyclin
 * Gerencia a interatividade da interface, incluindo sidebars, dropdowns e carregamento de dados da API
 * @version 1.1.0
 * @author Matheus Assunção
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar componentes da interface
    inicializarInterface();

    // Carregar dados da API
    const urlProfissionais = "http://localhost:8080/profissional/status/1";
    const urlPacientes = "http://localhost:8080/paciente/status/1";

    buscarDadosAPI(urlProfissionais);
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
            sidebar.classList.toggle("translate-x-0");

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
    // Fechar dropdowns ao clicar fora
    document.addEventListener("click", (evento) => {
        // Verificar se os elementos existem antes de manipulá-los
        if (dropdownNotificacoes &&
            !evento.target.closest("#button-notification") &&
            !evento.target.closest("#notifications-dropdown")) {
            dropdownNotificacoes.classList.add("hidden");
        }

        if (dropdownUsuario &&
            !evento.target.closest("#user-menu-button") &&
            !evento.target.closest("#user-dropdown")) {
            dropdownUsuario.classList.add("hidden");
        }
    });

    // Configurar botão de notificações
    if (btnNotificacao && dropdownNotificacoes) {
        btnNotificacao.addEventListener("click", (evento) => {
            evento.stopPropagation();
            dropdownNotificacoes.classList.toggle("hidden");

            // Fechar o outro dropdown se estiver aberto
            if (dropdownUsuario && !dropdownUsuario.classList.contains("hidden")) {
                dropdownUsuario.classList.add("hidden");
            }
        });
    }

    // Configurar botão de usuário
    if (btnUsuario && dropdownUsuario) {
        btnUsuario.addEventListener("click", (evento) => {
            evento.stopPropagation();
            dropdownUsuario.classList.toggle("hidden");

            // Fechar o outro dropdown se estiver aberto
            if (dropdownNotificacoes && !dropdownNotificacoes.classList.contains("hidden")) {
                dropdownNotificacoes.classList.add("hidden");
            }
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
 * Busca dados da API e atualiza a interface
 * @param {string} url - URL da API para buscar dados
 */
async function buscarDadosAPI(url) {
    mostrarCarregamento();

    try {
        const resposta = await fetch(url, { method: 'GET' });

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const dados = await resposta.json();
        console.log("Dados recebidos da API:", dados);

        // Atualizar elementos da interface com os dados
        atualizarContadores(dados);

    } catch (erro) {
        console.error("Erro ao buscar dados da API:", erro);
        mostrarErro("Não foi possível carregar os dados. Tente novamente mais tarde.");
    } finally {
        ocultarCarregamento();
    }
}

/**
 * Atualiza os contadores do dashboard com os dados recebidos
 * @param {Array} dados - Dados recebidos da API
 */
function atualizarContadores(dados) {
    // Contador de profissionais ativos
    const elementoProfissionaisAtivos = document.getElementById("active-professionals-count");
    if (elementoProfissionaisAtivos && Array.isArray(dados)) {
        // Filtrar os profissionais com statusProf = 1
        const profissionaisAtivos = dados.filter(profissional => profissional.statusProf === 1);
        // Atualizar o contador com o número formatado
        elementoProfissionaisAtivos.textContent = profissionaisAtivos.length.toString().padStart(3, '0');
    }

    // Outros contadores podem ser atualizados aqui
    atualizarContadorSimples("attend-count", 5);
    atualizarContadorSimples("anamnese-count", 12);
    atualizarContadorSimples("encontros-count", 23);
    atualizarContadorSimples("relatorios-count", 8);
    atualizarContadorSimples("historico-count", 45);
}

/**
 * Atualiza um contador simples com um valor
 * @param {string} id - ID do elemento HTML
 * @param {number} valor - Valor a ser exibido
 */
function atualizarContadorSimples(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor.toString().padStart(3, '0');
    }
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