/**
 * Operações CRUD de Anamneses - Sistema Psyclin
 * 
 * Este módulo implementa as operações de criação, edição, visualização e exclusão
 * de anamneses, incluindo modais e formulários.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */

// Configuração da API (reutilizada do manager)
const API_ANAMNESE = {
    BASE_URL: 'http://localhost:8080',
    ENDPOINTS: {
        ANAMNESES: '/anamnese',
        PACIENTES: '/paciente/ativos',
        PROFISSIONAIS: '/profissional/ativos'
    }
};

/**
 * Abre o modal para criar uma nova anamnese
 */
async function abrirModalNovaAnamnese() {
    try {
        console.log('🆕 Abrindo modal de nova anamnese...');
        
        // Criar e mostrar modal
        const modal = criarModalAnamnese();
        document.body.appendChild(modal);
        
        // Definir data atual como padrão
        const inputData = modal.querySelector('#dataAnamnese');
        if (inputData) {
            const agora = new Date();
            // Formatar para datetime-local (YYYY-MM-DDTHH:MM)
            const dataFormatada = agora.getFullYear() + '-' + 
                String(agora.getMonth() + 1).padStart(2, '0') + '-' + 
                String(agora.getDate()).padStart(2, '0') + 'T' + 
                String(agora.getHours()).padStart(2, '0') + ':' + 
                String(agora.getMinutes()).padStart(2, '0');
            inputData.value = dataFormatada;
        }
        
        // Carregar dados para os selects
        await Promise.all([
            popularSelectPacientes(modal),
            popularSelectProfissionais(modal)
        ]);
        
        // Configurar eventos do modal
        configurarEventosModal(modal, 'criar');
        
        // Configurar máscara do CPF
        configurarMascaraCPF(modal);
        
        // Atualizar ícones
        feather.replace();
        
        // Mostrar modal
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('❌ Erro ao abrir modal:', error);
        mostrarNotificacao('Erro ao abrir formulário de anamnese', 'error');
    }
}

/**
 * Visualiza uma anamnese específica
 */
async function visualizarAnamnese(id) {
    try {
        console.log(`👁️ Visualizando anamnese ${id}...`);
        
        // Buscar dados da anamnese
        const anamnese = await buscarAnamnesePorId(id);
        
        if (!anamnese) {
            mostrarNotificacao('Anamnese não encontrada', 'error');
            return;
        }
        
        // Criar e mostrar modal de visualização
        const modal = criarModalVisualizacao(anamnese);
        document.body.appendChild(modal);
        
        // Configurar eventos
        configurarEventosModalVisualizacao(modal);
        
        // Mostrar modal
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('❌ Erro ao visualizar anamnese:', error);
        mostrarNotificacao('Erro ao carregar anamnese', 'error');
    }
}

/**
 * Edita uma anamnese específica
 */
async function editarAnamnese(id) {
    try {
        console.log(`✏️ Editando anamnese ${id}...`);
        
        // Buscar dados da anamnese
        const anamnese = await buscarAnamnesePorId(id);
        
        if (!anamnese) {
            mostrarNotificacao('Anamnese não encontrada', 'error');
            return;
        }
        
        // Criar e mostrar modal de edição
        const modal = criarModalAnamnese(anamnese);
        document.body.appendChild(modal);
        
        // Carregar dados para os selects
        await Promise.all([
            popularSelectPacientes(modal),
            popularSelectProfissionais(modal)
        ]);
        
        // Preencher formulário com dados existentes
        preencherFormulario(modal, anamnese);
        
        // Configurar eventos do modal
        configurarEventosModal(modal, 'editar', id);
        
        // Configurar máscara do CPF
        configurarMascaraCPF(modal);
        
        // Mostrar modal
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('❌ Erro ao editar anamnese:', error);
        mostrarNotificacao('Erro ao carregar anamnese para edição', 'error');
    }
}

/**
 * Exclui uma anamnese após confirmação
 */
