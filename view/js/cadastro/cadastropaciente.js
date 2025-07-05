/**
 * @fileoverview Gerenciador de cadastro de paciente
 * @version 1.0
 * @author Sistema Psyclin
 */

// Importar funções da API
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
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            e.target.value = formatCPF(value);
        });
    }

    // Máscara para CEP
    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            e.target.value = formatCEP(value);
        });
    }

    // Máscara para telefone
    const telefoneField = document.getElementById('telefone');
    if (telefoneField) {
        telefoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            e.target.value = formatPhone(value);
        });
    }

    // Máscara para RG (apenas números e letras)
    const rgField = document.getElementById('rgPaciente');
    if (rgField) {
        rgField.addEventListener('input', function(e) {
            // Remove caracteres especiais, mantém apenas números e letras
            let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            if (value.length > 15) value = value.substring(0, 15);
            e.target.value = value.toUpperCase();
        });
    }

    // Filtro para nome (apenas letras e espaços)
    const nomeField = document.getElementById('nomePessoa');
    if (nomeField) {
        nomeField.addEventListener('input', function(e) {
            // Remove números e caracteres especiais
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, '');
            if (value.length > 100) value = value.substring(0, 100);
            e.target.value = value;
        });
    }

    // Filtros para campos de endereço
    const logradouroField = document.getElementById('logradouro');
    if (logradouroField) {
        logradouroField.addEventListener('input', function(e) {
            if (e.target.value.length > 100) {
                e.target.value = e.target.value.substring(0, 100);
            }
        });
    }

    const numeroField = document.getElementById('numero');
    if (numeroField) {
        numeroField.addEventListener('input', function(e) {
            // Permite números e letras (ex: 123A)
            let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            if (value.length > 10) value = value.substring(0, 10);
            e.target.value = value.toUpperCase();
        });
    }

    const bairroField = document.getElementById('bairro');
    if (bairroField) {
        bairroField.addEventListener('input', function(e) {
            if (e.target.value.length > 100) {
                e.target.value = e.target.value.substring(0, 100);
            }
        });
    }

    const cidadeField = document.getElementById('cidade');
    if (cidadeField) {
        cidadeField.addEventListener('input', function(e) {
            // Remove números, mantém apenas letras e espaços
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s]/g, '');
            if (value.length > 100) value = value.substring(0, 100);
            e.target.value = value;
        });
    }

    const complementoField = document.getElementById('complemento');
    if (complementoField) {
        complementoField.addEventListener('input', function(e) {
            if (e.target.value.length > 100) {
                e.target.value = e.target.value.substring(0, 100);
            }
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
        
        // Limpa erro ao digitar (com delay para não interferir na digitação)
        field.addEventListener('input', function() {
            const field = this;
            // Remove erro visual imediatamente
            clearFieldError(field);
            
            // Valida após parar de digitar por 500ms
            clearTimeout(field.validationTimeout);
            field.validationTimeout = setTimeout(() => {
                if (field.value.trim() !== '') {
                    validateField(field);
                }
            }, 500);
        });

        // Validação especial para radio buttons
        if (field.type === 'radio') {
            field.addEventListener('change', function() {
                const radioGroup = form.querySelectorAll(`input[name="${this.name}"]`);
                radioGroup.forEach(radio => clearFieldError(radio));
                validateField(this);
            });
        }
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
    
    // Carrega lista de estados
    loadEstados();
}

/**
 * Carrega lista de estados brasileiros
 */
function loadEstados() {
    const estados = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ];

    // Preenche os selects de estado
    const estadoSelect = document.getElementById('estado');
    const estadoRgSelect = document.getElementById('estdoRgPac');
    
    if (estadoSelect) {
        estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = `${estado.sigla} - ${estado.nome}`;
            estadoSelect.appendChild(option);
        });
    }
    
    if (estadoRgSelect) {
        estadoRgSelect.innerHTML = '<option value="">Selecione o estado</option>';
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = `${estado.sigla} - ${estado.nome}`;
            estadoRgSelect.appendChild(option);
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
        console.log('🚀 Enviando dados para a API...');
        
        const response = await cadastrarPaciente(formData);
        
        console.log('✅ Resposta da API:', response);
        showSuccess('Paciente cadastrado com sucesso!');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = '/view/html/cadastro/cadastro.html';
        }, 2000);
        
    } catch (error) {
        console.error('💥 Erro completo:', error);
        console.error('💥 Stack trace:', error.stack);
        
        // Tratamento específico de erros
        let errorMessage = 'Erro ao cadastrar paciente';
        
        if (error.message) {
            if (error.message.includes('500')) {
                errorMessage = 'Erro interno do servidor. Verifique se todos os campos estão preenchidos corretamente e se o servidor está funcionando.';
            } else if (error.message.includes('400')) {
                errorMessage = 'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.';
            } else if (error.message.includes('404')) {
                errorMessage = 'Serviço não encontrado. Verifique se o servidor está rodando.';
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
 * Coleta dados do formulário baseado na estrutura real do banco
 */
function collectFormData(form) {
    const formData = new FormData(form);
    
    // Estrutura correta baseada no PacienteRequestDTO
    const data = {
        // Dados Pessoais (PessoaFisica) - nomes corretos do DTO
        nomePessoa: formData.get('nomePessoa')?.trim(),
        cpfPessoa: formData.get('cpfPessoa')?.replace(/\D/g, ''), // Remove formatação
        dataNascimento: formData.get('dataNascPessoa'), // Nome correto no DTO
        sexo: formData.get('sexoPessoa'), // Nome correto no DTO
        
        // Dados Específicos do Paciente (obrigatórios)
        rgPaciente: formData.get('rgPaciente')?.trim(),
        estadoRg: formData.get('estdoRgPac'), // Nome correto no DTO
        
        // Dados de Contato 
        telefone: formData.get('telefone')?.replace(/\D/g, ''), // Remove formatação
        email: formData.get('email')?.trim() || null,
        
        // Dados de Endereço Obrigatórios
        cep: formData.get('cep')?.replace(/\D/g, ''), // Remove formatação
        logradouro: formData.get('logradouro')?.trim(),
        numero: formData.get('numero')?.trim(),
        bairro: formData.get('bairro')?.trim(),
        cidade: formData.get('cidade')?.trim(),
        estado: formData.get('estado')?.trim(),
        
        // Dados de Endereço Opcionais
        complemento: formData.get('complemento')?.trim() || null
    };
    
    // Log dos dados coletados para debug
    console.log('📋 Dados coletados do formulário:', data);
    
    // Verificar se há campos undefined ou vazios obrigatórios
    const camposObrigatorios = ['nomePessoa', 'cpfPessoa', 'dataNascimento', 'sexo', 'rgPaciente', 'estadoRg', 'telefone', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
    const camposVazios = camposObrigatorios.filter(campo => !data[campo]);
    
    if (camposVazios.length > 0) {
        console.warn('⚠️ Campos obrigatórios vazios:', camposVazios);
    }
    
    return data;
}

/**
 * Valida o formulário completo
 */
function validateForm(form) {
    let isValid = true;
    
    // Validar campos input e select obrigatórios
    const fields = form.querySelectorAll('input[required], select[required]');
    fields.forEach(field => {
        // Pula radio buttons duplicados (serão validados em grupo)
        if (field.type === 'radio') {
            const radioName = field.name;
            const radioGroup = form.querySelectorAll(`input[name="${radioName}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            
            // Valida apenas o primeiro radio do grupo para evitar duplicação
            if (field === radioGroup[0]) {
                if (!isChecked) {
                    showFieldValidation(field, false, 'Este campo é obrigatório');
                    isValid = false;
                } else {
                    showFieldValidation(field, true, '');
                }
            }
        } else {
            if (!validateField(field)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}

/**
 * Valida um campo específico baseado na estrutura real do banco
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
                isValid = false;
                errorMessage = 'Nome é obrigatório';
            } else if (value.length < 2 || value.length > 100) {
                isValid = false;
                errorMessage = 'Nome deve ter entre 2 e 100 caracteres';
            }
            break;
            
        case 'cpfPessoa':
            const cpfNumerico = value.replace(/\D/g, '');
            if (!cpfNumerico) {
                isValid = false;
                errorMessage = 'CPF é obrigatório';
            } else if (cpfNumerico.length !== 11) {
                isValid = false;
                errorMessage = 'CPF deve ter 11 dígitos';
            }
            // Removida validação matemática - aceita qualquer CPF com 11 dígitos
            break;
            
        case 'dataNascPessoa':
            if (!value) {
                isValid = false;
                errorMessage = 'Data de nascimento é obrigatória';
            } else {
                const hoje = new Date();
                const nascimento = new Date(value);
                const idade = hoje.getFullYear() - nascimento.getFullYear();
                
                if (idade < 0 || idade > 120) {
                    isValid = false;
                    errorMessage = 'Data de nascimento inválida';
                }
            }
            break;
            
        case 'sexoPessoa':
            // Para radio buttons, verificar se algum está selecionado
            const radioGroup = document.querySelectorAll(`input[name="${fieldName}"]`);
            const isSelected = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!isSelected) {
                isValid = false;
                errorMessage = 'Sexo é obrigatório';
            }
            break;
            
        case 'rgPaciente':
            if (!value) {
                isValid = false;
                errorMessage = 'RG é obrigatório';
            } else if (value.length < 5 || value.length > 15) {
                isValid = false;
                errorMessage = 'RG deve ter entre 5 e 15 caracteres';
            }
            break;
            
        case 'estdoRgPac':
            if (!value) {
                isValid = false;
                errorMessage = 'Estado do RG é obrigatório';
            }
            break;
            
        case 'telefone':
            const telefoneNumerico = value.replace(/\D/g, '');
            if (!telefoneNumerico) {
                isValid = false;
                errorMessage = 'Telefone é obrigatório';
            } else if (telefoneNumerico.length < 10 || telefoneNumerico.length > 12) {
                isValid = false;
                errorMessage = 'Telefone deve ter entre 10 e 12 dígitos';
            }
            break;
            
        case 'email':
            if (value && value.length > 100) {
                isValid = false;
                errorMessage = 'Email deve ter no máximo 100 caracteres';
            } else if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;
            
        case 'cep':
            const cepNumerico = value.replace(/\D/g, '');
            if (!cepNumerico) {
                isValid = false;
                errorMessage = 'CEP é obrigatório';
            } else if (cepNumerico.length !== 8) {
                isValid = false;
                errorMessage = 'CEP deve ter 8 dígitos';
            }
            break;
            
        case 'logradouro':
            if (!value) {
                isValid = false;
                errorMessage = 'Logradouro é obrigatório';
            } else if (value.length > 100) {
                isValid = false;
                errorMessage = 'Logradouro deve ter no máximo 100 caracteres';
            }
            break;
            
        case 'numero':
            if (!value) {
                isValid = false;
                errorMessage = 'Número é obrigatório';
            } else if (value.length > 10) {
                isValid = false;
                errorMessage = 'Número deve ter no máximo 10 caracteres';
            }
            break;
            
        case 'bairro':
            if (!value) {
                isValid = false;
                errorMessage = 'Bairro é obrigatório';
            } else if (value.length > 100) {
                isValid = false;
                errorMessage = 'Bairro deve ter no máximo 100 caracteres';
            }
            break;
            
        case 'cidade':
            if (!value) {
                isValid = false;
                errorMessage = 'Cidade é obrigatória';
            }
            break;
            
        case 'estado':
            if (!value) {
                isValid = false;
                errorMessage = 'Estado é obrigatório';
            }
            break;
            
        case 'complemento':
            if (value && value.length > 100) {
                isValid = false;
                errorMessage = 'Complemento deve ter no máximo 100 caracteres';
            }
            break;
    }
    
    // Mostra ou esconde erro
    showFieldValidation(field, isValid, errorMessage);
    
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
    // Remove classes de erro
    field.classList.remove('border-red-500');
    field.classList.remove('border-green-500');
    field.classList.add('border-gray-300');
    
    // Encontra o span de erro (pode estar no próprio campo ou no contêiner pai)
    let errorSpan = field.parentNode.querySelector('.mensagem-erro');
    
    // Se não encontrou, procura no contêiner pai (para radio buttons)
    if (!errorSpan && field.type === 'radio') {
        const fieldContainer = field.closest('.campo');
        if (fieldContainer) {
            errorSpan = fieldContainer.querySelector('.mensagem-erro');
        }
    }
    
    if (errorSpan) {
        errorSpan.classList.add('hidden');
        errorSpan.textContent = '';
    }
}

/**
 * Mostra/esconde validação do campo
 */
function showFieldValidation(field, isValid, errorMessage) {
    // Remove classes anteriores
    field.classList.remove('border-red-500', 'border-green-500');
    
    // Encontra o span de erro
    let errorSpan = field.parentNode.querySelector('.mensagem-erro');
    
    // Se não encontrou, procura no contêiner pai (para radio buttons)
    if (!errorSpan && field.type === 'radio') {
        const fieldContainer = field.closest('.campo');
        if (fieldContainer) {
            errorSpan = fieldContainer.querySelector('.mensagem-erro');
        }
    }
    
    if (isValid) {
        // Campo válido - borda verde
        field.classList.add('border-green-500');
        if (errorSpan) {
            errorSpan.classList.add('hidden');
            errorSpan.textContent = '';
        }
    } else {
        // Campo inválido - borda vermelha e mensagem de erro
        field.classList.add('border-red-500');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.classList.remove('hidden');
        }
    }
    
    // Para radio buttons, aplica o estilo em todos os botões do grupo
    if (field.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
        radioGroup.forEach(radio => {
            radio.classList.remove('border-red-500', 'border-green-500');
            if (isValid) {
                radio.classList.add('border-green-500');
            } else {
                radio.classList.add('border-red-500');
            }
        });
    }
}

// Funções utilitárias

/**
 * Formata CPF
 */
function formatCPF(value) {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara conforme o tamanho
    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return digits.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (digits.length <= 9) {
        return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
}

/**
 * Formata CEP
 */
function formatCEP(value) {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 5) {
        return digits;
    } else {
        return digits.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
}

/**
 * Formata telefone
 */
function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
        return digits;
    } else if (digits.length <= 6) {
        return digits.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    } else if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else {
        return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
}

/**
 * Valida CPF - versão simplificada (apenas verifica se tem 11 dígitos)
 */
function isValidCPF(cpf) {
    // Remove formatação e verifica se tem 11 dígitos
    const digits = cpf.replace(/\D/g, '');
    return digits.length === 11;
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

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastroPaciente();
    
    // Garantir que os ícones sejam carregados
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 100);
});

// Exporta para uso global se necessário
window.initializeCadastroPaciente = initializeCadastroPaciente;


