/**
 * @fileoverview Script para cadastro de administradores (profissionais master)
 * Gerencia o formulário de cadastro de administradores do sistema
 * @version 1.0
 * @author Sistema Psyclin
 */

/**
 * Inicializa o sistema de cadastro de administrador
 */
function initCadastroAdmin() {
    console.log('🚀 Inicializando sistema de cadastro de administrador...');
    
    const form = document.getElementById('form-admin');
    if (!form) {
        console.error('❌ Formulário de administrador não encontrado');
        return;
    }

    // Event listener para submit do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Configurar máscaras de entrada
    setupInputMasks();
    
    // Validações em tempo real
    setupRealTimeValidation();
    
    // Carregar dados dos selects
    loadSelectData();
    
    // Marcar campos fixos como ADMIN
    setAdminDefaults();
    
    console.log('✅ Sistema de cadastro de administrador inicializado');
}

/**
 * Define valores padrão para administrador
 */
function setAdminDefaults() {
    // Tipo fixo como ADMIN (valor 5 para administrador)
    const tipoSelect = document.getElementById('tipoProfissional');
    if (tipoSelect) {
        tipoSelect.value = '5'; // ADMIN
        tipoSelect.disabled = true;
    }
    
    // Conselho fixo como ADMIN
    const conselhoSelect = document.getElementById('conselhoProfissional');
    if (conselhoSelect) {
        conselhoSelect.value = 'ADMIN';
        conselhoSelect.disabled = true;
    }
    
    // Status ativo por padrão
    const statusSelect = document.getElementById('statusProfissional');
    if (statusSelect) {
        statusSelect.value = '1'; // Ativo
    }
}

/**
 * Configura máscaras de entrada nos campos
 */
function setupInputMasks() {
    // Máscara de CPF
    const cpfInput = document.getElementById('cpfPessoa');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
        
        // Buscar endereço ao sair do campo
        cepInput.addEventListener('blur', buscarEnderecoPorCep);
    }

    // Limitação de caracteres para campos específicos
    const nomePessoaInput = document.getElementById('nomePessoa');
    if (nomePessoaInput) {
        nomePessoaInput.maxLength = 100;
    }

    const logradouroInput = document.getElementById('logradouro');
    if (logradouroInput) {
        logradouroInput.maxLength = 100;
    }

    const numeroInput = document.getElementById('numero');
    if (numeroInput) {
        numeroInput.maxLength = 10;
    }

    const complementoInput = document.getElementById('complemento');
    if (complementoInput) {
        complementoInput.maxLength = 100;
    }

    const bairroInput = document.getElementById('bairro');
    if (bairroInput) {
        bairroInput.maxLength = 100;
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.maxLength = 100;
    }
}

/**
 * Busca endereço pelo CEP
 */
async function buscarEnderecoPorCep(event) {
    const cep = event.target.value.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('logradouro').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.localidade || '';
            
            // Selecionar estado
            const estadoSelect = document.getElementById('estado');
            if (estadoSelect && data.uf) {
                estadoSelect.value = data.uf;
            }
        }
    } catch (error) {
        console.warn('Erro ao buscar CEP:', error);
    }
}

/**
 * Carrega dados dos selects
 */
function loadSelectData() {
    // Carregar estados
    loadEstados();
}

/**
 * Carrega lista de estados
 */
