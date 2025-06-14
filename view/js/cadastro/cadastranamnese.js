/**
 * @fileoverview Script para gerenciar o formulário de cadastro de anamnese
 * @version 1.0.0
 */

// Estado do formulário
const formState = {
    pacientes: [],
    isLoading: false,
    nivelProfissional: null
};

// Configurações de validação
const validacoes = {
    nomeResponsavel: {
        regex: /^[a-zA-ZÀ-ÿ\s]{3,100}$/,
        mensagem: 'Nome deve conter apenas letras e espaços (3-100 caracteres)'
    },
    cpfResponsavel: {
        regex: /^\d{11}$/,
        mensagem: 'CPF deve conter 11 dígitos numéricos'
    },
    observacoes: {
        regex: /^[\s\S]{0,500}$/,
        mensagem: 'Observações não podem exceder 500 caracteres'
    }
};

/**
 * Inicializa o formulário de anamnese
 */
async function inicializarFormulario() {
    try {
        mostrarLoader(true);
        await carregarDadosProfissional();
        await carregarPacientes();
        configurarEventos();
        configurarMascaras();
        ajustarVisibilidadeCampos();
    } catch (erro) {
        console.error('Erro ao inicializar formulário:', erro);
        exibirErro('Erro ao carregar dados do formulário');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Carrega os dados do profissional logado
 */
async function carregarDadosProfissional() {
    try {
        const response = await fetch(`${CONFIG_API.baseURL}${CONFIG_API.endpoints.dashboard.profissionais}`);
        if (!response.ok) throw new Error('Erro ao carregar dados do profissional');
        
        const dados = await response.json();
        // Assumindo que o primeiro profissional da lista é o logado
        // TODO: Implementar lógica real de autenticação
        const profissional = dados[0];
        formState.nivelProfissional = profissional.tipoProf;
        
        // Se for nível 1 ou 2, esconde campos sensíveis
        if (formState.nivelProfissional <= 2) {
            document.querySelectorAll('.campo-nivel-superior').forEach(campo => {
                campo.classList.add('hidden');
            });
        }
    } catch (erro) {
        console.error('Erro ao carregar dados do profissional:', erro);
        throw erro;
    }
}

/**
 * Ajusta a visibilidade dos campos baseado no nível do profissional
 */
function ajustarVisibilidadeCampos() {
    const camposNivelSuperior = [
        'statusAnamnese',
        'statusFuncional'
    ];

    if (formState.nivelProfissional <= 2) {
        camposNivelSuperior.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.closest('.campo-container').classList.add('hidden');
            }
        });
    }
}

/**
 * Carrega a lista de pacientes do backend
 */
async function carregarPacientes() {
    try {
        const response = await fetch(`${CONFIG_API.baseURL}${CONFIG_API.endpoints.cadastro.paciente.path}`);
        if (!response.ok) throw new Error('Erro ao carregar pacientes');
        
        const dados = await response.json();
        // Filtra apenas pacientes ativos e do tipo fixado
        formState.pacientes = dados.filter(paciente => 
            paciente.statusPac === 1 && 
            paciente.tipoPac === 'FIXADO'
        );
        
        preencherSelectPacientes();
    } catch (erro) {
        console.error('Erro ao carregar pacientes:', erro);
        throw erro;
    }
}

/**
 * Preenche o select de pacientes com os dados carregados
 */
function preencherSelectPacientes() {
    const select = document.getElementById('idPaciente');
    if (!select) return;

    // Limpa opções existentes exceto a primeira
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Adiciona as opções de pacientes
    formState.pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.codPac;
        option.textContent = `${paciente.nomePac} - ${paciente.cpfPac}`;
        select.appendChild(option);
    });

    // Se não houver pacientes, mostra mensagem
    if (formState.pacientes.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'Nenhum paciente fixado disponível';
        select.appendChild(option);
    }
}

/**
 * Configura as máscaras dos campos
 */
function configurarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpfResponsavel');
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
            
            // Validação em tempo real
            validarCampo(cpfInput, validacoes.cpfResponsavel);
        });
    }

    // Validação em tempo real para nome do responsável
    const nomeInput = document.getElementById('nomeResponsavel');
    if (nomeInput) {
        nomeInput.addEventListener('input', (e) => {
            validarCampo(nomeInput, validacoes.nomeResponsavel);
        });
    }

    // Validação em tempo real para observações
    const obsInput = document.getElementById('observacoes');
    if (obsInput) {
        obsInput.addEventListener('input', (e) => {
            validarCampo(obsInput, validacoes.observacoes);
        });
    }
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
 * Configura os eventos do formulário
 */
function configurarEventos() {
    const form = document.getElementById('form-anamnese');
    if (!form) return;

    // Validação em tempo real para todos os campos
    form.querySelectorAll('input, textarea').forEach(campo => {
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
            await salvarAnamnese();
        }
    });

    // Configura data/hora atual como padrão
    const dataInput = document.getElementById('dataAnamnese');
    if (dataInput) {
        const agora = new Date();
        const dataHora = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        dataInput.value = dataHora;
    }

    // Configura valores padrão para os radio buttons
    document.querySelector('input[name="autorizacaoVisibilidade"][value="true"]').checked = true;
    if (formState.nivelProfissional > 2) {
        document.querySelector('input[name="statusFuncional"][value="true"]').checked = true;
    }
}

/**
 * Valida o formulário antes do envio
 */
function validarFormulario() {
    const form = document.getElementById('form-anamnese');
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

    if (!isValid) {
        exibirErro('Por favor, corrija os erros no formulário antes de enviar.');
    }

    return isValid;
}

/**
 * Salva os dados da anamnese
 */
async function salvarAnamnese() {
    try {
        mostrarLoader(true);
        
        const form = document.getElementById('form-anamnese');
        const formData = new FormData(form);
        
        // Converte FormData para objeto e ajusta os tipos
        const dados = {
            idPaciente: Number(formData.get('idPaciente')),
            idProfissional: 1, // TODO: Pegar do usuário logado
            dataAnamnese: new Date(formData.get('dataAnamnese')).toISOString(),
            nomeResponsavel: formData.get('nomeResponsavel')?.trim() || null,
            cpfResponsavel: formData.get('cpfResponsavel')?.replace(/\D/g, '') || null,
            autorizacaoVisibilidade: formData.get('autorizacaoVisibilidade') === 'true',
            observacoes: formData.get('observacoes')?.trim() || null
        };

        // Adiciona campos de status apenas se o profissional tiver nível adequado
        if (formState.nivelProfissional > 2) {
            dados.statusAnamnese = formData.get('statusAnamnese');
            dados.statusFuncional = formData.get('statusFuncional') === 'true';
        } else {
            dados.statusAnamnese = 'APROVADO';
            dados.statusFuncional = true;
        }
        
        // Envia para o backend
        const response = await fetch(`${CONFIG_API.baseURL}${CONFIG_API.endpoints.cadastro.anamnese.path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || 'Erro ao salvar anamnese');
        }

        // Sucesso
        alert('Anamnese salva com sucesso!');
        window.location.href = '/view/html/cadastro/cadastro.html';

    } catch (erro) {
        console.error('Erro ao salvar anamnese:', erro);
        exibirErro(erro.message || 'Erro ao salvar anamnese. Tente novamente.');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Mostra ou esconde o loader
 */
function mostrarLoader(mostrar) {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.toggle('hidden', !mostrar);
    }
}

/**
 * Exibe mensagem de erro
 */
function exibirErro(mensagem) {
    const container = document.querySelector('.content-wrapper');
    if (!container) return;

    const erroDiv = document.createElement('div');
    erroDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
    erroDiv.innerHTML = `
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline">${mensagem}</span>
    `;

    container.appendChild(erroDiv);

    setTimeout(() => {
        erroDiv.remove();
    }, 5000);
}

// Inicializa o formulário quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarFormulario); 