async function excluirAnamnese(id) {
    try {
        console.log(`🗑️ Excluindo anamnese ${id}...`);
        
        // Confirmar exclusão
        const confirmar = await mostrarConfirmacao(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir esta anamnese? Esta ação não pode ser desfeita.',
            'Excluir',
            'Cancelar'
        );
        
        if (!confirmar) {
            return;
        }
        
        // Realizar exclusão
        mostrarLoader(true);
        
        const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.ANAMNESES}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        // Sucesso
        mostrarNotificacao('Anamnese excluída com sucesso', 'success');
        
        // Recarregar lista
        if (window.AnamneseManager) {
            await Promise.all([
                window.AnamneseManager.carregarAnamneses(),
                window.AnamneseManager.carregarEstatisticas()
            ]);
        }
        
    } catch (error) {
        console.error('❌ Erro ao excluir anamnese:', error);
        mostrarNotificacao('Erro ao excluir anamnese', 'error');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Busca uma anamnese por ID
 */
async function buscarAnamnesePorId(id) {
    try {
        const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.ANAMNESES}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.success) {
            return resultado.data;
        }
        
        throw new Error(resultado.message || 'Erro ao buscar anamnese');
        
    } catch (error) {
        console.error('❌ Erro ao buscar anamnese:', error);
        throw error;
    }
}

/**
 * Cria o modal para criação/edição de anamnese
 */
function criarModalAnamnese(anamnese = null) {
    const isEdicao = !!anamnese;
    const titulo = isEdicao ? 'Editar Anamnese' : 'Nova Anamnese';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    modal.id = 'modal-anamnese';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Header do Modal -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">${titulo}</h2>
                <button type="button" class="text-gray-400 hover:text-gray-600" onclick="fecharModal('modal-anamnese')">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <!-- Formulário -->
            <form id="form-anamnese" class="p-6 space-y-6">
                <!-- Paciente -->
                <div>
                    <label for="paciente" class="block text-sm font-medium text-gray-700 mb-2">
                        Paciente *
                    </label>
                    <select id="paciente" name="idPaciente" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]">
                        <option value="">Selecione um paciente...</option>
                    </select>
                </div>
                
                <!-- Profissional -->
                <div>
                    <label for="profissional" class="block text-sm font-medium text-gray-700 mb-2">
                        Profissional *
                    </label>
                    <select id="profissional" name="idProfissional" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]">
                        <option value="">Selecione um profissional...</option>
                    </select>
                </div>
                
                <!-- Data da Anamnese -->
                <div>
                    <label for="dataAnamnese" class="block text-sm font-medium text-gray-700 mb-2">
                        Data da Anamnese *
                    </label>
                    <input type="datetime-local" id="dataAnamnese" name="dataAnamnese" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]">
                </div>
                
                <!-- Responsável -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="nomeResponsavel" class="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Responsável
                        </label>
                        <input type="text" id="nomeResponsavel" name="nomeResponsavel" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]"
                               placeholder="Nome completo">
                    </div>
                    <div>
                        <label for="cpfResponsavel" class="block text-sm font-medium text-gray-700 mb-2">
                            CPF do Responsável
                        </label>
                        <input type="text" id="cpfResponsavel" name="cpfResponsavel" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]"
                               placeholder="000.000.000-00">
                    </div>
                </div>
                
                <!-- Status -->
                <div>
                    <label for="statusAnamnese" class="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                    </label>
                    <select id="statusAnamnese" name="statusAnamnese" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]">
                        <option value="">Selecione o status...</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="APROVADO">Aprovado</option>
                        <option value="REPROVADO">Reprovado</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>
                
                <!-- Autorização de Visualização -->
                <div class="flex items-center">
                    <input type="checkbox" id="autorizacaoVisualizacao" name="autorizacaoVisualizacao" 
                           class="h-4 w-4 text-[var(--mountain-meadow)] focus:ring-[var(--mountain-meadow)] border-gray-300 rounded">
                    <label for="autorizacaoVisualizacao" class="ml-2 block text-sm text-gray-900">
                        Autorização para visualização concedida
                    </label>
                </div>
                
                <!-- Observações -->
                <div>
                    <label for="observacoes" class="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                    </label>
                    <textarea id="observacoes" name="observacoes" rows="4" 
                              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mountain-meadow)]"
                              placeholder="Observações adicionais sobre a anamnese..."></textarea>
                </div>
            </form>
            
            <!-- Footer do Modal -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button type="button" onclick="fecharModal('modal-anamnese')" 
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancelar
                </button>
                <button type="submit" form="form-anamnese" 
                        class="px-4 py-2 text-sm font-medium text-white bg-[var(--zomp)] border border-transparent rounded-md hover:bg-[var(--oxford-blue)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mountain-meadow)]">
                    ${isEdicao ? 'Atualizar' : 'Criar'} Anamnese
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Cria o modal para visualização de anamnese
 */
