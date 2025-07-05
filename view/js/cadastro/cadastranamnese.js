/**
 * @fileoverview Gerenciador de cadastro de anamnese
 * @version 1.0
 * @author Sistema Psyclin
 */

// Importações
import { cadastrarAnamnese, pegarPacientesAtivos, pegarProfissionaisAtivos } from '../services/apiManager.js';

// Estado do formulário
let formState = {
    isSubmitting: false,
    pacientes: [],
    profissionais: []
};

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastroAnamnese();
});

/**
 * Inicializa o sistema de cadastro de anamnese
 */
function initializeCadastroAnamnese() {
    console.log('🚀 Iniciializando cadastro de anamnese...');
    const form = document.getElementById('form-anamnese');
    
    if (!form) {
        console.error('❌ Formulário de cadastro não encontrado');
        return;
    }

    console.log('✅ Formulário encontrado, configurando...');

    // Carrega lista de pacientes e profissionais
    loadPacientes();
    loadProfissionais();
    
    // Configura botão de debug
    setupDebugButton();
    
    // Configura máscaras dos campos
    setupFieldMasks();
    
    // Configura validação em tempo real
    setupRealTimeValidation();
    
    // Configura contador de caracteres
    setupCharacterCounter();
    
    // Define data atual como padrão
    setDefaultDateTime();
    
    // Configura submit do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Configura responsividade
    setupResponsiveLayout();
    
    // Inicializa ícones
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    console.log('✅ Cadastro de anamnese inicializado com sucesso!');
}

/**
 * Configura o botão de debug para recarregar pacientes
 */
function setupDebugButton() {
    const debugBtn = document.getElementById('btn-debug-pacientes');
    if (debugBtn) {
        debugBtn.addEventListener('click', async function() {
            console.log('🔧 DEBUG: Recarregando pacientes...');
            try {
                await loadPacientes();
                showSuccess('Pacientes recarregados com sucesso!');
            } catch (error) {
                console.error('❌ Erro no debug:', error);
                showError('Erro ao recarregar pacientes: ' + error.message);
            }
        });
    }
}

/**
 * Carrega lista de pacientes ativos
 */
async function loadPacientes() {
    try {
        console.log('🔄 Carregando pacientes...');
        showLoader();
        
        const response = await pegarPacientesAtivos();
        console.log('📡 Resposta de pacientes:', response);
        
        // Verifica se a resposta tem a estrutura esperada
        if (response && response.success && response.data) {
            formState.pacientes = response.data;
            console.log('✅ Pacientes carregados:', formState.pacientes.length);
        } else if (Array.isArray(response)) {
            // Se a resposta é um array direto
            formState.pacientes = response;
            console.log('✅ Pacientes carregados (array direto):', formState.pacientes.length);
        } else {
            console.warn('⚠️ Estrutura de resposta inesperada:', response);
            formState.pacientes = [];
        }
        
        populatePacientesSelect();
        updateLoadingStatus(); // Atualiza status do botão
        
    } catch (error) {
        console.error('❌ Erro ao carregar pacientes:', error);
        showError('Erro ao carregar lista de pacientes: ' + error.message);
        formState.pacientes = [];
    } finally {
        hideLoader();
    }
}

/**
 * Carrega lista de profissionais ativos
 */
async function loadProfissionais() {
    try {
        console.log('🔄 Carregando profissionais...');
        showLoader();
        
        const response = await pegarProfissionaisAtivos();
        console.log('📡 Resposta de profissionais:', response);
        
        // Verifica se a resposta tem a estrutura esperada
        if (response && response.success && response.data) {
            formState.profissionais = response.data;
            console.log('✅ Profissionais carregados:', formState.profissionais.length);
        } else if (Array.isArray(response)) {
            // Se a resposta é um array direto
            formState.profissionais = response;
            console.log('✅ Profissionais carregados (array direto):', formState.profissionais.length);
        } else {
            console.warn('⚠️ Estrutura de resposta inesperada para profissionais:', response);
            formState.profissionais = [];
        }
        
        populateProfissionaisSelect();
        updateLoadingStatus(); // Atualiza status do botão
        
    } catch (error) {
        console.error('❌ Erro ao carregar profissionais:', error);
        showError('Erro ao carregar lista de profissionais: ' + error.message);
        formState.profissionais = [];
    } finally {
        hideLoader();
    }
}

/**
 * Popula o select de pacientes
 */