function loadEstados() {
    const estadoSelect = document.getElementById('estado');
    if (!estadoSelect) return;

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

    estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.sigla;
        option.textContent = `${estado.sigla} - ${estado.nome}`;
        estadoSelect.appendChild(option);
    });
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
        
        // Coleta os dados do formulário - ESTRUTURA PARA ADMINISTRADOR
        const dadosAdmin = {
            // Dados Pessoais Obrigatórios
            nomePessoa: formData.get('nomePessoa')?.trim(),
            cpfPessoa: formData.get('cpfPessoa')?.replace(/\D/g, ''), // Remove formatação
            dataNascPessoa: formData.get('dataNascPessoa'),
            sexoPessoa: formData.get('sexoPessoa'),
            
            // Dados Profissionais Fixos para ADMIN
            tipoProfissional: 5, // ADMIN
            conselhoProfissional: 'ADMIN',
            codigoProfissional: formData.get('codigoProfissional')?.trim(),
            
            // Dados Profissionais Opcionais
            especialidade: 'Administrador do Sistema',
            supervisor: null, // Admin não tem supervisor
            statusProfissional: parseInt(formData.get('statusProfissional')) || 1,
            
            // Dados de Contato Obrigatórios
            telefone: formData.get('telefone')?.replace(/\D/g, ''), // Remove formatação
            email: formData.get('email')?.trim(),
            
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

        // Validação básica
        const validationResult = validateAdminData(dadosAdmin);
        if (!validationResult.isValid) {
            showError(validationResult.message);
            return;
        }

        console.log('📝 Enviando dados do administrador:', dadosAdmin);

        // Chama a API para cadastrar (usa a mesma função do profissional)
        const resultado = await window.apiManager.cadastrarProfissional(dadosAdmin);
        
        console.log('✅ Administrador cadastrado com sucesso:', resultado);
        
        // Mostra mensagem de sucesso
        showSuccess('Administrador cadastrado com sucesso!');
        
        // Limpa o formulário
        form.reset();
        setAdminDefaults(); // Redefine valores padrão
        
        // Redireciona após um breve delay
        setTimeout(() => {
            window.location.href = '/view/html/cadastro/cadastro.html';
        }, 2000);
        
    } catch (error) {
        console.error('💥 Erro ao cadastrar administrador:', error);
        showError('Erro ao cadastrar administrador: ' + error.message);
    } finally {
        showLoader(false);
    }
}

/**
 * Valida os dados do administrador
 */
function validateAdminData(dados) {
    // Validações dos campos obrigatórios de PessoaFisica
    if (!dados.nomePessoa) {
        return { isValid: false, message: 'Nome é obrigatório' };
    }

    if (dados.nomePessoa.length < 2 || dados.nomePessoa.length > 100) {
        return { isValid: false, message: 'Nome deve ter entre 2 e 100 caracteres' };
    }

    if (!dados.cpfPessoa) {
        return { isValid: false, message: 'CPF é obrigatório' };
    }

    if (dados.cpfPessoa.length !== 11) {
        return { isValid: false, message: 'CPF deve ter exatamente 11 dígitos' };
    }

    if (!isValidCPF(dados.cpfPessoa)) {
        return { isValid: false, message: 'CPF inválido' };
    }

    if (!dados.dataNascPessoa) {
        return { isValid: false, message: 'Data de nascimento é obrigatória' };
    }

    if (!dados.sexoPessoa) {
        return { isValid: false, message: 'Sexo é obrigatório' };
    }

    if (!['M', 'F'].includes(dados.sexoPessoa)) {
        return { isValid: false, message: 'Sexo deve ser M ou F' };
    }

    // Validações específicas do administrador
    if (!dados.codigoProfissional) {
        return { isValid: false, message: 'Código de administrador é obrigatório' };
    }

    // Validações dos campos obrigatórios de Contato
    if (!dados.telefone) {
        return { isValid: false, message: 'Telefone é obrigatório' };
    }

    if (dados.telefone.length < 10 || dados.telefone.length > 12) {
        return { isValid: false, message: 'Telefone deve ter entre 10 e 12 dígitos' };
    }

    // Validações dos campos obrigatórios de Email
    if (!dados.email) {
        return { isValid: false, message: 'Email é obrigatório' };
    }

    if (dados.email.length > 100) {
        return { isValid: false, message: 'Email deve ter no máximo 100 caracteres' };
    }

    if (!isValidEmail(dados.email)) {
        return { isValid: false, message: 'Email inválido' };
    }

    // Validações dos campos obrigatórios de Endereço
    if (!dados.cep) {
        return { isValid: false, message: 'CEP é obrigatório' };
    }

    if (dados.cep.length !== 8) {
        return { isValid: false, message: 'CEP deve ter exatamente 8 dígitos' };
    }

    if (!dados.logradouro) {
        return { isValid: false, message: 'Logradouro é obrigatório' };
    }

    if (dados.logradouro.length > 100) {
        return { isValid: false, message: 'Logradouro deve ter no máximo 100 caracteres' };
    }

    if (!dados.numero) {
        return { isValid: false, message: 'Número é obrigatório' };
    }

    if (dados.numero.length > 10) {
        return { isValid: false, message: 'Número deve ter no máximo 10 caracteres' };
    }

    if (!dados.bairro) {
        return { isValid: false, message: 'Bairro é obrigatório' };
    }

    if (dados.bairro.length > 100) {
        return { isValid: false, message: 'Bairro deve ter no máximo 100 caracteres' };
    }

    if (!dados.cidade) {
        return { isValid: false, message: 'Cidade é obrigatória' };
    }

    if (!dados.estado) {
        return { isValid: false, message: 'Estado é obrigatório' };
    }

    // Validações de campos opcionais (se preenchidos)
    if (dados.complemento && dados.complemento.length > 100) {
        return { isValid: false, message: 'Complemento deve ter no máximo 100 caracteres' };
    }

    return { isValid: true };
}