function criarModalVisualizacao(anamnese) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    modal.id = 'modal-visualizar-anamnese';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Header do Modal -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Detalhes da Anamnese</h2>
                <button type="button" class="text-gray-400 hover:text-gray-600" onclick="fecharModal('modal-visualizar-anamnese')">
                    <i data-feather="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <!-- Conteúdo -->
            <div class="p-6 space-y-6">
                <!-- Informações do Paciente -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Informações do Paciente</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-medium text-gray-500">Nome:</span>
                            <p class="text-sm text-gray-900">${anamnese.nomePaciente || 'Não informado'}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500">Profissional:</span>
                            <p class="text-sm text-gray-900">${anamnese.nomeProfissional || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Dados da Anamnese -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Dados da Anamnese</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-medium text-gray-500">Data de Aplicação:</span>
                            <p class="text-sm text-gray-900">${anamnese.dataAplicacao || 'Não informada'}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500">Status:</span>
                            <p class="text-sm text-gray-900">${anamnese.statusAnamnese || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Responsável -->
                ${anamnese.nomeResponsavel ? `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Responsável</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-medium text-gray-500">Nome:</span>
                            <p class="text-sm text-gray-900">${anamnese.nomeResponsavel}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500">CPF:</span>
                            <p class="text-sm text-gray-900">${anamnese.cpfResponsavel || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Autorização -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Autorização</h3>
                    <div class="flex items-center">
                        <i data-feather="${anamnese.autorizacaoVisualizacao ? 'check-circle' : 'x-circle'}" 
                           class="w-5 h-5 ${anamnese.autorizacaoVisualizacao ? 'text-green-500' : 'text-red-500'} mr-2"></i>
                        <span class="text-sm text-gray-900">
                            ${anamnese.autorizacaoVisualizacao ? 'Autorização concedida' : 'Autorização não concedida'}
                        </span>
                    </div>
                </div>
                
                <!-- Observações -->
                ${anamnese.observacoes ? `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Observações</h3>
                    <p class="text-sm text-gray-900 whitespace-pre-wrap">${anamnese.observacoes}</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Footer do Modal -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button type="button" onclick="editarAnamnese(${anamnese.idAnamnese}); fecharModal('modal-visualizar-anamnese')" 
                        class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Editar
                </button>
                <button type="button" onclick="fecharModal('modal-visualizar-anamnese')" 
                        class="px-4 py-2 text-sm font-medium text-white bg-[var(--zomp)] border border-transparent rounded-md hover:bg-[var(--oxford-blue)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mountain-meadow)]">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Popula o select de pacientes
 */
async function popularSelectPacientes(modal) {
    try {
        console.log('🔄 Carregando pacientes...');
        const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.PACIENTES}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const resultado = await response.json();
        console.log('📦 Resposta da API de pacientes:', resultado);
        
        const select = modal.querySelector('#paciente');
        
        if (!select) {
            throw new Error('Select de paciente não encontrado no modal');
        }
        
        // Limpar options existentes (exceto o primeiro)
        const firstOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption);
        }
        
        if (resultado.success && Array.isArray(resultado.data)) {
            console.log(`✅ ${resultado.data.length} pacientes encontrados`);
            resultado.data.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.idPaciente;
                option.textContent = paciente.nomePessoa;
                select.appendChild(option);
            });
        } else if (Array.isArray(resultado)) {
            // Fallback caso a resposta não tenha o wrapper success/data
            console.log(`✅ ${resultado.length} pacientes encontrados (formato direto)`);
            resultado.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.idPaciente;
                option.textContent = paciente.nomePessoa;
                select.appendChild(option);
            });
        } else {
            console.warn('⚠️ Formato de resposta inesperado:', resultado);
            mostrarNotificacao('Formato de resposta de pacientes inesperado', 'warning');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar pacientes:', error);
        mostrarNotificacao('Erro ao carregar lista de pacientes', 'error');
    }
}

/**
 * Popula o select de profissionais
 */
