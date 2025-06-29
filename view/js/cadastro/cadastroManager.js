/**
 * @fileoverview Gerenciador do sistema de cadastro do Psyclin
 * Controla exibição, edição e solicitações de exclusão de dados
 * @version 1.0
 * @author Sistema Psyclin
 */

import { 
    pegarPacientes, 
    pegarProfissionais,
    pegarAnamneses,
    pegarProntuarios,
    atualizarProfissional,
    excluirProfissional,
    atualizarPaciente,
    excluirPaciente,
    buscarProfissionalPorId,
    buscarPacientePorId,
    solicitarExclusao
} from '../services/apiManager.js';

// Estado global do cadastro
const cadastroState = {
    currentData: [],
    currentType: null,
    editingItem: null,
    gridContainer: null
};

// Configurações para cada tipo de dados - corrigidas com fallbacks
const dataConfigs = {
    PROFISSIONAIS: {
        endpoint: 'profissionais',
        apiFunction: pegarProfissionais,
        title: 'Profissionais Cadastrados',
        icon: 'users',
        columns: ['ID', 'Nome', 'Registro', 'Conselho', 'Especialidade', 'Status', 'Ações'],
        columnsMinimal: ['Nome', 'Status', 'Ações'], // Para mobile
        fields: ['idProfissional', 'nomePessoa', 'codigoProfissional', 'conselhoProfissional', 'tipoProfissional', 'statusProfissional', 'actions'],
        fieldsMinimal: ['nomePessoa', 'statusProfissional', 'actions'], // Para mobile
        editableFields: ['nomePessoa', 'codigoProfissional', 'conselhoProfissional'],
        searchField: 'nomePessoa'
    },
    ADMIN: {
        endpoint: 'profissionais',
        apiFunction: pegarProfissionais,
        title: 'Administradores',
        icon: 'shield',
        columns: ['ID', 'Nome', 'Registro', 'Permissões', 'Status', 'Ações'],
        columnsMinimal: ['Nome', 'Status', 'Ações'],
        fields: ['idProfissional', 'nomePessoa', 'codigoProfissional', 'tipoProfissional', 'statusProfissional', 'actions'],
        fieldsMinimal: ['nomePessoa', 'statusProfissional', 'actions'],
        filter: (item) => item.tipoProfissional === 1, // Apenas administradores
        editableFields: ['nomePessoa', 'codigoProfissional'],
        searchField: 'nomePessoa'
    },
    PACIENTE: {
        endpoint: 'pacientes',
        apiFunction: pegarPacientes,
        title: 'Pacientes Cadastrados',
        icon: 'user-plus',
        columns: ['ID', 'Nome', 'CPF', 'Telefone', 'Email', 'Status', 'Ações'],
        columnsMinimal: ['Nome', 'Status', 'Ações'],
        fields: ['idPaciente', 'nomePessoa', 'cpfPessoa', 'telefone', 'email', 'statusPaciente', 'actions'],
        fieldsMinimal: ['nomePessoa', 'statusPaciente', 'actions'],
        editableFields: ['nomePessoa', 'telefone', 'email'],
        searchField: 'nomePessoa'
    },
    ANAMNESE: {
        endpoint: 'anamneses',
        apiFunction: pegarAnamneses,
        title: 'Anamneses',
        icon: 'file-text',
        columns: ['ID', 'Paciente', 'Profissional', 'Data', 'Status', 'Ações'],
        columnsMinimal: ['Paciente', 'Status', 'Ações'],
        fields: ['idAnamnese', 'nomeResponsavel', 'nomeProfissional', 'dataAplicacao', 'statusAnamnese', 'actions'],
        fieldsMinimal: ['nomeResponsavel', 'statusAnamnese', 'actions'],
        editableFields: [],
        searchField: 'nomeResponsavel'
    },
    RELATORIO: {
        endpoint: 'prontuarios',
        apiFunction: pegarProntuarios,
        title: 'Relatórios/Prontuários',
        icon: 'clipboard',
        columns: ['ID', 'Paciente', 'Profissional', 'Data', 'Procedimento', 'Ações'],
        columnsMinimal: ['Paciente', 'Status', 'Ações'],
        fields: ['idProntuario', 'nomePaciente', 'nomeProfissional', 'dataProcedimento', 'nomeProcedimento', 'actions'],
        fieldsMinimal: ['nomePaciente', 'statusProntuario', 'actions'],
        editableFields: ['descricaoProntuario'],
        searchField: 'nomePaciente'
    }
};