/**
 * Valida CPF
 */
function isValidCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    // Verifica se os dígitos calculados são iguais aos informados
    return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Configura validação em tempo real para todos os campos obrigatórios
 */
function setupRealTimeValidation() {
    const form = document.getElementById('form-admin');
    if (!form) return;

    // Validação de CPF
    const cpfInput = form.querySelector('#cpfPessoa');
    if (cpfInput) {
        cpfInput.addEventListener('blur', () => {
            const cpf = cpfInput.value.replace(/\D/g, '');
            const errorSpan = cpfInput.nextElementSibling;
            
            if (!cpf) {
                showFieldError(cpfInput, errorSpan, 'CPF é obrigatório');
            } else if (cpf.length !== 11) {
                showFieldError(cpfInput, errorSpan, 'CPF deve ter 11 dígitos');
            } else if (!isValidCPF(cpf)) {
                showFieldError(cpfInput, errorSpan, 'CPF inválido');
            } else {
                hideFieldError(cpfInput, errorSpan);
            }
        });
    }

    // Validação de data de nascimento
    const dataNascInput = form.querySelector('#dataNascPessoa');
    if (dataNascInput) {
        dataNascInput.addEventListener('blur', () => {
            const data = dataNascInput.value;
            const errorSpan = dataNascInput.nextElementSibling;
            
            if (!data) {
                showFieldError(dataNascInput, errorSpan, 'Data de nascimento é obrigatória');
            } else {
                const hoje = new Date();
                const nascimento = new Date(data);
                const idade = hoje.getFullYear() - nascimento.getFullYear();
                
                if (idade < 18 || idade > 80) {
                    showFieldError(dataNascInput, errorSpan, 'Idade deve estar entre 18 e 80 anos para administradores');
                } else {
                    hideFieldError(dataNascInput, errorSpan);
                }
            }
        });
    }

    // Validação de email
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            const errorSpan = emailInput.nextElementSibling;
            
            if (!email) {
                showFieldError(emailInput, errorSpan, 'Email é obrigatório');
            } else if (email.length > 100) {
                showFieldError(emailInput, errorSpan, 'Email deve ter no máximo 100 caracteres');
            } else if (!isValidEmail(email)) {
                showFieldError(emailInput, errorSpan, 'Email inválido');
            } else {
                hideFieldError(emailInput, errorSpan);
            }
        });
    }

    // Validação de telefone
    const telefoneInput = form.querySelector('#telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('blur', () => {
            const telefone = telefoneInput.value.replace(/\D/g, '');
            const errorSpan = telefoneInput.nextElementSibling;
            
            if (!telefone) {
                showFieldError(telefoneInput, errorSpan, 'Telefone é obrigatório');
            } else if (telefone.length < 10 || telefone.length > 12) {
                showFieldError(telefoneInput, errorSpan, 'Telefone deve ter entre 10 e 12 dígitos');
            } else {
                hideFieldError(telefoneInput, errorSpan);
            }
        });
    }

    // Validação de nome
    const nomeInput = form.querySelector('#nomePessoa');
    if (nomeInput) {
        nomeInput.addEventListener('blur', () => {
            const nome = nomeInput.value.trim();
            const errorSpan = nomeInput.nextElementSibling;
            
            if (!nome) {
                showFieldError(nomeInput, errorSpan, 'Nome é obrigatório');
            } else if (nome.length < 2) {
                showFieldError(nomeInput, errorSpan, 'Nome deve ter pelo menos 2 caracteres');
            } else if (nome.length > 100) {
                showFieldError(nomeInput, errorSpan, 'Nome deve ter no máximo 100 caracteres');
            } else {
                hideFieldError(nomeInput, errorSpan);
            }
        });
    }

    // Validação de código
    const codigoInput = form.querySelector('#codigoProfissional');
    if (codigoInput) {
        codigoInput.addEventListener('blur', () => {
            const codigo = codigoInput.value.trim();
            const errorSpan = codigoInput.nextElementSibling;
            
            if (!codigo) {
                showFieldError(codigoInput, errorSpan, 'Código de administrador é obrigatório');
            } else if (codigo.length < 3) {
                showFieldError(codigoInput, errorSpan, 'Código deve ter pelo menos 3 caracteres');
            } else {
                hideFieldError(codigoInput, errorSpan);
            }
        });
    }

    // Demais validações de endereço...
    const cepInput = form.querySelector('#cep');
    if (cepInput) {
        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            const errorSpan = cepInput.nextElementSibling;
            
            if (!cep) {
                showFieldError(cepInput, errorSpan, 'CEP é obrigatório');
            } else if (cep.length !== 8) {
                showFieldError(cepInput, errorSpan, 'CEP deve ter 8 dígitos');
            } else {
                hideFieldError(cepInput, errorSpan);
            }
        });
    }
}

