/**
 * @fileoverview Script para gerenciar o formulário de cadastro de paciente
 * @version 1.0.0
 */

// Estado do formulário
const formState = {
    isLoading: false,
    estados: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
        'SP', 'SE', 'TO'
    ]
};

// Configurações de validação
const validacoes = {
    nomePessoa: {
        regex: /^[a-zA-ZÀ-ÿ\s]{3,100}$/,
        mensagem: 'Nome deve conter apenas letras e espaços (3-100 caracteres)'
    },
    cpfPessoa: {
        regex: /^\d{11}$/,
        mensagem: 'CPF deve conter 11 dígitos numéricos'
    },
    rgPaciente: {
        regex: /^[a-zA-Z0-9]{1,15}$/,
        mensagem: 'RG deve conter até 15 caracteres alfanuméricos'
    },
    telefone: {
        regex: /^\d{10,11}$/,
        mensagem: 'Telefone deve conter 10 ou 11 dígitos'
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mensagem: 'Email inválido'
    },
    cep: {
        regex: /^\d{8}$/,
        mensagem: 'CEP deve conter 8 dígitos'
    },
    numero: {
        regex: /^[0-9]{1,6}$/,
        mensagem: 'Número deve conter até 6 dígitos'
    }
};

/**
 * Inicializa o formulário
 */
function inicializarFormulario() {
    try {
        preencherSelectEstados();
        configurarMascaras();
        configurarEventos();
        configurarBuscaCEP();
    } catch (erro) {
        console.error('Erro ao inicializar formulário:', erro);
        exibirErro('Erro ao inicializar formulário');
    }
}

/**
 * Preenche os selects de estados
 */
function preencherSelectEstados() {
    const selectEstadoRG = document.getElementById('estdoRgPac');
    const selectEstado = document.getElementById('estado');

    if (selectEstadoRG && selectEstado) {
        const opcoes = formState.estados.map(estado => 
            `<option value="${estado}">${estado}</option>`
        ).join('');

        selectEstadoRG.innerHTML = '<option value="">Selecione o estado</option>' + opcoes;
        selectEstado.innerHTML = '<option value="">Selecione o estado</option>' + opcoes;
    }
}

/**
 * Configura as máscaras dos campos
 */
function configurarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpfPessoa');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Aplica máscara de CPF (XXX.XXX.XXX-XX)
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
            }
            
            e.target.value = value;
            validarCampo(cpfInput, validacoes.cpfPessoa);
        });
    }

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Aplica máscara de telefone ((XX) XXXXX-XXXX)
            if (value.length > 10) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            
            e.target.value = value;
            validarCampo(telefoneInput, validacoes.telefone);
        });
    }

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            
            // Aplica máscara de CEP (XXXXX-XXX)
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            
            e.target.value = value;
            validarCampo(cepInput, validacoes.cep);
        });
    }

    // Validação em tempo real para outros campos
    Object.entries(validacoes).forEach(([id, config]) => {
        const campo = document.getElementById(id);
        if (campo && !['cpfPessoa', 'telefone', 'cep'].includes(id)) {
            campo.addEventListener('input', () => validarCampo(campo, config));
        }
    });
}

/**
 * Configura a busca de CEP
 */
function configurarBuscaCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;

    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            mostrarLoader(true);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Erro ao buscar CEP');

            const dados = await response.json();
            if (dados.erro) throw new Error('CEP não encontrado');

            // Preenche os campos de endereço
            document.getElementById('logradouro').value = dados.logradouro;
            document.getElementById('bairro').value = dados.bairro;
            document.getElementById('cidade').value = dados.localidade;
            document.getElementById('estado').value = dados.uf;

            // Valida os campos preenchidos
            validarCampo(document.getElementById('logradouro'), { regex: /./, mensagem: '' });
            validarCampo(document.getElementById('bairro'), { regex: /./, mensagem: '' });
            validarCampo(document.getElementById('cidade'), { regex: /./, mensagem: '' });
            validarCampo(document.getElementById('estado'), { regex: /./, mensagem: '' });

        } catch (erro) {
            console.error('Erro ao buscar CEP:', erro);
            exibirErro('Erro ao buscar CEP. Preencha o endereço manualmente.');
        } finally {
            mostrarLoader(false);
        }
    });
}

/**
 * Configura os eventos do formulário
 */
