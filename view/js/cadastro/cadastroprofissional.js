/**
 * @fileoverview Script para cadastro de profissionais
 * Gerencia o formulário de cadastro de novos profissionais
 * @version 1.0
 * @author Sistema Psyclin
 */

import { cadastrarProfissional } from '../services/apiManager.js';

/**
 * Inicializa o sistema de cadastro de profissionais
 */
function initCadastroProfissional() {
    console.log('🚀 Inicializando sistema de cadastro de profissional...');
    
    const form = document.getElementById('form-profissional');
    if (!form) {
        console.error('❌ Formulário de profissional não encontrado');
        return;
    }

    // Event listener para submit do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Validações em tempo real
    setupRealTimeValidation();
    
    console.log('✅ Sistema de cadastro de profissional inicializado');
}

/**
 * Manipula o envio do formulário
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        showLoader(true);
        
        // Coleta os dados do formulário
        const dadosProfissional = {
            nomePessoa: formData.get('nomePessoa')?.trim(),
            codigoProfissional: formData.get('codigoProfissional')?.trim(),
            conselhoProfissional: formData.get('conselhoProfissional')?.trim(),
            tipoProfissional: parseInt(formData.get('tipoProfissional')) || 0,
            especialidade: formData.get('especialidade')?.trim(),
            telefone: formData.get('telefone')?.trim(),
            email: formData.get('email')?.trim(),
            nomeUsuario: formData.get('nomeUsuario')?.trim(),
            senhaUsuario: formData.get('senhaUsuario')?.trim(),
            statusProfissional: 1 // Ativo por padrão
        };

        // Validação básica
        const validationResult = validateProfissionalData(dadosProfissional);
        if (!validationResult.isValid) {
            showError(validationResult.message);
            return;
        }

        console.log('📝 Enviando dados do profissional:', dadosProfissional);

        // Chama a API para cadastrar
        const resultado = await cadastrarProfissional(dadosProfissional);
        
        console.log('✅ Profissional cadastrado com sucesso:', resultado);
        
        // Mostra mensagem de sucesso
        showSuccess('Profissional cadastrado com sucesso!');
        
        // Limpa o formulário
        form.reset();
        
        // Redireciona após um breve delay
        setTimeout(() => {
            window.location.href = '/view/html/cadastro/cadastro.html';
        }, 2000);
        
    } catch (error) {
        console.error('💥 Erro ao cadastrar profissional:', error);
        showError('Erro ao cadastrar profissional: ' + error.message);
    } finally {
        showLoader(false);
    }
}

/**
 * Valida os dados do profissional
 */
function validateProfissionalData(dados) {
    if (!dados.nomePessoa) {
        return { isValid: false, message: 'Nome é obrigatório' };
    }

    if (dados.nomePessoa.length < 2) {
        return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    }

    if (!dados.codigoProfissional) {
        return { isValid: false, message: 'Código profissional é obrigatório' };
    }

    if (!dados.conselhoProfissional) {
        return { isValid: false, message: 'Conselho profissional é obrigatório' };
    }

    if (dados.email && !isValidEmail(dados.email)) {
        return { isValid: false, message: 'Email inválido' };
    }

    if (!dados.nomeUsuario) {
        return { isValid: false, message: 'Nome de usuário é obrigatório' };
    }

    if (!dados.senhaUsuario) {
        return { isValid: false, message: 'Senha é obrigatória' };
    }

    if (dados.senhaUsuario.length < 6) {
        return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
    }

    return { isValid: true };
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Configura validação em tempo real
 */
function setupRealTimeValidation() {
    const form = document.getElementById('form-profissional');
    if (!form) return;

    // Validação de email
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            const errorSpan = emailInput.nextElementSibling;
            
            if (email && !isValidEmail(email)) {
                errorSpan.textContent = 'Email inválido';
                errorSpan.classList.remove('hidden');
                emailInput.classList.add('border-red-500');
            } else {
                errorSpan.classList.add('hidden');
                emailInput.classList.remove('border-red-500');
            }
        });
    }

    // Validação de nome
    const nomeInput = form.querySelector('#nomePessoa');
    if (nomeInput) {
        nomeInput.addEventListener('blur', () => {
            const nome = nomeInput.value.trim();
            const errorSpan = nomeInput.nextElementSibling;
            
            if (nome.length < 2) {
                errorSpan.textContent = 'Nome deve ter pelo menos 2 caracteres';
                errorSpan.classList.remove('hidden');
                nomeInput.classList.add('border-red-500');
            } else {
                errorSpan.classList.add('hidden');
                nomeInput.classList.remove('border-red-500');
            }
        });
    }

    // Validação de senha
    const senhaInput = form.querySelector('#senhaUsuario');
    if (senhaInput) {
        senhaInput.addEventListener('input', () => {
            const senha = senhaInput.value;
            const errorSpan = senhaInput.nextElementSibling;
            
            if (senha.length < 6 && senha.length > 0) {
                errorSpan.textContent = 'Senha deve ter pelo menos 6 caracteres';
                errorSpan.classList.remove('hidden');
                senhaInput.classList.add('border-red-500');
            } else {
                errorSpan.classList.add('hidden');
                senhaInput.classList.remove('border-red-500');
            }
        });
    }
}

/**
 * Mostra loader
 */
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
            loader.classList.add('flex');
        } else {
            loader.classList.add('hidden');
            loader.classList.remove('flex');
        }
    }
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccess(message) {
    // Usa a função global se disponível, senão mostra alert
    if (typeof window.showSuccess === 'function') {
        window.showSuccess(message);
    } else {
        alert('✅ ' + message);
    }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    // Usa a função global se disponível, senão mostra alert
    if (typeof window.showError === 'function') {
        window.showError(message);
    } else {
        alert('❌ ' + message);
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCadastroProfissional);

// Exporta para uso global se necessário
window.initCadastroProfissional = initCadastroProfissional;