/**
 * Mostra erro no campo
 */
function showFieldError(input, errorSpan, message) {
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }
    input.classList.add('border-red-500');
    input.classList.remove('border-green-500');
}

/**
 * Oculta erro no campo
 */
function hideFieldError(input, errorSpan) {
    if (errorSpan) {
        errorSpan.classList.add('hidden');
    }
    input.classList.remove('border-red-500');
    input.classList.add('border-green-500');
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
    // Usa o sistema de notificações global se disponível
    if (typeof window.NotificationSystem !== 'undefined' && window.NotificationSystem.show) {
        window.NotificationSystem.show(message, 'success');
    } else if (typeof window.showSuccess === 'function') {
        window.showSuccess(message);
    } else {
        // Criar notificação visual
        createNotification(message, 'success');
    }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    // Usa o sistema de notificações global se disponível
    if (typeof window.NotificationSystem !== 'undefined' && window.NotificationSystem.show) {
        window.NotificationSystem.show(message, 'error');
    } else if (typeof window.showError === 'function') {
        window.showError(message);
    } else {
        // Criar notificação visual
        createNotification(message, 'error');
    }
}

/**
 * Cria notificação visual
 */
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

/**
 * Limpa os campos do formulário com confirmação
 */
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        const form = document.getElementById('form-admin');
        if (form) {
            form.reset();
            setAdminDefaults(); // Redefine valores padrão para admin
            
            // Remove classes de validação
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.classList.remove('border-red-500', 'border-green-500');
                const errorSpan = input.nextElementSibling;
                if (errorSpan && errorSpan.classList.contains('hidden')) {
                    errorSpan.classList.add('hidden');
                }
            });
        }
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCadastroAdmin);

// Exporta para uso global se necessário
window.initCadastroAdmin = initCadastroAdmin;
window.limparFormulario = limparFormulario;
