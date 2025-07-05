/**
 * Gerenciador de Anamneses - Sistema Psyclin
 * 
 * Este módulo gerencia todas as operações relacionadas a anamneses:
 * - Listagem com filtros e paginação
 * - Criação, edição e exclusão
 * - Estatísticas e dashboard
 * - Integração com API REST
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */

// Configuração da API
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    ENDPOINTS: {
        ANAMNESES: '/anamnese',
        ESTATISTICAS: '/anamnese/estatisticas',
        PACIENTES: '/paciente/ativos',
        PROFISSIONAIS: '/profissional/ativos'
    }
};

// Estado global do gerenciador
const AnamneseState = {
    anamneses: [],
    pacientes: [],
    profissionais: [],
    filtros: {
        busca: '',
        status: '',
        periodo: '',
        paciente: '',
        profissional: ''
    },
    paginacao: {
        paginaAtual: 1,
        itensPorPagina: 10,
        totalItens: 0,
        totalPaginas: 0
    },
    estatisticas: {
        total: 0,
        completas: 0,
        pendentes: 0,
        estaSemana: 0
    },
    loading: false,
    filtrosVisiveis: false
};

/**
 * Inicializa o gerenciador de anamneses
 */
async function initAnamneseManager() {
    try {
        console.log('🔄 Inicializando Gerenciador de Anamneses...');
        
        // Inicializar componentes da interface
        setupEventListeners();
        
        // Carregar dados iniciais (tolerante a erros individuais)
        const resultados = await Promise.allSettled([
            carregarEstatisticas(),
            carregarPacientes(),
            carregarProfissionais(),
            carregarAnamneses()
        ]);
        
        // Log dos resultados
        resultados.forEach((resultado, index) => {
            const funcoes = ['carregarEstatisticas', 'carregarPacientes', 'carregarProfissionais', 'carregarAnamneses'];
            if (resultado.status === 'fulfilled') {
                console.log(`✅ ${funcoes[index]} executada com sucesso`);
            } else {
                console.error(`❌ ${funcoes[index]} falhou:`, resultado.reason);
            }
        });
        
        console.log('✅ Gerenciador de Anamneses inicializado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar gerenciador:', error);
        
        // Criar sistema de notificação simples se não existir
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
        errorDiv.textContent = 'Erro ao carregar dados iniciais. Verifique a conexão com o servidor.';
        document.body.appendChild(errorDiv);
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

/**
 * Configura os event listeners da página
 */
function setupEventListeners() {
    // Botão Nova Anamnese
    const btnNovaAnamnese = document.getElementById('btn-nova-anamnese');
    if (btnNovaAnamnese) {
        btnNovaAnamnese.addEventListener('click', abrirModalNovaAnamnese);
        console.log('✅ Event listener configurado para botão Nova Anamnese');
    } else {
        console.warn('⚠️ Botão Nova Anamnese não encontrado');
    }
    
    // Toggle de filtros mobile
    setupToggleFiltros();
    
    // Filtros
    setupFiltros();
    
    // Paginação
    setupPaginacao();
    
    // Busca
    setupBusca();
    
    // Exportar
    setupExportar();
}

/**
 * Configura o toggle de filtros para mobile
 */
function setupToggleFiltros() {
    const toggleFiltros = document.getElementById('toggle-filtros');
    const filtrosContainer = document.getElementById('filtros-container');
    
    if (toggleFiltros && filtrosContainer) {
        toggleFiltros.addEventListener('click', () => {
            AnamneseState.filtrosVisiveis = !AnamneseState.filtrosVisiveis;
            
            if (AnamneseState.filtrosVisiveis) {
                filtrosContainer.classList.remove('hidden');
                filtrosContainer.classList.add('block');
                toggleFiltros.querySelector('i').style.transform = 'rotate(180deg)';
            } else {
                filtrosContainer.classList.add('hidden');
                filtrosContainer.classList.remove('block');
                toggleFiltros.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
        console.log('✅ Event listener configurado para toggle de filtros');
    }
}

/**
 * Configura os filtros da página
 */
function setupFiltros() {
    const filtroStatus = document.getElementById('filtro-status');
    const filtroPeriodo = document.getElementById('filtro-periodo');
    const filtroPaciente = document.getElementById('filtro-paciente');
    const filtroProfissional = document.getElementById('filtro-profissional');
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
    
    // Event listeners para filtros
    if (filtroStatus) {
        filtroStatus.addEventListener('change', (e) => {
            AnamneseState.filtros.status = e.target.value;
            AnamneseState.paginacao.paginaAtual = 1;
            carregarAnamneses();
        });
        console.log('✅ Event listener configurado para filtro de status');
    }
    
    if (filtroPeriodo) {
        filtroPeriodo.addEventListener('change', (e) => {
            AnamneseState.filtros.periodo = e.target.value;
            AnamneseState.paginacao.paginaAtual = 1;
            carregarAnamneses();
        });
        console.log('✅ Event listener configurado para filtro de período');
    }
    
    if (filtroPaciente) {
        filtroPaciente.addEventListener('change', (e) => {
            AnamneseState.filtros.paciente = e.target.value;
            AnamneseState.paginacao.paginaAtual = 1;
            carregarAnamneses();
        });
        console.log('✅ Event listener configurado para filtro de paciente');
    }
    
    if (filtroProfissional) {
        filtroProfissional.addEventListener('change', (e) => {
            AnamneseState.filtros.profissional = e.target.value;
            AnamneseState.paginacao.paginaAtual = 1;
            carregarAnamneses();
        });
        console.log('✅ Event listener configurado para filtro de profissional');
    }
    
    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', () => {
            AnamneseState.paginacao.paginaAtual = 1;
            carregarAnamneses();
        });
        console.log('✅ Event listener configurado para aplicar filtros');
    }
    
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', limparFiltros);
        console.log('✅ Event listener configurado para limpar filtros');
    }
}

/**
 * Configura a busca
 */
function setupBusca() {
    const inputBusca = document.getElementById('filtro-busca');
    const btnBuscar = document.getElementById('btn-aplicar-filtros');
    
    if (inputBusca) {
        // Busca em tempo real com debounce
        let timeoutId;
        inputBusca.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                AnamneseState.filtros.busca = e.target.value;
                AnamneseState.paginacao.paginaAtual = 1;
                carregarAnamneses();
            }, 500);
        });
        console.log('✅ Event listener configurado para busca');
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            if (inputBusca) {
                AnamneseState.filtros.busca = inputBusca.value;
                AnamneseState.paginacao.paginaAtual = 1;
                carregarAnamneses();
            }
        });
    }
}