async function popularSelectProfissionais(modal) {
    try {
        console.log('🔄 Carregando profissionais...');
        const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.PROFISSIONAIS}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const resultado = await response.json();
        console.log('📦 Resposta da API de profissionais:', resultado);
        
        const select = modal.querySelector('#profissional');
        
        if (!select) {
            throw new Error('Select de profissional não encontrado no modal');
        }
        
        // Limpar options existentes (exceto o primeiro)
        const firstOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption);
        }
        
        if (resultado.success && Array.isArray(resultado.data)) {
            console.log(`✅ ${resultado.data.length} profissionais encontrados`);
            resultado.data.forEach(profissional => {
                const option = document.createElement('option');
                option.value = profissional.idProfissional;
                option.textContent = profissional.nomePessoa;
                select.appendChild(option);
            });
        } else if (Array.isArray(resultado)) {
            // Fallback caso a resposta não tenha o wrapper success/data
            console.log(`✅ ${resultado.length} profissionais encontrados (formato direto)`);
            resultado.forEach(profissional => {
                const option = document.createElement('option');
                option.value = profissional.idProfissional;
                option.textContent = profissional.nomePessoa;
                select.appendChild(option);
            });
        } else {
            console.warn('⚠️ Formato de resposta inesperado:', resultado);
            mostrarNotificacao('Formato de resposta de profissionais inesperado', 'warning');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar profissionais:', error);
        mostrarNotificacao('Erro ao carregar lista de profissionais', 'error');
    }
}

/**
 * Preenche o formulário com dados existentes (para edição)
 */
function preencherFormulario(modal, anamnese) {
    // Definir valores dos campos
    const campos = {
        '#paciente': anamnese.idPaciente,
        '#profissional': anamnese.idProfissional,
        '#dataAnamnese': formatarDataParaInput(anamnese.dataAplicacao),
        '#nomeResponsavel': anamnese.nomeResponsavel,
        '#cpfResponsavel': anamnese.cpfResponsavel,
        '#statusAnamnese': anamnese.statusAnamnese,
        '#observacoes': anamnese.observacoes
    };
    
    // Preencher campos
    Object.entries(campos).forEach(([selector, valor]) => {
        const elemento = modal.querySelector(selector);
        if (elemento && valor !== null && valor !== undefined) {
            elemento.value = valor;
        }
    });
    
    // Checkbox de autorização
    const checkbox = modal.querySelector('#autorizacaoVisualizacao');
    if (checkbox) {
        checkbox.checked = !!anamnese.autorizacaoVisualizacao;
    }
}

/**
 * Configura os eventos do modal de criação/edição
 */
function configurarEventosModal(modal, acao, id = null) {
    const form = modal.querySelector('#form-anamnese');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                mostrarLoader(true);
                
                // Coletar dados do formulário
                const formData = new FormData(form);
                const dados = coletarDadosFormulario(formData);
                
                // Validar dados
                if (!validarDadosAnamnese(dados)) {
                    return;
                }
                
                // Enviar para API
                let response;
                if (acao === 'criar') {
                    response = await criarAnamnese(dados);
                } else {
                    response = await atualizarAnamnese(id, dados);
                }
                
                if (response.success) {
                    const mensagem = acao === 'criar' ? 'Anamnese criada com sucesso' : 'Anamnese atualizada com sucesso';
                    mostrarNotificacao(mensagem, 'success');
                    
                    // Fechar modal
                    fecharModal('modal-anamnese');
                    
                    // Recarregar lista
                    if (window.AnamneseManager) {
                        await Promise.all([
                            window.AnamneseManager.carregarAnamneses(),
                            window.AnamneseManager.carregarEstatisticas()
                        ]);
                    }
                } else {
                    throw new Error(response.message || 'Erro na operação');
                }
                
            } catch (error) {
                console.error(`❌ Erro ao ${acao} anamnese:`, error);
                mostrarNotificacao(`Erro ao ${acao} anamnese`, 'error');
            } finally {
                mostrarLoader(false);
            }
        });
    }
}

/**
 * Configura os eventos do modal de visualização
 */
function configurarEventosModalVisualizacao(modal) {
    // Atualizar ícones do Feather
    feather.replace();
}

/**
 * Configura máscara para o campo CPF
 */
