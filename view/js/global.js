/**
 * @fileoverview Script global para aplicações do Psyclin
 * @version 1.1.0
 * @author Matheus Assunção
 */

/**
 * Inicializa a API e configura o dashboard
 */




function inicializarAPI() {
    const endpointsDashboard = {
        profissionais: "http://localhost:8080/profissional/status/1",
        atender: "http://localhost:8080/consulta/status/1",
        anamnese: "http://localhost:8080/paciente/status/1",
        encontros: "http://localhost:8080/atendimento/status/1",
        relatorios: "http://localhost:8080/relatorio/status/1",
        historico: "http://localhost:8080/historico/status/1"
    };

    const endpointsCadastro = {
        doutor: "http://localhost:8080/profissional",
        admin: "http://localhost:8080/admin",
        paciente: "http://localhost:8080/paciente",
        anamnese: "http://localhost:8080/anamnese",
        relatorio: "http://localhost:8080/relatorio",
    }

    // Configura o dashboard com os dados da API
    configurarDashboard(endpointsDashboard);
    configurarCadastro(endpointsCadastro);
}

/**
 * Configura o dashboard com os dados obtidos da API
 * @param {Object} endpointsCadastro - URLs dos endpoints da API
 */
function configurarCadastro(endpoints) {
    // Estado dos dados carregados
    let dadosCarregados = {
        doutor: [],
        admin: [],
        paciente: [],
        anamnese: [],
        relatorio: []
    };

    // Tipo de conteúdo sendo exibido atualmente
    let tipoConteudoAtual = null;

    // Mapeia os botões aos seus handlers
    const botoes = {
        'DOUTOR': carregarDoutores,
        'ADMIN': carregarAdmins,
        'PACIENTE': carregarPacientes,
        'ANAMNESE': carregarAnamneses,
        'RELATORIO': carregarRelatorios,
        'ADD MEMBRO': abrirModalAddMembro
    };

    // Adiciona listeners a todos os botões
    document.querySelectorAll('.main-button').forEach(botao => {
        const texto = botao.textContent.trim();
        const handler = botoes[texto];

        if (handler) {
            botao.addEventListener('click', handler);
            console.log(`Controlador adicionado para botão: ${texto}`);
        }
    });



}

/**
 * Configura o dashboard com os dados obtidos da API
 * @param {Object} endpointsDashboard - URLs dos endpoints da API
 */
function configurarDashboard(endpoints) {
    // Mostra o loader
    mostrarLoader(true);

    // Mapeia os IDs dos contadores no DOM
    const contadores = {
        profissionais: "active-professionals-count",
        atender: "attend-count",
        anamnese: "anamnese-count",
        encontros: "encontros-count",
        relatorios: "relatorios-count",
        historico: "historico-count"
    };

    // Para cada endpoint, busca os dados e atualiza o contador
    Object.keys(endpoints).forEach(tipo => {
        const url = endpoints[tipo];
        const contadorId = contadores[tipo];

        buscarDadosAPI(url)
            .then(dados => {
                atualizarContador(contadorId, dados);
            })
            .catch(erro => {
                console.error(`Erro ao buscar dados de ${tipo}:`, erro);
                document.getElementById(contadorId).textContent = "Erro";
            });
    });

    // Depois de 1 segundo, esconde o loader (tempo para as requisições)
    setTimeout(() => {
        mostrarLoader(false);
    }, 1000);
}

/**
 * Busca dados de um endpoint da API
 * @param {string} url - URL do endpoint
 * @returns {Promise} Promise com o resultado da requisição
 */
function buscarDadosAPI(url) {
    console.log(`Iniciando requisição para: ${url}`);
    return fetch(url)
        .then(response => {
            console.log(`Resposta recebida de ${url}:`, response);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Dados recebidos de ${url}:`, data);
            // Verifica se os dados estão vazios
            if (!data) {
                throw new Error('Dados vazios recebidos da API');
            }
            return data;
        })
        .catch(erro => {
            console.error(`Erro ao buscar dados de ${url}:`, erro);
            throw erro;
        });
}

/**
 * Atualiza o contador no card com o valor adequado
 * @param {string} contadorId - ID do elemento contador no DOM
 * @param {Array|Object} dados - Dados obtidos da API
 */
function atualizarContador(contadorId, dados) {
    console.log(`Atualizando contador ${contadorId} com dados:`, dados);

    const elemento = document.getElementById(contadorId);
    if (!elemento) {
        console.error(`Elemento com ID ${contadorId} não encontrado. Verifique se o ID existe no HTML.`);
        return;
    }

    // Determina o valor a ser exibido com base nos dados
    let valor = 0;

    try {
        if (Array.isArray(dados)) {
            valor = dados.length;
            console.log(`Dados é um array com tamanho ${valor}`);
        } else if (typeof dados === 'object' && dados !== null) {
            // Tenta diferentes propriedades comuns
            valor = dados.total || dados.quantidade || dados.count ||
                dados.length || dados.size || Object.keys(dados).length;
            console.log(`Dados é um objeto. Valor encontrado: ${valor}`);
        } else if (typeof dados === 'number') {
            valor = dados;
            console.log(`Dados é um número: ${valor}`);
        }
    } catch (erro) {
        console.error(`Erro ao processar dados para ${contadorId}:`, erro);
    }

    // Garante que valor seja um número
    valor = Number(valor) || 0;

    // Formata o valor para exibição
    const valorFormatado = valor < 100 ? valor.toString().padStart(3, '0') : valor;
    console.log(`Valor formatado para ${contadorId}: ${valorFormatado}`);

    // Atualiza o texto do elemento
    elemento.textContent = valorFormatado;

    // Adiciona uma classe de transição para efeito visual
    elemento.classList.add('atualizado');
    setTimeout(() => {
        elemento.classList.remove('atualizado');
    }, 1000);
}

/**
 * Mostra ou esconde o loader
 * @param {boolean} mostrar - Se true, mostra o loader; se false, esconde
 */
function mostrarLoader(mostrar) {
    const loader = document.querySelector('.loader');
    if (loader) {
        if (mostrar) {
            loader.classList.remove('hidden');
        } else {
            loader.classList.add('hidden');
        }
    }
}

/**
 * Atualiza manualmente o dashboard
 */
function atualizarDashboard() {
    inicializarAPI();
}

// Inicializa a API quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializarAPI();

    // Configura a atualização automática a cada 5 minutos
    setInterval(inicializarAPI, 5 * 60 * 1000);
});