function populatePacientesSelect() {
    console.log('🔄 Populando select de pacientes...');
    const select = document.getElementById('idPaciente');
    
    if (!select) {
        console.error('❌ Select de pacientes não encontrado!');
        return;
    }
    
    console.log('📋 Pacientes disponíveis:', formState.pacientes.length);
    
    // Limpa opções existentes
    select.innerHTML = '<option value="">Selecione um paciente</option>';
    
    // Verifica se há pacientes
    if (!formState.pacientes || formState.pacientes.length === 0) {
        console.warn('⚠️ Nenhum paciente encontrado');
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum paciente encontrado';
        option.disabled = true;
        select.appendChild(option);
        return;
    }
    
    // Adiciona pacientes
    formState.pacientes.forEach((paciente, index) => {
        console.log(`👤 Adicionando paciente ${index + 1}:`, paciente.nomePessoa);
        const option = document.createElement('option');
        option.value = paciente.idPaciente;
        option.textContent = `${paciente.nomePessoa} - CPF: ${formatCPF(paciente.cpfPessoa)}`;
        select.appendChild(option);
    });
    
    console.log('✅ Select de pacientes populado com', formState.pacientes.length, 'opções');
}

/**
 * Popula o select de profissionais
 */
function populateProfissionaisSelect() {
    console.log('🔄 Populando select de profissionais...');
    const select = document.getElementById('idProfissional');
    
    if (!select) {
        console.error('❌ Select de profissionais não encontrado!');
        return;
    }
    
    console.log('👨‍⚕️ Profissionais disponíveis:', formState.profissionais.length);
    
    // Limpa opções existentes
    select.innerHTML = '<option value="">Selecione um profissional</option>';
    
    // Verifica se há profissionais
    if (!formState.profissionais || formState.profissionais.length === 0) {
        console.warn('⚠️ Nenhum profissional encontrado');
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum profissional encontrado';
        option.disabled = true;
        select.appendChild(option);
        return;
    }
    
    // Adiciona profissionais
    formState.profissionais.forEach((profissional, index) => {
        console.log(`👨‍⚕️ Adicionando profissional ${index + 1}:`, profissional.nomePessoa);
        const option = document.createElement('option');
        option.value = profissional.idProfissional;
        option.textContent = `${profissional.nomePessoa} - ${profissional.especialidade || 'Psicólogo'}`;
        select.appendChild(option);
    });
    
    console.log('✅ Select de profissionais populado com', formState.profissionais.length, 'opções');
}

/**
 * Configura máscaras dos campos
 */
function setupFieldMasks() {
    // Máscara para CPF do responsável
    const cpfField = document.getElementById('cpfResponsavel');
    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            // Remove caracteres não numéricos
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Aplica a máscara
            e.target.value = formatCPF(value);
            
            // Valida em tempo real se há valor
            if (value.length > 0) {
                validateField(e.target);
            }
        });
        
        // Placeholder dinâmico
        cpfField.placeholder = '000.000.000-00';
    }
}

/**
 * Configura validação em tempo real
 */
function setupRealTimeValidation() {
    const form = document.getElementById('form-anamnese');
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        // Validação ao sair do campo
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Limpa erro ao digitar
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

/**
 * Configura contador de caracteres para observações
 */
function setupCharacterCounter() {
    const observacoesField = document.getElementById('observacoes');
    const contador = document.getElementById('contador-caracteres');
    
    if (observacoesField && contador) {
        observacoesField.addEventListener('input', function() {
            const length = this.value.length;
            contador.textContent = `${length}/500`;
            
            if (length > 450) {
                contador.classList.add('text-orange-500');
            } else {
                contador.classList.remove('text-orange-500');
            }
            
            if (length >= 500) {
                contador.classList.add('text-red-500');
                contador.classList.remove('text-orange-500');
            } else {
                contador.classList.remove('text-red-500');
            }
        });
    }
}

/**
 * Define data/hora atual como padrão
 */
function setDefaultDateTime() {
    const dataField = document.getElementById('dataAnamnese');
    
    if (dataField) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        dataField.value = localDateTime;
    }
}