/**
 * Inicializa o sistema de cadastro
 */
function initCadastroManager() {
    console.log('🚀 Inicializando CadastroManager...');
    
    cadastroState.gridContainer = document.getElementById('grid-container');
    
    if (!cadastroState.gridContainer) {
        console.error('❌ Container grid-container não encontrado!');
        return;
    }

    setupButtonListeners();
    console.log('✅ CadastroManager inicializado com sucesso!');
}

/**
 * Configura os event listeners dos botões
 */
function setupButtonListeners() {
    const buttons = document.querySelectorAll('.main-button');
    
    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        
        if (dataConfigs[buttonText]) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                loadDataType(buttonText);
            });
            console.log(`✅ Listener configurado para: ${buttonText}`);
        }
    });
}

/**
 * Carrega dados de um tipo específico
 */
async function loadDataType(type) {
    try {
        console.log(`⚡ Carregando dados: ${type}`);
        const startTime = performance.now();
        showLoader(true);
        
        // Remove seleção ativa de outros botões
        document.querySelectorAll('.main-button').forEach(btn => {
            btn.classList.remove('!bg-emerald-700', 'ring-2', 'ring-emerald-300');
        });
        
        // Adiciona seleção no botão atual
        event.target.classList.add('!bg-emerald-700', 'ring-2', 'ring-emerald-300');
        
        const config = dataConfigs[type];
        cadastroState.currentType = type;
        
        // Tenta obter dados do cache
        let data = cadastroCache.get(type);
        
        if (!data) {
            console.log(`🌐 Cache miss - buscando da API...`);
            // Busca dados da API
            data = await config.apiFunction();
            
            // Salva no cache
            cadastroCache.set(type, data);
        } else {
            console.log(`� Dados obtidos do cache`);
        }
        
        // Debug: log otimizado
        console.log(`� ${data?.length || 0} registros para ${type}`);
        
        // Aplica filtro se necessário
        if (config.filter) {
            const originalLength = data.length;
            data = data.filter(config.filter);
            console.log(`🔧 Filtro aplicado: ${originalLength} -> ${data.length} registros`);
        }
        
        cadastroState.currentData = data;
        
        // Renderiza a tabela
        renderDataTable(data, config);
        
        const endTime = performance.now();
        console.log(`✅ ${data.length} registros carregados em ${(endTime - startTime).toFixed(2)}ms`);
        
    } catch (error) {
        console.error(`❌ Erro ao carregar ${type}:`, error);
        showError(`Erro ao carregar dados de ${type}: ${error.message}`);
    } finally {
        showLoader(false);
    }
}

/**
 * Renderiza a tabela de dados
 */
