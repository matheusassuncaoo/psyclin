/**
 * @fileoverview Script principal da página de Pacientes - Psyclin
 * Gerencia a interface e interações da página de listagem de pacientes
 * @version 1.0.0
 * @author Sistema Psyclin
 */

import { pacienteManager } from './pacienteManager.js';

// Elementos DOM
let elementosDOM = {};

/**
 * Inicialização quando DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏥 Inicializando página de Pacientes...');
    
    // Inicializar ícones primeiro
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Mapear elementos DOM
    mapearElementosDOM();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Carregar dados iniciais
    await carregarDadosIniciais();
});

/**
 * Mapeia elementos DOM para variáveis
 */
function mapearElementosDOM() {
    elementosDOM = {
        // Campos de estatísticas
        totalPacientes: document.getElementById('total-pacientes'),
        pacientesAtivos: document.getElementById('pacientes-ativos'),
        consultasHoje: document.getElementById('consultas-hoje'),
        pacientesPendentes: document.getElementById('pacientes-pendentes'),
        
        // Elementos de filtro
        inputBusca: document.getElementById('filtro-busca'),
        selectStatus: document.getElementById('filtro-status'),
        selectOrdenacao: document.getElementById('filtro-ordenacao'),
        btnPesquisar: document.getElementById('btn-pesquisar'),
        btnLimpar: document.getElementById('btn-limpar'),
        
        // Barra de pesquisa do header
        inputPesquisaHeader: document.querySelector('#search-bar input'),
        inputPesquisaMobile: document.querySelector('#mobile-search-bar input'),
        
        // Tabela e paginação
        tbody: document.getElementById('tabela-pacientes'),
        infoPaginacao: document.querySelector('.text-sm.text-gray-700'),
        paginacao: document.querySelector('nav[class*="inline-flex"]'),
        
        // Botões de ação
        btnNovoPaciente: document.getElementById('btn-novo-paciente'),
        
        // Loader
        loader: document.getElementById('loader-pacientes')
    };
    
    console.log('📍 Elementos DOM mapeados:', Object.keys(elementosDOM).length);
}

/**
 * Configura todos os event listeners
 */
function configurarEventListeners() {
    // Filtros
    if (elementosDOM.inputBusca) {
        elementosDOM.inputBusca.addEventListener('input', debounce(aplicarFiltroBusca, 300));
    }
    
    if (elementosDOM.selectStatus) {
        elementosDOM.selectStatus.addEventListener('change', aplicarFiltroStatus);
    }
    
    if (elementosDOM.selectOrdenacao) {
        elementosDOM.selectOrdenacao.addEventListener('change', aplicarOrdenacao);
    }
    
    if (elementosDOM.btnPesquisar) {
        elementosDOM.btnPesquisar.addEventListener('click', aplicarFiltros);
    }
    
    if (elementosDOM.btnLimpar) {
        elementosDOM.btnLimpar.addEventListener('click', limparFiltros);
    }
    
    // Barra de pesquisa do header
    if (elementosDOM.inputPesquisaHeader) {
        elementosDOM.inputPesquisaHeader.addEventListener('input', debounce(aplicarFiltroBusca, 300));
    }
    
    if (elementosDOM.inputPesquisaMobile) {
        elementosDOM.inputPesquisaMobile.addEventListener('input', debounce(aplicarFiltroBusca, 300));
    }
    
    // Botão novo paciente
    if (elementosDOM.btnNovoPaciente) {
        elementosDOM.btnNovoPaciente.addEventListener('click', () => {
            window.location.href = '/view/html/cadastro/cadastrarpaciente.html';
        });
    }
    
    console.log('🔗 Event listeners configurados');
}

/**
 * Carrega dados iniciais da página
 */