function configurarMascaraCPF(modal) {
    const inputCPF = modal.querySelector('#cpfResponsavel');
    if (!inputCPF) return;
    
    inputCPF.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        // Limita a 11 dígitos
        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }
        
        // Aplica a máscara
        if (valor.length > 9) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (valor.length > 6) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (valor.length > 3) {
            valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        
        e.target.value = valor;
    });
    
    // Validação em tempo real (mais flexível)
    inputCPF.addEventListener('blur', function(e) {
        const cpf = e.target.value.replace(/\D/g, '');
        // Validar apenas se tem 11 dígitos e não são todos iguais
        if (cpf && (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))) {
            e.target.style.borderColor = '#ef4444'; // Vermelho
            e.target.style.backgroundColor = '#fef2f2'; // Fundo vermelho claro
        } else {
            e.target.style.borderColor = '#d1d5db'; // Cinza padrão
            e.target.style.backgroundColor = '#ffffff'; // Fundo branco
        }
    });
}

/**
 * Coleta dados do formulário
 */
function coletarDadosFormulario(formData) {
    // Converter data para o formato ISO correto
    const dataAnamnese = formData.get('dataAnamnese');
    const dataIso = dataAnamnese ? new Date(dataAnamnese).toISOString() : null;
    
    // Limpar CPF removendo formatação (pontos, traços, espaços)
    const cpfBruto = formData.get('cpfResponsavel');
    const cpfLimpo = cpfBruto ? cpfBruto.replace(/\D/g, '') : null;
    
    // Limpar nome do responsável (trim)
    const nomeResponsavel = formData.get('nomeResponsavel');
    const nomeResponsavelLimpo = nomeResponsavel ? nomeResponsavel.trim() : null;
    
    // Limpar observações (trim)
    const observacoes = formData.get('observacoes');
    const observacoesLimpas = observacoes ? observacoes.trim() : null;
    
    return {
        idPaciente: parseInt(formData.get('idPaciente')),
        idProfissional: parseInt(formData.get('idProfissional')),
        dataAnamnese: dataIso,
        nomeResponsavel: nomeResponsavelLimpo || null,
        cpfResponsavel: cpfLimpo || null,
        statusAnamnese: formData.get('statusAnamnese'),
        statusFuncional: true, // Por padrão, anamneses criadas são funcionais
        autorizacaoVisualizacao: formData.has('autorizacaoVisualizacao'),
        observacoes: observacoesLimpas || null
    };
}

/**
 * Valida os dados da anamnese
 */
function validarDadosAnamnese(dados) {
    console.log('🔍 Validando dados da anamnese:', dados);
    
    if (!dados.idPaciente || isNaN(dados.idPaciente)) {
        mostrarNotificacao('Selecione um paciente válido', 'error');
        return false;
    }
    
    if (!dados.idProfissional || isNaN(dados.idProfissional)) {
        mostrarNotificacao('Selecione um profissional válido', 'error');
        return false;
    }
    
    if (!dados.dataAnamnese) {
        mostrarNotificacao('Informe a data da anamnese', 'error');
        return false;
    }
    
    // Validar se a data não é no futuro
    const dataAnamnese = new Date(dados.dataAnamnese);
    const agora = new Date();
    if (dataAnamnese > agora) {
        mostrarNotificacao('A data da anamnese não pode ser no futuro', 'error');
        return false;
    }
    
    if (!dados.statusAnamnese) {
        mostrarNotificacao('Selecione o status da anamnese', 'error');
        return false;
    }
    
    // Validar CPF se informado
    if (dados.cpfResponsavel && !validarCPF(dados.cpfResponsavel)) {
        mostrarNotificacao('CPF do responsável inválido. Use o formato: 000.000.000-00', 'error');
        return false;
    }
    
    console.log('✅ Dados válidos');
    return true;
}

/**
 * Valida formato do CPF (validação flexível)
 */
function validarCPF(cpf) {
    if (!cpf) return true; // CPF é opcional
    
    // CPF já deve estar limpo (apenas números) quando chega aqui
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) return false;
    
    // Verifica se não são todos iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Por enquanto, aceitar qualquer CPF com 11 dígitos válidos
    // TODO: Implementar validação matemática completa se necessário
    return true;
}

/**
 * Validação matemática completa do CPF (OPCIONAL - não está sendo usada)
 * Descomente para usar validação rigorosa
 */
function validarCPFMatematico(cpf) {
    if (!cpf) return true;
    
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    
    if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
    
    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    
    return digito2 === parseInt(cpfLimpo.charAt(10));
}