function renderDataTable(data, config) {
    const container = cadastroState.gridContainer;
    const responsiveConfig = getResponsiveConfig(config);
    
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Header minimalista -->
            <div class="bg-[var(--zomp)] text-white p-4">
                <div class="flex flex-col space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i data-feather="${config.icon}" class="w-5 h-5"></i>
                            <h2 class="text-lg font-semibold">${config.title}</h2>
                            <span class="bg-white/20 px-2 py-1 rounded-full text-xs">
                                ${data.length}
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button 
                                id="refresh-btn"
                                class="bg-white/20 hover:bg-white/30 p-2 rounded-md transition"
                                title="Atualizar"
                            >
                                <i data-feather="refresh-cw" class="w-4 h-4"></i>
                            </button>
                            <button 
                                id="clear-cache-btn"
                                class="bg-white/20 hover:bg-white/30 p-2 rounded-md transition"
                                title="Limpar cache"
                            >
                                <i data-feather="trash" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Barra de pesquisa igual ao dashboard -->
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i data-feather="search" class="text-gray-400 w-4 h-4"></i>
                        </div>
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Estou procurando por..." 
                            class="w-full p-2 pl-10 text-sm text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]"
                        >
                    </div>
                </div>
            </div>
            
            <!-- Tabela Responsiva -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            ${responsiveConfig.columns.map(col => `
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ${col}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        ${data.length === 0 ? `
                            <tr>
                                <td colspan="${responsiveConfig.columns.length}" class="px-4 py-8 text-center text-gray-500">
                                    <div class="flex flex-col items-center space-y-2">
                                        <i data-feather="inbox" class="w-8 h-8 text-gray-300"></i>
                                        <span class="text-sm">Nenhum registro encontrado</span>
                                    </div>
                                </td>
                            </tr>
                        ` : data.map((item, index) => renderTableRow(item, index, responsiveConfig)).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Footer minimalista -->
            <div class="bg-gray-50 px-4 py-2 border-t">
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>${data.length} registros</span>
                    <div class="flex items-center space-x-1">
                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Online</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Reinicializa ícones Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Configura event listeners
    setupTableEventListeners(responsiveConfig);
}

/**
 * Renderiza uma linha da tabela
 */
function renderTableRow(item, index, config) {
    // Define o ID do item baseado no tipo
    let itemId;
    switch (cadastroState.currentType) {
        case 'PROFISSIONAIS':
        case 'ADMIN':
            itemId = item.idProfissional;
            break;
        case 'PACIENTE':
            itemId = item.idPaciente;
            break;
        case 'ANAMNESE':
            itemId = item.idAnamnese;
            break;
        case 'RELATORIO':
            itemId = item.idProntuario;
            break;
        default:
            itemId = item.id || index;
    }

    const cells = config.fields.map(field => {
        if (field === 'actions') {
            return `
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center justify-center space-x-1">
                        <button 
                            class="edit-btn text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition"
                            data-index="${index}"
                            data-id="${itemId}"
                            title="Editar"
                        >
                            <i data-feather="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button 
                            class="view-btn text-gray-500 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition"
                            data-index="${index}"
                            data-id="${itemId}"
                            title="Visualizar"
                        >
                            <i data-feather="eye" class="w-4 h-4"></i>
                        </button>
                        <button 
                            class="delete-btn text-gray-500 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition"
                            data-index="${index}"
                            data-id="${itemId}"
                            title="Solicitar exclusão"
                        >
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            `;
        }
        
        // Formatação de campos específicos
        let value = getNestedValue(item, field);
        
        // Se não encontrou valor, usa fallback
        if (value === null || value === undefined || value === '') {
            value = 'N/A';
        }
        
        if (field.includes('status') || field.includes('Status')) {
            const isActive = value === 1 || value === 'ATIVO' || value === true || value === 'Ativo' || value === 'APROVADO';
            return `
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }">
                        ${isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
            `;
        }
        
        if (field.includes('data') || field.includes('Data') || field.includes('date')) {
            if (value && value !== 'N/A') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    value = date.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',  
                        year: 'numeric'
                    });
                }
            }
        }
        
        if (field.includes('tipo') && typeof value === 'number') {
            const tipos = {1: 'Admin', 2: 'Psicólogo', 3: 'Supervisor'};
            value = tipos[value] || `Tipo ${value}`;
        }
        
        if (field.includes('cpf') || field.includes('CPF')) {
            if (value && value !== 'N/A' && value.toString().length >= 11) {
                const cpfString = value.toString().replace(/\D/g, '');
                if (cpfString.length === 11) {
                    value = cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                }
            }
        }
        
        if (field.includes('telefone') && value && value !== 'N/A') {
            const phoneString = value.toString().replace(/\D/g, '');
            if (phoneString.length === 11) {
                value = phoneString.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (phoneString.length === 10) {
                value = phoneString.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        }
        
        // Formatação especial para campos ID
        if (field.includes('id') || field.includes('Id') || field.includes('ID')) {
            return `
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #${value}
                </td>
            `;
        }
        
        return `
            <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title="${value}">
                ${value}
            </td>
        `;
    });
    
    return `
        <tr class="hover:bg-gray-50 transition duration-200">
            ${cells.join('')}
        </tr>
    `;
}

/**
 * Configura event listeners da tabela
 */
function setupTableEventListeners(config) {
    // Busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTable(e.target.value, config);
        });
    }
    
    // Refresh
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDataType(cadastroState.currentType);
        });
    }
    
    // Clear cache
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            cadastroCache.clear();
            loadDataType(cadastroState.currentType);
        });
    }
    
    // Botões de ação
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            editItem(index, config);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            viewItem(index, config);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            requestDeletion(index, config);
        });
    });
}

/**
 * Filtra a tabela baseado na busca - otimizado para performance
 */
function filterTable(searchTerm, config) {
    if (!searchTerm.trim()) {
        updateTableBody(cadastroState.currentData, config);
        return;
    }
    
    const term = searchTerm.toLowerCase();
    const startTime = performance.now();
    
    const filteredData = cadastroState.currentData.filter(item => {
        // Busca no campo principal
        const searchValue = getNestedValue(item, config.searchField);
        if (searchValue && searchValue.toString().toLowerCase().includes(term)) {
            return true;
        }
        
        // Busca por ID
        const itemId = getItemId(item);
        if (itemId.toString().includes(term)) {
            return true;
        }
        
        return false;
    });
    
    const endTime = performance.now();
    console.log(`🔍 Filtro aplicado em ${(endTime - startTime).toFixed(2)}ms - ${filteredData.length} resultados`);
    
    updateTableBody(filteredData, config);
}

/**
 * Atualiza apenas o corpo da tabela - otimizado
 */
function updateTableBody(data, config) {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    const startTime = performance.now();
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${config.columns.length}" class="px-6 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center space-y-2">
                        <i data-feather="search" class="w-8 h-8 text-gray-400"></i>
                        <span>Nenhum resultado encontrado</span>
                    </div>
                </td>
            </tr>
        `;
    } else {
        // Renderização otimizada
        const rowsHtml = data.map((item, index) => renderTableRow(item, index, config)).join('');
        tableBody.innerHTML = rowsHtml;
    }
    
    const endTime = performance.now();
    console.log(`🎨 Tabela renderizada em ${(endTime - startTime).toFixed(2)}ms`);
    
    // Reinicializa ícones e event listeners
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    setupTableEventListeners(config);
}

/**
 * Obtém o ID do item baseado no tipo
 */
function getItemId(item) {
    return item.idProfissional || item.idPaciente || item.idAnamnese || item.idProntuario || item.id || 0;
}

/**
 * Editar item
 */
function editItem(index, config) {
    const item = cadastroState.currentData[index];
    console.log('✏️ Editando item:', item);
    
    // Cria modal de edição
    showEditModal(item, config);
}

/**
 * Visualizar item
 */
function viewItem(index, config) {
    const item = cadastroState.currentData[index];
    console.log('👁️ Visualizando item:', item);
    
    // Cria modal de visualização
    showViewModal(item, config);
}

/**
 * Solicita exclusão
 */
function requestDeletion(index, config) {
    const item = cadastroState.currentData[index];
    console.log('🗑️ Solicitando exclusão:', item);
    
    showDeleteRequestModal(item, config);
}

/**
 * Mostra modal de edição
 */
function showEditModal(item, config) {
    const modal = createModal('edit', 'Editar Registro', config.icon);
    
    const editableFields = config.editableFields;
    const fieldsHtml = editableFields.map(field => {
        const value = getNestedValue(item, field) || '';
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        return `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>
                <input 
                    type="text" 
                    name="${field}"
                    value="${value}"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
            </div>
        `;
    }).join('');
    
    modal.querySelector('.modal-body').innerHTML = `
        <form id="edit-form">
            ${fieldsHtml}
            <div class="flex justify-end space-x-3 mt-6">
                <button type="button" class="cancel-btn px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200">
                    Cancelar
                </button>
                <button type="submit" class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition duration-200">
                    Salvar
                </button>
            </div>
        </form>
    `;
    
    // Event listeners
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveEditedItem(modal, item, config);
    });
    
    document.body.appendChild(modal);
}