async function carregarDadosIniciais() {
    try {
        mostrarLoader(true);
        
        console.log('⏳ Carregando dados dos pacientes...');
        await pacienteManager.carregarPacientes();
        
        // Renderizar interface
        renderizarEstatisticas();
        renderizarTabela();
        renderizarPaginacao();
        
        console.log('✅ Dados carregados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar dados dos pacientes. Tente novamente.');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Renderiza as estatísticas dos pacientes
 */
function renderizarEstatisticas() {
    const stats = pacienteManager.estatisticas;
    
    // Atualizar estatísticas usando os IDs específicos
    if (elementosDOM.totalPacientes) {
        elementosDOM.totalPacientes.textContent = stats.total;
        elementosDOM.totalPacientes.classList.add('animate-pulse');
        setTimeout(() => elementosDOM.totalPacientes.classList.remove('animate-pulse'), 1000);
    }
    
    if (elementosDOM.pacientesAtivos) {
        elementosDOM.pacientesAtivos.textContent = stats.ativos;
        elementosDOM.pacientesAtivos.classList.add('animate-pulse');
        setTimeout(() => elementosDOM.pacientesAtivos.classList.remove('animate-pulse'), 1000);
    }
    
    if (elementosDOM.consultasHoje) {
        elementosDOM.consultasHoje.textContent = stats.consultasHoje;
        elementosDOM.consultasHoje.classList.add('animate-pulse');
        setTimeout(() => elementosDOM.consultasHoje.classList.remove('animate-pulse'), 1000);
    }
    
    if (elementosDOM.pacientesPendentes) {
        elementosDOM.pacientesPendentes.textContent = stats.pendentes;
        elementosDOM.pacientesPendentes.classList.add('animate-pulse');
        setTimeout(() => elementosDOM.pacientesPendentes.classList.remove('animate-pulse'), 1000);
    }
    
    console.log('📊 Estatísticas renderizadas:', stats);
}

/**
 * Renderiza a tabela de pacientes
 */
function renderizarTabela() {
    if (!elementosDOM.tbody) {
        console.warn('⚠️ Elemento tbody não encontrado');
        return;
    }
    
    const pacientes = pacienteManager.obterPacientesPaginaAtual();
    
    if (pacientes.length === 0) {
        elementosDOM.tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <i data-feather="users" class="w-16 h-16 mb-4 text-gray-300"></i>
                        <p class="text-lg font-medium text-gray-400">Nenhum paciente encontrado</p>
                        <p class="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou cadastre um novo paciente</p>
                    </div>
                </td>
            </tr>
        `;
        feather.replace();
        return;
    }
    
    const html = pacientes.map(paciente => {
        const dadosFormatados = pacienteManager.formatarPaciente(paciente);
        const coresAvatar = ['bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-slate-500', 'bg-zinc-500'];
        const corAvatar = coresAvatar[Math.floor(Math.random() * coresAvatar.length)];
        
        return `
            <tr class="hover:bg-gray-50 transition-colors duration-200" data-paciente-id="${dadosFormatados.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full ${corAvatar} flex items-center justify-center text-white font-semibold">
                                ${dadosFormatados.avatar}
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${dadosFormatados.nome}</div>
                            <div class="text-sm text-gray-500">${dadosFormatados.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dadosFormatados.idade}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dadosFormatados.telefone}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dadosFormatados.status.classe}">
                        ${dadosFormatados.status.texto}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dadosFormatados.ultimaConsulta}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 btn-visualizar" 
                            title="Ver detalhes" data-id="${dadosFormatados.id}">
                        <i data-feather="eye" class="w-3.5 h-3.5"></i>
                        Detalhes
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    elementosDOM.tbody.innerHTML = html;
    
    // Renderizar ícones
    feather.replace();
    
    // Configurar event listeners para botões de ação
    configurarBotoesAcao();
    
    console.log(`📋 Tabela renderizada com ${pacientes.length} pacientes`);
}

/**
 * Renderiza a paginação
 */
function renderizarPaginacao() {
    const info = pacienteManager.obterInfoPaginacao();
    
    // Atualizar informações de paginação
    if (elementosDOM.infoPaginacao) {
        elementosDOM.infoPaginacao.innerHTML = `
            Mostrando <span class="font-medium">${info.inicio}</span> a 
            <span class="font-medium">${info.fim}</span> de 
            <span class="font-medium">${info.total}</span> resultados
        `;
    }
    
    // Atualizar navegação de páginas
    if (elementosDOM.paginacao && info.totalPaginas > 1) {
        const html = gerarHtmlPaginacao(info);
        elementosDOM.paginacao.innerHTML = html;
        feather.replace();
        configurarEventListenersPaginacao();
    }
}

/**
 * Gera HTML da paginação
 */
function gerarHtmlPaginacao(info) {
    let html = `
        <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 btn-pagina-anterior" 
                ${!info.temAnterior ? 'disabled' : ''}>
            <i data-feather="chevron-left"></i>
        </button>
    `;
    
    // Páginas numeradas
    for (let i = 1; i <= info.totalPaginas; i++) {
        if (i === info.paginaAtual) {
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-[var(--zomp)] text-sm font-medium text-white">
                    ${i}
                </button>
            `;
        } else if (i <= 3 || i > info.totalPaginas - 3 || Math.abs(i - info.paginaAtual) <= 1) {
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 btn-pagina" 
                        data-pagina="${i}">
                    ${i}
                </button>
            `;
        } else if (i === 4 && info.paginaAtual > 5) {
            html += `<span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>`;
        } else if (i === info.totalPaginas - 3 && info.paginaAtual < info.totalPaginas - 4) {
            html += `<span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>`;
        }
    }
    
    html += `
        <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 btn-proxima-pagina" 
                ${!info.temProximo ? 'disabled' : ''}>
            <i data-feather="chevron-right"></i>
        </button>
    `;
    
    return html;
}

/**
 * Configura event listeners dos botões de ação
 */
function configurarBotoesAcao() {
    // Visualizar/Detalhes
    document.querySelectorAll('.btn-visualizar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            console.log('👁️ Ver detalhes do paciente:', id);
            mostrarDetalhesPaciente(id);
        });
    });
}

/**
 * Configura event listeners da paginação
 */