/**
 * Manipula o submit do formulário
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (formState.isSubmitting) {
        return;
    }
    
    const form = e.target;
    
    // Valida todos os campos
    if (!validateForm(form)) {
        showError('Por favor, corrija os erros no formulário');
        return;
    }
    
    try {
        formState.isSubmitting = true;
        showLoader();
        
        const formData = collectFormData(form);
        const response = await cadastrarAnamnese(formData);
        
        showSuccess('Anamnese cadastrada com sucesso!');
        
        // Limpa o formulário após sucesso
        form.reset();
        setDefaultDateTime();
        
        // Reseleciona valores padrão
        const statusSelect = document.getElementById('statusAnamnese');
        if (statusSelect) {
            statusSelect.value = 'PENDENTE';
        }
        
        // Marca radio buttons padrão
        const autorizacaoSim = document.querySelector('input[name="autorizacaoVisualizacao"][value="true"]');
        const statusFuncionalAtivo = document.querySelector('input[name="statusFuncional"][value="true"]');
        
        if (autorizacaoSim) autorizacaoSim.checked = true;
        if (statusFuncionalAtivo) statusFuncionalAtivo.checked = true;
        
        // Reseta contador de caracteres
        const contador = document.getElementById('contador-caracteres');
        if (contador) contador.textContent = '0';
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = '/view/html/anamnese/anamnese.html';
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erro ao cadastrar anamnese:', error);
        
        // Tratamento específico para diferentes tipos de erro
        let errorMessage = 'Erro ao cadastrar anamnese';
        
        if (error.message) {
            if (error.message.includes('CPF')) {
                errorMessage = 'Erro no CPF do responsável. Verifique se está correto.';
            } else if (error.message.includes('Data too long')) {
                errorMessage = 'Alguns campos estão muito longos. Reduza o texto e tente novamente.';
            } else if (error.message.includes('Duplicate entry')) {
                errorMessage = 'Já existe uma anamnese para este paciente nesta data.';
            } else if (error.message.includes('Foreign key')) {
                errorMessage = 'Paciente ou profissional inválido. Recarregue a página e tente novamente.';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            } else {
                errorMessage = error.message;
            }
        }
        
        showError(errorMessage);
    } finally {
        formState.isSubmitting = false;
        hideLoader();
    }
}

/**
 * Coleta dados do formulário
 */
function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Coleta todos os campos
    for (let [key, value] of formData.entries()) {
        // Converte strings para tipos corretos
        if (key === 'idPaciente' || key === 'idProfissional') {
            data[key] = parseInt(value);
        } else if (key === 'autorizacaoVisualizacao' || key === 'statusFuncional') {
            data[key] = value === 'true';
        } else if (key === 'dataAnamnese') {
            data[key] = value; // LocalDateTime será tratado pelo backend
        } else {
            data[key] = value;
        }
    }
    
    // Remove formatação do CPF do responsável
    if (data.cpfResponsavel) {
        data.cpfResponsavel = data.cpfResponsavel.replace(/\D/g, '');
        // Se estiver vazio, remove do objeto
        if (!data.cpfResponsavel) {
            delete data.cpfResponsavel;
        }
    }
    
    // Remove campos vazios opcionais
    if (!data.nomeResponsavel) {
        delete data.nomeResponsavel;
    }
    
    if (!data.observacoes) {
        delete data.observacoes;
    }
    
    return data;
}

/**
 * Valida o formulário completo
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Valida um campo específico
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Validações específicas por campo
    switch (fieldName) {
        case 'idPaciente':
            if (!value) {
                errorMessage = 'Paciente é obrigatório';
                isValid = false;
            }
            break;
            
        case 'idProfissional':
            if (!value) {
                errorMessage = 'Profissional é obrigatório';
                isValid = false;
            }
            break;
            
        case 'dataAnamnese':
            if (!value) {
                errorMessage = 'Data da anamnese é obrigatória';
                isValid = false;
            }
            break;
            
        case 'cpfResponsavel':
            if (value) {
                const cpf = value.replace(/\D/g, '');
                if (cpf.length > 0 && cpf.length < 11) {
                    errorMessage = 'CPF deve ter 11 dígitos';
                    isValid = false;
                } else if (cpf.length === 11 && !isValidCPF(cpf)) {
                    errorMessage = 'CPF inválido';
                    isValid = false;
                }
            }
            break;
            
        case 'statusAnamnese':
            if (!value) {
                errorMessage = 'Status da anamnese é obrigatório';
                isValid = false;
            }
            break;
            
        case 'observacoes':
            if (value.length > 500) {
                errorMessage = 'Observações devem ter no máximo 500 caracteres';
                isValid = false;
            }
            break;
    }
    
    // Validação para radio buttons
    if (field.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${fieldName}"]`);
        const isChecked = Array.from(radioGroup).some(radio => radio.checked);
        
        if (field.hasAttribute('required') && !isChecked) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        }
    }
    
    // Validação geral para campos obrigatórios
    if (field.hasAttribute('required') && !value && field.type !== 'radio') {
        errorMessage = 'Este campo é obrigatório';
        isValid = false;
    }
    
    // Mostra ou limpa erro
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Mostra erro em um campo específico
 */