/**
 * Mostra modal de visualização
 */
function showViewModal(item, config) {
    const modal = createModal('view', 'Detalhes do Registro', 'eye');
    
    const allFields = Object.keys(item);
    const fieldsHtml = allFields.map(field => {
        if (field === 'id' || field.includes('Id')) return '';
        
        const value = getNestedValue(item, field) || '-';
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        return `
            <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="font-medium text-gray-700">${label}:</span>
                <span class="text-gray-900">${value}</span>
            </div>
        `;
    }).join('');
    
    modal.querySelector('.modal-body').innerHTML = `
        <div class="space-y-2">
            ${fieldsHtml}
        </div>
        <div class="flex justify-end mt-6">
            <button class="close-btn px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition duration-200">
                Fechar
            </button>
        </div>
    `;
    
    modal.querySelector('.close-btn').addEventListener('click', () => closeModal(modal));
    document.body.appendChild(modal);
}

/**
 * Mostra modal de solicitação de exclusão
 */
function showDeleteRequestModal(item, config) {
    const modal = createModal('delete', 'Solicitar Exclusão', 'alert-triangle');
    
    const itemName = getNestedValue(item, config.searchField) || 'Registro';
    
    modal.querySelector('.modal-body').innerHTML = `
        <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i data-feather="alert-triangle" class="h-6 w-6 text-red-600"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Solicitar Exclusão</h3>
            <p class="text-sm text-gray-500 mb-6">
                Você está solicitando a exclusão de: <strong>${itemName}</strong>
            </p>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div class="flex">
                    <i data-feather="info" class="h-5 w-5 text-yellow-400 mr-2"></i>
                    <div class="text-sm text-yellow-700">
                        <strong>Importante:</strong> Esta solicitação será enviada para um administrador para aprovação.
                        Você não pode excluir registros diretamente.
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Motivo da exclusão</label>
                <textarea 
                    id="delete-reason"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Explique o motivo da solicitação de exclusão..."
                ></textarea>
            </div>
            
            <div class="flex justify-center space-x-3">
                <button class="cancel-btn px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200">
                    Cancelar
                </button>
                <button class="confirm-btn px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                    Enviar Solicitação
                </button>
            </div>
        </div>
    `;
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        sendDeleteRequest(item, config, modal);
    });
    
    document.body.appendChild(modal);
}