/**
 * Configura a paginação
 */
function setupPaginacao() {
    // Event delegation para botões de paginação
    document.addEventListener('click', (e) => {
        if (e.target.closest('.pagination-btn')) {
            const btn = e.target.closest('.pagination-btn');
            const action = btn.dataset.action;
            
            switch (action) {
                case 'prev':
                    if (AnamneseState.paginacao.paginaAtual > 1) {
                        AnamneseState.paginacao.paginaAtual--;
                        carregarAnamneses();
                    }
                    break;
                case 'next':
                    if (AnamneseState.paginacao.paginaAtual < AnamneseState.paginacao.totalPaginas) {
                        AnamneseState.paginacao.paginaAtual++;
                        carregarAnamneses();
                    }
                    break;
                case 'page':
                    const pagina = parseInt(btn.dataset.page);
                    if (pagina !== AnamneseState.paginacao.paginaAtual) {
                        AnamneseState.paginacao.paginaAtual = pagina;
                        carregarAnamneses();
                    }
                    break;
            }
        }
    });
}

/**
 * Carrega as estatísticas das anamneses
 */
async function carregarEstatisticas() {
    try {
        console.log('📊 Carregando estatísticas...');
        
        // Primeiro tenta buscar as estatísticas no endpoint específico
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTATISTICAS}`);
            
            if (response.ok) {
                const resultado = await response.json();
                
                if (resultado.success && resultado.data) {
                    AnamneseState.estatisticas = resultado.data;
                    atualizarEstatisticasDOM();
                    console.log('✅ Estatísticas carregadas do endpoint específico');
                    return;
                }
            }
        } catch (apiError) {
            console.warn('⚠️ Endpoint de estatísticas não disponível, calculando manualmente...');
        }
        
        // Fallback: buscar todas as anamneses e calcular estatísticas
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANAMNESES}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        let anamneses = [];
        
        if (resultado.success && resultado.data) {
            anamneses = resultado.data;
        } else if (Array.isArray(resultado)) {
            anamneses = resultado;
        }
        
        // Calcular estatísticas manualmente
        const agora = new Date();
        const inicioSemana = new Date(agora.setDate(agora.getDate() - agora.getDay()));
        
        const estatisticas = {
            total: anamneses.length,
            completas: anamneses.filter(a => a.statusAnamnese === 'APROVADO').length,
            pendentes: anamneses.filter(a => a.statusAnamnese === 'PENDENTE').length,
            estaSemana: anamneses.filter(a => {
                const dataAnamnese = new Date(a.dataAplicacao || a.dataAnamnese);
                return dataAnamnese >= inicioSemana;
            }).length
        };
        
        AnamneseState.estatisticas = estatisticas;
        atualizarEstatisticasDOM();
        console.log('✅ Estatísticas calculadas manualmente:', estatisticas);
        
    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
        // Manter valores padrão em caso de erro
        AnamneseState.estatisticas = {
            total: 0,
            completas: 0,
            pendentes: 0,
            estaSemana: 0
        };
        atualizarEstatisticasDOM();
    }
}

/**
 * Atualiza as estatísticas na interface
 */
function atualizarEstatisticasDOM() {
    const stats = AnamneseState.estatisticas;
    
    // Atualizar cards de estatísticas usando IDs específicos
    const elementos = {
        total: document.getElementById('stat-total') || document.querySelector('[data-stat="total"]'),
        completas: document.getElementById('stat-completas') || document.querySelector('[data-stat="completas"]'),
        pendentes: document.getElementById('stat-pendentes') || document.querySelector('[data-stat="pendentes"]'),
        estaSemana: document.getElementById('stat-esta-semana') || document.querySelector('[data-stat="esta-semana"]')
    };
    
    // Atualizar valores se os elementos existirem
    if (elementos.total) elementos.total.textContent = stats.total || 0;
    if (elementos.completas) elementos.completas.textContent = stats.completas || 0;
    if (elementos.pendentes) elementos.pendentes.textContent = stats.pendentes || 0;
    if (elementos.estaSemana) elementos.estaSemana.textContent = stats.estaSemana || 0;
    
    console.log('📊 Estatísticas atualizadas na DOM:', stats);
}

/**
 * Atualiza as estatísticas na interface (função alternativa)
 */
function atualizarEstatisticasUI() {
    const stats = AnamneseState.estatisticas;
    
    // Atualizar cards de estatísticas usando IDs específicos
    const totalElement = document.getElementById('stat-total');
    const completasElement = document.getElementById('stat-completas');
    const pendentesElement = document.getElementById('stat-pendentes');
    const estaSemanaElement = document.getElementById('stat-esta-semana');
    
    if (totalElement) {
        totalElement.textContent = stats.total || 0;
    }
    
    if (completasElement) {
        completasElement.textContent = stats.completas || 0;
    }
    
    if (pendentesElement) {
        pendentesElement.textContent = stats.pendentes || 0;
    }
    
    if (estaSemanaElement) {
        estaSemanaElement.textContent = stats.estaSemana || 0;
    }
    
    console.log('✅ Estatísticas atualizadas na UI:', stats);
}

/**
 * Carrega a lista de pacientes ativos
 */
async function carregarPacientes() {
    try {
        console.log('👥 Carregando pacientes...');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PACIENTES}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.success && Array.isArray(resultado.data)) {
            AnamneseState.pacientes = resultado.data;
        } else if (Array.isArray(resultado)) {
            // Fallback para resposta direta como array
            AnamneseState.pacientes = resultado;
        } else {
            console.warn('⚠️ Formato de resposta inesperado para pacientes:', resultado);
            AnamneseState.pacientes = [];
        }
        
        popularFiltrosPacientes();
        console.log('✅ Pacientes carregados:', AnamneseState.pacientes.length);
        
    } catch (error) {
        console.error('❌ Erro ao carregar pacientes:', error);
        AnamneseState.pacientes = [];
    }
}

/**
 * Carrega a lista de profissionais ativos
 */
async function carregarProfissionais() {
    try {
        console.log('👨‍⚕️ Carregando profissionais...');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFISSIONAIS}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.success && Array.isArray(resultado.data)) {
            AnamneseState.profissionais = resultado.data;
        } else if (Array.isArray(resultado)) {
            // Fallback para resposta direta como array
            AnamneseState.profissionais = resultado;
        } else {
            console.warn('⚠️ Formato de resposta inesperado para profissionais:', resultado);
            AnamneseState.profissionais = [];
        }
        
        popularFiltrosProfissionais();
        console.log('✅ Profissionais carregados:', AnamneseState.profissionais.length);
        
    } catch (error) {
        console.error('❌ Erro ao carregar profissionais:', error);
        AnamneseState.profissionais = [];
    }
}

/**
 * Carrega a lista de anamneses com filtros aplicados
 */
async function carregarAnamneses() {
    try {
        mostrarLoader(true);
        console.log('📋 Carregando anamneses...');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANAMNESES}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        let anamneses = [];
        
        if (resultado.success && Array.isArray(resultado.data)) {
            anamneses = resultado.data;
        } else if (Array.isArray(resultado)) {
            // Fallback para resposta direta como array
            anamneses = resultado;
        } else {
            console.warn('⚠️ Formato de resposta inesperado para anamneses:', resultado);
            anamneses = [];
        }
        
        // Aplicar filtros
        anamneses = aplicarFiltros(anamneses);
        
        // Calcular paginação
        AnamneseState.paginacao.totalItens = anamneses.length;
        AnamneseState.paginacao.totalPaginas = Math.ceil(anamneses.length / AnamneseState.paginacao.itensPorPagina);
        
        // Aplicar paginação
        const inicio = (AnamneseState.paginacao.paginaAtual - 1) * AnamneseState.paginacao.itensPorPagina;
        const fim = inicio + AnamneseState.paginacao.itensPorPagina;
        AnamneseState.anamneses = anamneses.slice(inicio, fim);
        
        // Atualizar interface
        renderizarAnamneses();
        renderizarPaginacao();
        
        console.log('✅ Anamneses carregadas:', AnamneseState.anamneses.length);
        
    } catch (error) {
        console.error('❌ Erro ao carregar anamneses:', error);
        criarNotificacaoSimples('Erro ao carregar anamneses', 'error');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Aplica filtros à lista de anamneses
 */
function aplicarFiltros(anamneses) {
    let filtradas = [...anamneses];
    
    // Filtro por busca (nome do paciente)
    if (AnamneseState.filtros.busca) {
        const termo = AnamneseState.filtros.busca.toLowerCase();
        filtradas = filtradas.filter(anamnese => 
            anamnese.nomePaciente?.toLowerCase().includes(termo)
        );
    }
    
    // Filtro por status
    if (AnamneseState.filtros.status) {
        filtradas = filtradas.filter(anamnese => {
            const status = anamnese.statusAnamnese?.toLowerCase();
            switch (AnamneseState.filtros.status) {
                case 'completa':
                    return status === 'ativa';
                case 'pendente':
                    return status === 'pendente';
                case 'rascunho':
                    return status === 'rascunho';
                default:
                    return true;
            }
        });
    }
    
    // Filtro por período
    if (AnamneseState.filtros.periodo) {
        const hoje = new Date();
        filtradas = filtradas.filter(anamnese => {
            const dataAnamnese = new Date(anamnese.dataAplicacao);
            
            switch (AnamneseState.filtros.periodo) {
                case 'hoje':
                    return dataAnamnese.toDateString() === hoje.toDateString();
                case 'semana':
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                    return dataAnamnese >= inicioSemana;
                case 'mes':
                    return dataAnamnese.getMonth() === hoje.getMonth() && 
                           dataAnamnese.getFullYear() === hoje.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    return filtradas;
}

/**
 * Renderiza a lista de anamneses na interface
 */
function renderizarAnamneses() {
    const container = document.getElementById('lista-anamneses');
    
    if (!container) {
        console.error('❌ Container de anamneses não encontrado');
        return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    if (AnamneseState.anamneses.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900">Nenhuma anamnese encontrada</h3>
                <p class="mt-1">Não há anamneses que correspondam aos filtros aplicados.</p>
            </div>
        `;
        feather.replace();
        return;
    }
    
    // Renderizar anamneses
    AnamneseState.anamneses.forEach(anamnese => {
        const item = criarItemAnamnese(anamnese);
        container.appendChild(item);
    });
    
    // Atualizar ícones
    feather.replace();
    
    console.log(`✅ ${AnamneseState.anamneses.length} anamneses renderizadas`);
}