function configurarEventListenersPaginacao() {
    // Página anterior
    document.querySelector('.btn-pagina-anterior')?.addEventListener('click', () => {
        pacienteManager.paginaAnterior();
        renderizarTabela();
        renderizarPaginacao();
    });
    
    // Próxima página
    document.querySelector('.btn-proxima-pagina')?.addEventListener('click', () => {
        pacienteManager.proximaPagina();
        renderizarTabela();
        renderizarPaginacao();
    });
    
    // Páginas específicas
    document.querySelectorAll('.btn-pagina').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pagina = parseInt(e.currentTarget.dataset.pagina);
            pacienteManager.irParaPagina(pagina);
            renderizarTabela();
            renderizarPaginacao();
        });
    });
}

/**
 * Aplica filtro de busca
 */
function aplicarFiltroBusca(event) {
    const termo = event.target.value;
    pacienteManager.definirFiltroBusca(termo);
    renderizarTabela();
    renderizarPaginacao();
    
    // Sincronizar barras de pesquisa
    if (event.target !== elementosDOM.inputPesquisaHeader) {
        elementosDOM.inputPesquisaHeader.value = termo;
    }
    if (event.target !== elementosDOM.inputPesquisaMobile) {
        elementosDOM.inputPesquisaMobile.value = termo;
    }
    if (event.target !== elementosDOM.inputBusca) {
        elementosDOM.inputBusca.value = termo;
    }
}

/**
 * Aplica filtro de status
 */
function aplicarFiltroStatus(event) {
    const status = event.target.value;
    pacienteManager.definirFiltroStatus(status);
    renderizarTabela();
    renderizarPaginacao();
}

/**
 * Aplica ordenação
 */
function aplicarOrdenacao(event) {
    const ordenacao = event.target.value;
    pacienteManager.definirOrdenacao(ordenacao);
    renderizarTabela();
    renderizarPaginacao();
}

/**
 * Aplica todos os filtros
 */
function aplicarFiltros() {
    renderizarTabela();
    renderizarPaginacao();
}

/**
 * Limpa todos os filtros
 */
function limparFiltros() {
    pacienteManager.limparFiltros();
    
    // Limpar campos da interface
    if (elementosDOM.inputBusca) elementosDOM.inputBusca.value = '';
    if (elementosDOM.inputPesquisaHeader) elementosDOM.inputPesquisaHeader.value = '';
    if (elementosDOM.inputPesquisaMobile) elementosDOM.inputPesquisaMobile.value = '';
    if (elementosDOM.selectStatus) elementosDOM.selectStatus.value = '';
    if (elementosDOM.selectOrdenacao) elementosDOM.selectOrdenacao.value = 'nome';
    
    renderizarTabela();
    renderizarPaginacao();
}

/**
 * Mostra detalhes do paciente em modal minimalista
 */
function mostrarDetalhesPaciente(id) {
    const paciente = pacienteManager.pacientes.find(p => p.idPaciente == id);
    if (!paciente) {
        mostrarErro('Paciente não encontrado');
        return;
    }

    const dadosFormatados = pacienteManager.formatarPaciente(paciente);
    
    // Criar modal minimalista
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Detalhes do Paciente</h3>
                    <button class="text-gray-400 hover:text-gray-600 transition-colors" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                            ${dadosFormatados.avatar}
                        </div>
                        <div>
                            <h4 class="text-xl font-medium text-gray-900">${dadosFormatados.nome}</h4>
                            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${dadosFormatados.status.classe}">
                                ${dadosFormatados.status.texto}
                            </span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-500">Email:</span>
                            <span class="text-sm text-gray-900">${dadosFormatados.email}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-500">Telefone:</span>
                            <span class="text-sm text-gray-900">${dadosFormatados.telefone}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-500">CPF:</span>
                            <span class="text-sm text-gray-900">${dadosFormatados.cpf}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-500">Idade:</span>
                            <span class="text-sm text-gray-900">${dadosFormatados.idade}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-500">Última Consulta:</span>
                            <span class="text-sm text-gray-900">${dadosFormatados.ultimaConsulta}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Fechar modal ao clicar no fundo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

/**
 * Mostra/oculta loader
 */
function mostrarLoader(mostrar) {
    if (elementosDOM.loader) {
        if (mostrar) {
            elementosDOM.loader.classList.remove('hidden');
        } else {
            elementosDOM.loader.classList.add('hidden');
        }
    }
}

/**
 * Mostra mensagem de erro
 */
function mostrarErro(mensagem) {
    console.error('❌', mensagem);
    // Sistema de notificação simples para erros
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/**
 * Mostra mensagem de sucesso
 */
function mostrarSucesso(mensagem) {
    console.log('✅', mensagem);
    // Sistema de notificação simples para sucesso
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Mostra mensagem informativa
 */
function mostrarInfo(mensagem) {
    console.log('ℹ️', mensagem);
    // Sistema de notificação simples
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Debounce para otimizar pesquisa
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para refresh manual dos dados (útil para desenvolvimento)
window.refreshPacientes = async () => {
    console.log('🔄 Refresh manual dos pacientes...');
    await pacienteManager.forcarRefresh();
    renderizarEstatisticas();
    renderizarTabela();
    renderizarPaginacao();
};

// Exportar para debug
window.pacienteManager = pacienteManager;