/**
 * Cria modal base
 */
function createModal(type, title, icon) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                    <i data-feather="${icon}" class="w-5 h-5 text-emerald-600"></i>
                    <h3 class="text-lg font-medium text-gray-900">${title}</h3>
                </div>
                <button class="close-modal text-gray-400 hover:text-gray-600">
                    <i data-feather="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="modal-body"></div>
        </div>
    `;
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    return modal;
}

/**
 * Fecha modal
 */
function closeModal(modal) {
    modal.remove();
}

/**
 * Salva item editado
 */
async function saveEditedItem(modal, item, config) {
    try {
        console.log('💾 Salvando edições...');
        showLoader(true);
        
        // Coleta dados do formulário
        const formData = new FormData(modal.querySelector('#edit-form'));
        const dadosAtualizados = {};
        
        // Extrai apenas os campos editáveis
        config.editableFields.forEach(field => {
            const value = formData.get(field);
            if (value !== null && value !== undefined) {
                dadosAtualizados[field] = value;
            }
        });
        
        // Define o ID baseado no tipo de entidade
        let itemId;
        let updateFunction;
        
        switch (cadastroState.currentType) {
            case 'PROFISSIONAIS':
            case 'ADMIN':
                itemId = item.idProfissional || item.id;
                updateFunction = atualizarProfissional;
                break;
            case 'PACIENTE':
                itemId = item.idPaciente || item.id;
                updateFunction = atualizarPaciente;
                break;
            default:
                throw new Error('Tipo de entidade não suportado para edição');
        }
        
        if (!itemId) {
            throw new Error('ID do item não encontrado');
        }
        
        // Mantém os dados originais e aplica apenas as alterações
        const dadosCompletos = { ...item, ...dadosAtualizados };
        
        // Chama a função de atualização apropriada
        await updateFunction(itemId, dadosCompletos);
        
        showSuccess('Alterações salvas com sucesso!');
        closeModal(modal);
        
        // Recarrega dados
        await loadDataType(cadastroState.currentType);
        
    } catch (error) {
        console.error('💥 Erro ao salvar alterações:', error);
        showError('Erro ao salvar alterações: ' + error.message);
    } finally {
        showLoader(false);
    }
}

/**
 * Envia solicitação de exclusão
 */
async function sendDeleteRequest(item, config, modal) {
    try {
        const reason = modal.querySelector('#delete-reason').value.trim();
        
        if (!reason) {
            showError('Por favor, informe o motivo da exclusão.');
            return;
        }
        
        showLoader(true);
        
        // Define o ID baseado no tipo de entidade
        let itemId;
        let itemName;
        
        switch (cadastroState.currentType) {
            case 'PROFISSIONAIS':
            case 'ADMIN':
                itemId = item.idProfissional || item.id;
                itemName = item.nomePessoa || 'Profissional';
                break;
            case 'PACIENTE':
                itemId = item.idPaciente || item.id;
                itemName = item.nomePessoa || 'Paciente';
                break;
            case 'ANAMNESE':
                itemId = item.idAnamnese || item.id;
                itemName = `Anamnese ${itemId}`;
                break;
            case 'RELATORIO':
                itemId = item.idProntuario || item.id;
                itemName = `Relatório ${itemId}`;
                break;
            default:
                throw new Error('Tipo de entidade não suportado para exclusão');
        }
        
        if (!itemId) {
            throw new Error('ID do item não encontrado');
        }
        
        // Envia solicitação de exclusão
        const resultado = await solicitarExclusao(
            cadastroState.currentType,
            itemId,
            reason,
            'usuario@psyclin.com' // TODO: obter usuário logado
        );
        
        console.log('📋 Solicitação enviada:', {
            tipo: cadastroState.currentType,
            item: itemName,
            itemId,
            motivo: reason,
            resultado,
            timestamp: new Date().toISOString()
        });
        
        showSuccess(`Solicitação de exclusão enviada para aprovação! ID da solicitação: ${resultado.id}`);
        closeModal(modal);
        
    } catch (error) {
        console.error('💥 Erro ao enviar solicitação:', error);
        showError('Erro ao enviar solicitação: ' + error.message);
    } finally {
        showLoader(false);
    }
}

// Cache para otimizar consultas
const cadastroCache = {
    data: new Map(),
    expireTime: 30000, // 30 segundos
    
    get(key) {
        const cached = this.data.get(key);
        if (cached && Date.now() - cached.timestamp < this.expireTime) {
            console.log(`📦 Cache hit para ${key}`);
            return cached.data;
        }
        return null;
    },
    
    set(key, data) {
        console.log(`💾 Salvando no cache: ${key}`);
        this.data.set(key, {
            data: data,
            timestamp: Date.now()
        });
    },
    
    clear() {
        this.data.clear();
        console.log('🗑️ Cache limpo');
    }
};

/**
 * Utilitários
 */
function getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    // Debug: mostrar estrutura quando necessário
    console.log(`🔍 Buscando '${path}' no objeto:`, obj);
    
    try {
        // Tenta várias possibilidades para nomes
        if (path === 'nomePessoa') {
            const possibilities = [
                obj.nomePessoa,
                obj.nome,
                obj.pessoa?.nomePessoa,
                obj.pessoa?.nome,
                obj.nomeResponsavel,
                obj.nomeCompleto
            ];
            
            for (const possibility of possibilities) {
                if (possibility && possibility !== null && possibility !== undefined && possibility !== '') {
                    console.log(`✅ Nome encontrado: '${possibility}'`);
                    return possibility;
                }
            }
        }
        
        // Para outros campos, tenta o caminho original primeiro
        const result = path.split('.').reduce((current, key) => {
            if (current === null || current === undefined) return null;
            
            if (typeof current === 'object' && current.hasOwnProperty(key)) {
                return current[key];
            }
            
            if (Array.isArray(current) && !isNaN(key)) {
                return current[parseInt(key)];
            }
            
            return null;
        }, obj);
        
        if (result !== null && result !== undefined && result !== '') {
            return result;
        }
        
        // Se não encontrou, tenta alternativas baseadas no tipo de campo
        if (path.includes('status') || path.includes('Status')) {
            const statusFields = ['status', 'statusFuncional', 'statusAnamnese', 'statusProfissional', 'statusPaciente', 'ativo'];
            for (const field of statusFields) {
                if (obj[field] !== undefined) {
                    return obj[field];
                }
            }
        }
        
        console.log(`❌ Campo '${path}' não encontrado`);
        return null;
        
    } catch (error) {
        console.warn(`Erro ao acessar propriedade ${path}:`, error);
        return null;
    }
}

function showLoader(show) {
    const loader = document.querySelector('.loader');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
            // O loader já tem o estilo CSS correto com ::after
        } else {
            loader.classList.add('hidden');
        }
    }
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para detectar se é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para obter configurações baseado no dispositivo
function getResponsiveConfig(config) {
    if (isMobile()) {
        return {
            ...config,
            columns: config.columnsMinimal || config.columns,
            fields: config.fieldsMinimal || config.fields
        };
    }
    return config;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initCadastroManager();
});

// Event listener para resize da tela
window.addEventListener('resize', () => {
    if (cadastroState.currentType && cadastroState.currentData.length > 0) {
        const config = dataConfigs[cadastroState.currentType];
        renderDataTable(cadastroState.currentData, config);
    }
});

export { initCadastroManager, loadDataType };