/**
 * Cria um elemento HTML para uma anamnese
 */
function criarItemAnamnese(anamnese) {
    const div = document.createElement('div');
    div.className = 'p-4 hover:bg-gray-50 transition-colors';
    
    // Gerar iniciais do paciente
    const iniciais = gerarIniciais(anamnese.nomePaciente || 'Sem Nome');
    
    // Determinar status e cor
    const { statusTexto, statusCor } = obterStatusInfo(anamnese.statusAnamnese);
    
    // Formatar data
    const dataFormatada = formatarData(anamnese.dataAplicacao);
    
    div.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                    ${iniciais}
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-900">${anamnese.nomePaciente || 'Nome não informado'}</h4>
                    <p class="text-sm text-gray-500">Profissional: ${anamnese.nomeProfissional || 'Não informado'}</p>
                    <p class="text-xs text-gray-400">Criada em ${dataFormatada}</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${statusCor}">
                    ${statusTexto}
                </span>
                <div class="flex space-x-1">
                    <button onclick="visualizarAnamnese(${anamnese.idAnamnese})" 
                            class="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                            title="Visualizar anamnese">
                        <i data-feather="eye" class="w-3.5 h-3.5"></i>
                        Ver
                    </button>
                    <button onclick="editarAnamnese(${anamnese.idAnamnese})" 
                            class="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                            title="Editar anamnese">
                        <i data-feather="edit" class="w-3.5 h-3.5"></i>
                        Editar
                    </button>
                    <button onclick="excluirAnamnese(${anamnese.idAnamnese})" 
                            class="bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                            title="Excluir anamnese">
                        <i data-feather="trash-2" class="w-3.5 h-3.5"></i>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * Gera iniciais a partir de um nome
 */
function gerarIniciais(nome) {
    return nome
        .split(' ')
        .map(parte => parte.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

/**
 * Obtém informações de status para exibição
 */
function obterStatusInfo(status) {
    switch (status?.toLowerCase()) {
        case 'ativa':
            return {
                statusTexto: 'Completa',
                statusCor: 'bg-green-100 text-green-800'
            };
        case 'pendente':
            return {
                statusTexto: 'Pendente',
                statusCor: 'bg-orange-100 text-orange-800'
            };
        case 'rascunho':
            return {
                statusTexto: 'Rascunho',
                statusCor: 'bg-gray-100 text-gray-800'
            };
        default:
            return {
                statusTexto: 'Indefinido',
                statusCor: 'bg-gray-100 text-gray-800'
            };
    }
}

/**
 * Formata uma data para exibição
 */
function formatarData(dataString) {
    if (!dataString) return 'Data não informada';
    
    try {
        // Se já está formatada como dd/mm/yyyy, retorna como está
        if (dataString.includes('/')) {
            return dataString;
        }
        
        // Caso contrário, formata a data
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    } catch (error) {
        return 'Data inválida';
    }
}

/**
 * Renderiza a paginação
 */
function renderizarPaginacao() {
    const containerPaginacao = document.getElementById('paginacao-container');
    
    if (!containerPaginacao) {
        console.error('❌ Container de paginação não encontrado');
        return;
    }
    
    const { paginaAtual, totalPaginas, totalItens, itensPorPagina } = AnamneseState.paginacao;
    
    // Calcular range de itens mostrados
    const inicio = totalItens > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
    const fim = Math.min(paginaAtual * itensPorPagina, totalItens);
    
    // Atualizar informações de paginação
    const elementoInicio = document.getElementById('pag-inicio');
    const elementoFim = document.getElementById('pag-fim');
    const elementoTotal = document.getElementById('pag-total');
    
    if (elementoInicio) elementoInicio.textContent = inicio;
    if (elementoFim) elementoFim.textContent = fim;
    if (elementoTotal) elementoTotal.textContent = totalItens;
    
    // Renderizar botões de paginação
    const containerBotoes = document.getElementById('paginacao-botoes');
    if (containerBotoes) {
        containerBotoes.innerHTML = gerarBotoesPaginacao();
        
        // Configurar event listeners dos botões
        setupEventsPaginacao(containerBotoes);
    }
    
    console.log(`✅ Paginação renderizada: ${inicio}-${fim} de ${totalItens}`);
}

/**
 * Configurar event listeners dos botões de paginação
 */
function setupEventsPaginacao(container) {
    container.addEventListener('click', (e) => {
        if (!e.target.classList.contains('pagination-btn')) return;
        
        const action = e.target.dataset.action;
        const page = parseInt(e.target.dataset.page);
        
        if (action === 'prev' && AnamneseState.paginacao.paginaAtual > 1) {
            AnamneseState.paginacao.paginaAtual--;
            carregarAnamneses();
        } else if (action === 'next' && AnamneseState.paginacao.paginaAtual < AnamneseState.paginacao.totalPaginas) {
            AnamneseState.paginacao.paginaAtual++;
            carregarAnamneses();
        } else if (action === 'page' && page) {
            AnamneseState.paginacao.paginaAtual = page;
            carregarAnamneses();
        }
    });
}

/**
 * Gera os botões de número das páginas
 */
function gerarBotoesPaginacao() {
    const { paginaAtual, totalPaginas } = AnamneseState.paginacao;
    
    if (totalPaginas <= 1) {
        return '<span class="text-sm text-gray-500">Página 1 de 1</span>';
    }
    
    let botoes = '';
    
    // Botão anterior
    botoes += `
        <button class="pagination-btn relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${paginaAtual === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                data-action="prev" ${paginaAtual === 1 ? 'disabled' : ''}>
            <i data-feather="chevron-left"></i>
        </button>
    `;
    
    // Mostrar no máximo 5 botões de página
    let inicio = Math.max(1, paginaAtual - 2);
    let fim = Math.min(totalPaginas, inicio + 4);
    
    // Ajustar se estivermos no final
    if (fim - inicio < 4) {
        inicio = Math.max(1, fim - 4);
    }
    
    for (let i = inicio; i <= fim; i++) {
        const ativo = i === paginaAtual;
        botoes += `
            <button class="pagination-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                ativo 
                    ? 'bg-[var(--zomp)] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
            }" data-action="page" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Botão próximo
    botoes += `
        <button class="pagination-btn relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${paginaAtual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}" 
                data-action="next" ${paginaAtual === totalPaginas ? 'disabled' : ''}>
            <i data-feather="chevron-right"></i>
        </button>
    `;
    
    return `<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">${botoes}</nav>`;
}

/**
 * Limpa todos os filtros aplicados
 */
function limparFiltros() {
    // Resetar estado dos filtros
    AnamneseState.filtros = {
        busca: '',
        status: '',
        periodo: '',
        paciente: '',
        profissional: ''
    };
    AnamneseState.paginacao.paginaAtual = 1;
    
    // Limpar campos da interface
    const inputBusca = document.getElementById('filtro-busca');
    const filtroStatus = document.getElementById('filtro-status');
    const filtroPeriodo = document.getElementById('filtro-periodo');
    const filtroPaciente = document.getElementById('filtro-paciente');
    const filtroProfissional = document.getElementById('filtro-profissional');
    
    if (inputBusca) inputBusca.value = '';
    if (filtroStatus) filtroStatus.value = '';
    if (filtroPeriodo) filtroPeriodo.value = '';
    if (filtroPaciente) filtroPaciente.value = '';
    if (filtroProfissional) filtroProfissional.value = '';
    
    console.log('🧹 Filtros limpos');
    
    // Recarregar anamneses
    carregarAnamneses();
}

/**
 * Configura a funcionalidade de exportar
 */
function setupExportar() {
    const btnExportar = document.getElementById('btn-exportar');
    
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarAnamneses);
        console.log('✅ Event listener configurado para exportar');
    }
}

/**
 * Exporta as anamneses filtradas para CSV
 */
function exportarAnamneses() {
    try {
        if (AnamneseState.anamneses.length === 0) {
            mostrarNotificacao('Nenhuma anamnese para exportar', 'warning');
            return;
        }
        
        const dados = AnamneseState.anamneses.map(anamnese => ({
            'ID': anamnese.idAnamnese,
            'Paciente': anamnese.nomePaciente || 'N/A',
            'Profissional': anamnese.nomeProfissional || 'N/A',
            'Data': anamnese.dataAplicacao || 'N/A',
            'Status': anamnese.statusAnamnese || 'N/A',
            'Responsável': anamnese.nomeResponsavel || 'N/A',
            'CPF Responsável': anamnese.cpfResponsavel || 'N/A',
            'Autorização': anamnese.autorizacaoVisualizacao ? 'Sim' : 'Não',
            'Observações': anamnese.observacoes || 'N/A'
        }));
        
        const csv = converterParaCSV(dados);
        baixarCSV(csv, `anamneses_${new Date().toISOString().slice(0, 10)}.csv`);
        
        mostrarNotificacao('Anamneses exportadas com sucesso', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao exportar anamneses:', error);
        mostrarNotificacao('Erro ao exportar anamneses', 'error');
    }
}

/**
 * Converte dados para formato CSV
 */
function converterParaCSV(dados) {
    const headers = Object.keys(dados[0]);
    const csvContent = [
        headers.join(','),
        ...dados.map(row => 
            headers.map(field => {
                const value = row[field];
                // Escapar vírgulas e aspas
                return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

/**
 * Baixa o arquivo CSV
 */
function baixarCSV(csvContent, filename) {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Popula o filtro de pacientes
 */
function popularFiltrosPacientes() {
    const filtroPaciente = document.getElementById('filtro-paciente');
    if (!filtroPaciente) return;
    
    // Limpar opções existentes (exceto a primeira)
    const primeiraOpcao = filtroPaciente.querySelector('option[value=""]');
    filtroPaciente.innerHTML = '';
    if (primeiraOpcao) {
        filtroPaciente.appendChild(primeiraOpcao);
    } else {
        const opcaoPadrao = document.createElement('option');
        opcaoPadrao.value = '';
        opcaoPadrao.textContent = 'Todos os pacientes';
        filtroPaciente.appendChild(opcaoPadrao);
    }
    
    // Adicionar pacientes
    AnamneseState.pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.idPaciente;
        option.textContent = paciente.nomePessoa;
        filtroPaciente.appendChild(option);
    });
    
    console.log(`✅ ${AnamneseState.pacientes.length} pacientes carregados no filtro`);
}

/**
 * Popula o filtro de profissionais
 */
function popularFiltrosProfissionais() {
    const filtroProfissional = document.getElementById('filtro-profissional');
    if (!filtroProfissional) return;
    
    // Limpar opções existentes (exceto a primeira)
    const primeiraOpcao = filtroProfissional.querySelector('option[value=""]');
    filtroProfissional.innerHTML = '';
    if (primeiraOpcao) {
        filtroProfissional.appendChild(primeiraOpcao);
    } else {
        const opcaoPadrao = document.createElement('option');
        opcaoPadrao.value = '';
        opcaoPadrao.textContent = 'Todos os profissionais';
        filtroProfissional.appendChild(opcaoPadrao);
    }
    
    // Adicionar profissionais
    AnamneseState.profissionais.forEach(profissional => {
        const option = document.createElement('option');
        option.value = profissional.idProfissional;
        option.textContent = profissional.nomePessoa;
        filtroProfissional.appendChild(option);
    });
    
    console.log(`✅ ${AnamneseState.profissionais.length} profissionais carregados no filtro`);
}

// Exportar funções para uso global
window.AnamneseManager = {
    init: initAnamneseManager,
    carregarAnamneses,
    carregarEstatisticas
};

/**
 * Mostra ou oculta o loader da página
 */
function mostrarLoader(mostrar) {
    const loader = document.getElementById('loader-anamneses') || 
                   document.querySelector('.loader') ||
                   document.querySelector('[data-loader]');
    
    if (loader) {
        if (mostrar) {
            loader.classList.remove('hidden');
            loader.classList.add('flex');
        } else {
            loader.classList.add('hidden');
            loader.classList.remove('flex');
        }
    }
}

/**
 * Cria uma notificação simples
 */
function criarNotificacaoSimples(mensagem, tipo = 'info') {
    // Remove notificações existentes
    const existentes = document.querySelectorAll('.notificacao-temp');
    existentes.forEach(n => n.remove());
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao-temp fixed top-4 right-4 p-4 rounded-lg text-white z-50 max-w-sm ${
        tipo === 'error' ? 'bg-red-500' : 
        tipo === 'success' ? 'bg-green-500' : 
        tipo === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.parentNode.removeChild(notificacao);
        }
    }, 5000);
}

// Funções globais para os botões (serão implementadas em anamnese.js)
window.visualizarAnamnese = function(id) {
    console.log('Visualizar anamnese:', id);
    // Implementar em anamnese.js
};

window.editarAnamnese = function(id) {
    console.log('Editar anamnese:', id);
    // Implementar em anamnese.js
};

window.excluirAnamnese = function(id) {
    console.log('Excluir anamnese:', id);
    // Implementar em anamnese.js
};

window.abrirModalNovaAnamnese = function() {
    console.log('Abrir modal nova anamnese');
    // Implementar em anamnese.js
};

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initAnamneseManager);