/**
 * Cria uma nova anamnese
 */
async function criarAnamnese(dados) {
    try {
        console.log('📤 Enviando dados para criação de anamnese:', dados);
        
        const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.ANAMNESES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        console.log('📡 Resposta do servidor:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na resposta:', errorText);
            
            // Tratar erros específicos do banco de dados
            if (errorText.includes('Data too long for column')) {
                const mensagemErro = extrairMensagemErroBanco(errorText);
                throw new Error(`Erro de validação: ${mensagemErro}`);
            }
            
            throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
        }
        
        const resultado = await response.json();
        console.log('✅ Anamnese criada com sucesso:', resultado);
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro ao criar anamnese:', error);
        throw error;
    }
}

/**
 * Atualiza uma anamnese existente
 */
async function atualizarAnamnese(id, dados) {
    const response = await fetch(`${API_ANAMNESE.BASE_URL}${API_ANAMNESE.ENDPOINTS.ANAMNESES}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...dados, idAnamnese: id})
    });
    
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    // PUT retorna 204 No Content, então retornamos sucesso
    return { success: true };
}

/**
 * Formata uma data para input datetime-local
 */
function formatarDataParaInput(dataString) {
    if (!dataString) return '';
    
    try {
        // Se está no formato dd/mm/yyyy, converter para ISO
        if (dataString.includes('/')) {
            const [dia, mes, ano] = dataString.split('/');
            const data = new Date(ano, mes - 1, dia);
            return data.toISOString().slice(0, 16);
        }
        
        // Se já está em formato ISO, usar diretamente
        const data = new Date(dataString);
        return data.toISOString().slice(0, 16);
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '';
    }
}

/**
 * Fecha um modal
 */
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Mostra uma confirmação para o usuário
 */
async function mostrarConfirmacao(titulo, mensagem, textoBotaoConfirmar, textoBotaoCancelar) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.id = 'modal-confirmacao';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">${titulo}</h3>
                    <p class="text-sm text-gray-500 mb-6">${mensagem}</p>
                    <div class="flex items-center justify-end gap-3">
                        <button type="button" id="btn-cancelar" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            ${textoBotaoCancelar}
                        </button>
                        <button type="button" id="btn-confirmar" 
                                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
                            ${textoBotaoConfirmar}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#btn-confirmar').addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
        
        modal.querySelector('#btn-cancelar').addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });
        
        // Fechar clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        });
    });
}

/**
 * Mostra ou oculta o loader
 */
function mostrarLoader(mostrar) {
    const loader = document.getElementById('loader-anamneses');
    if (loader) {
        loader.classList.toggle('hidden', !mostrar);
    }
}

/**
 * Exibe uma notificação para o usuário
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Implementação simples com alert (pode ser melhorada)
    alert(`${tipo.toUpperCase()}: ${mensagem}`);
    console.log(`${tipo.toUpperCase()}: ${mensagem}`);
}

/**
 * Extrai mensagem de erro amigável dos erros de banco de dados
 */
function extrairMensagemErroBanco(errorText) {
    try {
        const errorObj = JSON.parse(errorText);
        const error = errorObj.error || errorText;
        
        // Mapear erros comuns para mensagens amigáveis
        if (error.includes('Data too long for column \'CPFRESP\'')) {
            return 'CPF do responsável muito longo. Use apenas 11 dígitos.';
        }
        if (error.includes('Data too long for column \'NOMERESP\'')) {
            return 'Nome do responsável muito longo. Máximo de caracteres excedido.';
        }
        if (error.includes('Data too long for column')) {
            return 'Um dos campos contém dados muito longos. Verifique os valores informados.';
        }
        if (error.includes('cannot be null')) {
            return 'Campo obrigatório não preenchido.';
        }
        if (error.includes('foreign key constraint')) {
            return 'Referência inválida. Verifique se paciente e profissional existem.';
        }
        
        return errorObj.message || 'Erro no banco de dados';
    } catch (e) {
        return 'Erro no banco de dados';
    }
}

// Tornar funções disponíveis globalmente
window.abrirModalNovaAnamnese = abrirModalNovaAnamnese;
window.visualizarAnamnese = visualizarAnamnese;
window.editarAnamnese = editarAnamnese;
window.excluirAnamnese = excluirAnamnese;
window.fecharModal = fecharModal;
