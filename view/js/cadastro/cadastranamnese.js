/**
 * @fileoverview Gerenciador de cadastro de anamnese
 * @version 1.0
 * @author Sistema Psyclin
 */

// Importações
import { cadastrarAnamnese, pegarPacientes } from '../services/apiManager.js';

// Estado do formulário
let formState = {
    isSubmitting: false,
    pacientes: []
};

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastroAnamnese();
});

/**
 * Inicializa o sistema de cadastro de anamnese
 */
function initializeCadastroAnamnese() {
    const form = document.getElementById('form-anamnese');
    
    if (!form) {
        console.error('Formulário de cadastro não encontrado');
        return;
    }

    // Carrega lista de pacientes
    loadPacientes();
    
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
    
    // Inicializa ícones
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Carrega lista de pacientes
 */
async function loadPacientes() {
    try {
        showLoader();
        
        const response = await pegarPacientes();
        formState.pacientes = response.data || [];
        
        populatePacientesSelect();
        
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        showError('Erro ao carregar lista de pacientes');
    } finally {
        hideLoader();
    }
}

/**
 * Popula o select de pacientes
 */
function populatePacientesSelect() {
    const select = document.getElementById('idPaciente');
    
    if (!select) return;
    
    // Limpa opções existentes
    select.innerHTML = '<option value="">Selecione um paciente</option>';
    
    // Adiciona pacientes
    formState.pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.idPaciente;
        option.textContent = `${paciente.nomePessoa} - CPF: ${formatCPF(paciente.cpfPessoa)}`;
        select.appendChild(option);
    });
}

/**
 * Configura máscaras dos campos
 */
function setupFieldMasks() {
    // Máscara para CPF do responsável
    const cpfField = document.getElementById('cpfResponsavel');
    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
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
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = '/view/html/cadastro/cadastraritem.html';
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao cadastrar anamnese:', error);
        showError(error.message || 'Erro ao cadastrar anamnese');
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
            
        case 'dataAnamnese':
            if (!value) {
                errorMessage = 'Data da anamnese é obrigatória';
                isValid = false;
            }
            break;
            
        case 'cpfResponsavel':
            if (value) {
                const cpf = value.replace(/\D/g, '');
                if (cpf && !isValidCPF(cpf)) {
                    errorMessage = 'CPF do responsável inválido';
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
 * Formata CPF
 */
function formatCPF(value) {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Valida CPF
 */
function isValidCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
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
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    }
}

/**
 * Esconde loader
 */
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
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
