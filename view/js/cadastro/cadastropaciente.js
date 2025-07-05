/**
 * @fileoverview Gerenciador de cadastro de paciente
 * @version 1.0
 * @author Sistema Psyclin
 */

// Importações
import { cadastrarPaciente } from '../services/apiManager.js';

// Estado do formulário
let formState = {
    isSubmitting: false,
    isValid: false
};

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastroPaciente();
});

/**
 * Inicializa o sistema de cadastro de paciente
 */
function initializeCadastroPaciente() {
    const form = document.getElementById('form-paciente');
    
    if (!form) {
        console.error('Formulário de cadastro não encontrado');
        return;
    }

    // Configura máscaras dos campos
    setupFieldMasks();
    
    // Configura validação em tempo real
    setupRealTimeValidation();
    
    // Configura busca automática de endereço por CEP
    setupCepLookup();
    
    // Configura submit do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Inicializa ícones
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Configura máscaras dos campos
 */
function setupFieldMasks() {
    // Máscara para CPF
    const cpfField = document.getElementById('cpfPessoa');
    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }

    // Máscara para CEP
    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('input', function(e) {
            e.target.value = formatCEP(e.target.value);
        });
    }

    // Máscaras para telefones
    const telefoneField = document.getElementById('telefone');
    if (telefoneField) {
        telefoneField.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }

    const celularField = document.getElementById('celular');
    if (celularField) {
        celularField.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
}

/**
 * Configura validação em tempo real
 */
function setupRealTimeValidation() {
    const form = document.getElementById('form-paciente');
    const fields = form.querySelectorAll('input, select');
    
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
 * Configura busca automática de endereço por CEP
 */
function setupCepLookup() {
    const cepField = document.getElementById('cep');
    
    if (cepField) {
        cepField.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                buscarEnderecoPorCEP(cep);
            }
        });
    }
}

/**
 * Busca endereço por CEP usando API ViaCEP
 */
async function buscarEnderecoPorCEP(cep) {
    try {
        showLoader();
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            preencherEndereco(data);
        } else {
            showError('CEP não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showError('Erro ao buscar endereço');
    } finally {
        hideLoader();
    }
}

/**
 * Preenche campos de endereço com dados do CEP
 */
function preencherEndereco(data) {
    const logradouroField = document.getElementById('logradouro');
    const bairroField = document.getElementById('bairro');
    const cidadeField = document.getElementById('cidade');
    const estadoField = document.getElementById('estado');
    
    if (logradouroField && data.logradouro) {
        logradouroField.value = data.logradouro;
    }
    
    if (bairroField && data.bairro) {
        bairroField.value = data.bairro;
    }
    
    if (cidadeField && data.localidade) {
        cidadeField.value = data.localidade;
    }
    
    if (estadoField && data.uf) {
        estadoField.value = data.uf;
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
        const response = await cadastrarPaciente(formData);
        
        showSuccess('Paciente cadastrado com sucesso!');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = '/view/html/cadastro/cadastro.html';
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        showError(error.message || 'Erro ao cadastrar paciente');
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
        data[key] = value;
    }
    
    // Remove formatação dos campos
    if (data.cpfPessoa) {
        data.cpfPessoa = data.cpfPessoa.replace(/\D/g, '');
    }
    
    if (data.cep) {
        data.cep = data.cep.replace(/\D/g, '');
    }
    
    if (data.telefone) {
        data.telefone = data.telefone.replace(/\D/g, '');
    }
    
    if (data.celular) {
        data.celular = data.celular.replace(/\D/g, '');
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
        case 'nomePessoa':
            if (!value) {
                errorMessage = 'Nome é obrigatório';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                isValid = false;
            }
            break;
            
        case 'cpfPessoa':
            const cpf = value.replace(/\D/g, '');
            if (!cpf) {
                errorMessage = 'CPF é obrigatório';
                isValid = false;
            } else if (!isValidCPF(cpf)) {
                errorMessage = 'CPF inválido';
                isValid = false;
            }
            break;
            
        case 'email':
            if (value && !isValidEmail(value)) {
                errorMessage = 'Email inválido';
                isValid = false;
            }
            break;
            
        case 'dataNascimento':
            if (!value) {
                errorMessage = 'Data de nascimento é obrigatória';
                isValid = false;
            } else if (new Date(value) >= new Date()) {
                errorMessage = 'Data deve ser anterior à data atual';
                isValid = false;
            }
            break;
            
        case 'cep':
            const cep = value.replace(/\D/g, '');
            if (!cep) {
                errorMessage = 'CEP é obrigatório';
                isValid = false;
            } else if (cep.length !== 8) {
                errorMessage = 'CEP deve ter 8 dígitos';
                isValid = false;
            }
            break;
    }
    
    // Validação geral para campos obrigatórios
    if (field.hasAttribute('required') && !value) {
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
    
    const errorSpan = field.parentNode.querySelector('.mensagem-erro');
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
    
    const errorSpan = field.parentNode.querySelector('.mensagem-erro');
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
 * Formata CEP
 */
function formatCEP(value) {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata telefone
 */
function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
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
 * Valida email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