function configurarEventos() {
    const form = document.getElementById('form-paciente');
    if (!form) return;

    // Validação em tempo real para todos os campos
    form.querySelectorAll('input, select').forEach(campo => {
        campo.addEventListener('blur', () => {
            const config = validacoes[campo.id];
            if (config) {
                validarCampo(campo, config);
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            await salvarPaciente();
        }
    });
}

/**
 * Valida um campo específico
 * @param {HTMLInputElement} campo - Campo a ser validado
 * @param {Object} config - Configuração de validação
 * @returns {boolean} Se o campo é válido
 */
function validarCampo(campo, config) {
    const valor = campo.value.replace(/\s+/g, ' ').trim();
    const isValid = config.regex.test(valor);
    
    // Atualiza classes visuais
    campo.classList.toggle('border-red-500', !isValid);
    campo.classList.toggle('border-green-500', isValid && valor.length > 0);
    
    // Atualiza mensagem de erro
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains('mensagem-erro')) {
        mensagemErro.textContent = isValid ? '' : config.mensagem;
        mensagemErro.classList.toggle('hidden', isValid);
    }
    
    return isValid;
}

/**
 * Valida o formulário antes do envio
 */
function validarFormulario() {
    const form = document.getElementById('form-paciente');
    let isValid = true;

    // Valida campos obrigatórios
    form.querySelectorAll('[required]').forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('border-red-500');
            isValid = false;
        }
    });

    // Valida campos com regras específicas
    Object.entries(validacoes).forEach(([id, config]) => {
        const campo = document.getElementById(id);
        if (campo && campo.value.trim()) {
            if (!validarCampo(campo, config)) {
                isValid = false;
            }
        }
    });

    // Validação específica para sexo
    const sexoSelecionado = form.querySelector('input[name="sexoPessoa"]:checked');
    if (!sexoSelecionado) {
        const mensagemErro = document.querySelector('input[name="sexoPessoa"]').closest('.campo').querySelector('.mensagem-erro');
        if (mensagemErro) {
            mensagemErro.textContent = 'Selecione o sexo';
            mensagemErro.classList.remove('hidden');
        }
        isValid = false;
    }

    if (!isValid) {
        exibirErro('Por favor, corrija os erros no formulário antes de enviar.');
    }

    return isValid;
}

/**
 * Salva os dados do paciente
 */
async function salvarPaciente() {
    try {
        mostrarLoader(true);
        
        const form = document.getElementById('form-paciente');
        const formData = new FormData(form);
        
        // Prepara os dados do paciente
        const dados = {
            // Dados da Pessoa
            pessoa: {
                tipoPessoa: 'F', // Física
                emails: formData.get('email') ? [formData.get('email')] : []
            },
            
            // Dados da PessoaFis
            pessoaFis: {
                nomePessoa: formData.get('nomePessoa'),
                cpfPessoa: formData.get('cpfPessoa').replace(/\D/g, ''),
                dataNascPessoa: formData.get('dataNascPessoa'),
                sexoPessoa: formData.get('sexoPessoa')
            },
            
            // Dados do Paciente
            rgPaciente: formData.get('rgPaciente'),
            estdoRgPac: formData.get('estdoRgPac'),
            statusPac: true,
            
            // Dados de Contato
            contatos: [{
                tipoContato: { idTipoContato: 1 }, // Assumindo 1 = telefone
                numero: formData.get('telefone').replace(/\D/g, '')
            }],
            
            // Dados de Endereço
            enderecos: [{
                cep: formData.get('cep').replace(/\D/g, ''),
                logradouro: formData.get('logradouro'),
                numero: formData.get('numero'),
                complemento: formData.get('complemento') || null,
                bairro: formData.get('bairro'),
                cidade: formData.get('cidade'),
                estado: formData.get('estado')
            }]
        };
        
        // Envia para o backend
        const response = await fetch(`${CONFIG_API.baseURL}${CONFIG_API.endpoints.cadastro.paciente.path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || 'Erro ao salvar paciente');
        }

        // Sucesso
        alert('Paciente cadastrado com sucesso!');
        window.location.href = '/view/html/cadastro/cadastro.html';

    } catch (erro) {
        console.error('Erro ao salvar paciente:', erro);
        exibirErro(erro.message || 'Erro ao salvar paciente. Tente novamente.');
    } finally {
        mostrarLoader(false);
    }
}

// Inicializa o formulário quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarFormulario); 