function showFieldError(field, message) {
    field.classList.add('border-red-500');
    field.classList.remove('border-gray-300');
    
    // Para radio buttons, busca o container
    let container = field.parentNode;
    if (field.type === 'radio') {
        container = field.closest('.campo');
    }
    
    const errorSpan = container.querySelector('.mensagem-erro');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }
}

/**
 * Limpa erro de um campo específico
 */
function clearFieldError(field) {
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');
    
    // Para radio buttons, busca o container
    let container = field.parentNode;
    if (field.type === 'radio') {
        container = field.closest('.campo');
    }
    
    const errorSpan = container.querySelector('.mensagem-erro');
    if (errorSpan) {
        errorSpan.classList.add('hidden');
    }
}

// Funções utilitárias

/**
 * Formata CPF - versão aprimorada
 */
function formatCPF(value) {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedDigits = digits.slice(0, 11);
    
    // Aplica formatação baseada no número de dígitos
    if (limitedDigits.length <= 3) {
        return limitedDigits;
    } else if (limitedDigits.length <= 6) {
        return limitedDigits.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (limitedDigits.length <= 9) {
        return limitedDigits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
        return limitedDigits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }
}

/**
 * Valida CPF - versão flexível
 */
function isValidCPF(cpf) {
    // Remove formatação
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (123.456.789-00 é válido, mas 111.111.111-11 não)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validação do algoritmo do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

/**
 * Mostra loader
 */
function showLoader() {
    const loader = document.getElementById('loading-modal');
    if (loader) {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
        
        // Desabilita botão de submit
        const submitBtn = document.getElementById('btn-salvar-anamnese');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';
        }
    }
}

/**
 * Esconde loader
 */
function hideLoader() {
    const loader = document.getElementById('loading-modal');
    if (loader) {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
        
        // Reabilita botão de submit
        const submitBtn = document.getElementById('btn-salvar-anamnese');
        if (submitBtn && !formState.isSubmitting) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Anamnese';
        }
    }
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccess(message) {
    if (window.NotificationSystem) {
        NotificationSystem.success(message);
    } else {
        alert(message); // Fallback
    }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    if (window.NotificationSystem) {
        NotificationSystem.error(message);
    } else {
        alert(message); // Fallback
    }
}

/**
 * Configura layout responsivo
 */
function setupResponsiveLayout() {
    // Ajusta layout baseado no tamanho da tela
    function adjustLayout() {
        const form = document.getElementById('form-anamnese');
        const isMobile = window.innerWidth < 640;
        
        if (form) {
            // Para mobile, ajusta espaçamentos
            if (isMobile) {
                form.classList.add('mobile-layout');
            } else {
                form.classList.remove('mobile-layout');
            }
        }
    }
    
    // Executa na inicialização
    adjustLayout();
    
    // Executa ao redimensionar
    window.addEventListener('resize', adjustLayout);
}

/**
 * Verifica se o formulário está pronto para ser enviado
 */
function isFormReady() {
    const pacienteSelect = document.getElementById('idPaciente');
    const profissionalSelect = document.getElementById('idProfissional');
    
    return pacienteSelect?.options?.length > 1 && profissionalSelect?.options?.length > 1;
}

/**
 * Mostra status de carregamento dos dados
 */
function updateLoadingStatus() {
    const submitBtn = document.getElementById('btn-salvar-anamnese');
    
    if (!isFormReady()) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Carregando dados...';
        }
    } else {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Anamnese';
        }
    }
}

// Adiciona estilos CSS dinâmicos para mobile
const style = document.createElement('style');
style.textContent = `
    .mobile-layout .grid-cols-1.sm\\:grid-cols-2 {
        grid-template-columns: 1fr !important;
    }
    .mobile-layout .campo {
        margin-bottom: 1rem;
    }
    .campo .mensagem-erro {
        transition: all 0.3s ease;
    }
    .border-red-500 {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 1px #ef4444;
    }
`;
document.head.appendChild(style);
