// Variáveis globais
let pacientes = [];
let pacienteSelecionado = null;

// Elementos da interface
const btnGroup = document.querySelector(".btn-group");
const novaConsultaScreen = document.getElementById('nova-consulta-screen');
const detalhesConsultaScreen = document.getElementById('detalhes-consulta-screen');
const consultasScreen = document.querySelector('.content-wrapper .max-w-4xl');
const patientSearchInput = document.getElementById('patientSearchInput');
const patientList = document.getElementById('patientList');
const voltarBtn = document.getElementById('voltar-btn');
const avancarBtn = document.getElementById('avancar-btn');
const novaConsultaBtn = document.getElementById('nova-consulta-btn');
const successModal = document.getElementById('success-modal');
const modalMessage = document.getElementById('modal-message');
const modalOkBtn = document.getElementById('modal-ok-btn');
const voltarParaConsultasBtn = document.getElementById('voltar-para-consultas-btn');
const detalhesContent = document.getElementById('detalhes-content');

// Modal de Anamneses
let modalAnamneses = null;
let modalAnamneseDetalhe = null;

// --- Agendar Retorno ---
let idPacienteRetorno = null;
let nomePacienteRetorno = null;

// Configuração dos botões de filtro
if (btnGroup) {
    btnGroup.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            const selectedButton = e.target;
            const buttons = btnGroup.querySelectorAll("button");
            buttons.forEach((button) => {
                button.classList.remove('active');
            });
            selectedButton.classList.add("active");
        }
    });
}

// Função para carregar as consultas
async function carregarConsultas(periodo = 'hoje') {
    try {
        const response = await fetch(`http://localhost:5128/api/consultas?periodo=${periodo}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Verifica se data é um array
        const consultas = Array.isArray(data) ? data : [];

        const containerConsultas = document.getElementById('consultas-container');
        if (!containerConsultas) {
            console.error('Container de consultas não encontrado');
            return;
        }

        containerConsultas.innerHTML = ''; // Limpa as consultas existentes

        if (consultas.length === 0) {
            containerConsultas.innerHTML = '<div class="text-center text-gray-500">Nenhuma consulta encontrada para este período.</div>';
            return;
        }

        consultas.forEach(consulta => {
            const consultaElement = criarElementoConsulta(consulta);
            containerConsultas.appendChild(consultaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        const containerConsultas = document.getElementById('consultas-container');
        if (containerConsultas) {
            containerConsultas.innerHTML = '<div class="text-center text-red-500">Erro ao carregar consultas. Por favor, tente novamente.</div>';
        }
    }
}

// Função para criar o elemento HTML de uma consulta
function criarElementoConsulta(consulta) {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center rounded-lg text-[#1A2A2A] font-semibold text-sm';

    // Formatação da data
    let dataFormatada = 'Data não disponível';
    if (consulta.dataConsulta) {
        try {
            const data = new Date(consulta.dataConsulta);
            if (!isNaN(data.getTime())) {
                const dataStr = data.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                // Remover vírgula e espaço, substituir por " - "
                dataFormatada = dataStr.replace(', ', ' - '); // Formato "DD/MM - HH:MM"
            }
        } catch (e) {
            console.error('Erro ao formatar data:', e);
        }
    }

    div.innerHTML = `
        <div 
            class="flex items-center space-x-4 w-1/2 bg-[#2AA078] rounded-lg px-4 py-3 relative cursor-pointer hover:bg-[#238a66] transition-colors"
            onclick="verDetalhesConsulta(${consulta.idPessoa})"
            aria-label="Ver detalhes da consulta de ${consulta.nomePaciente || 'paciente'}"
            role="button"
        >
            <div class="w-10 h-10 rounded-full ${consulta.sexoPaciente === 'M' ? 'bg-[#1A2A2A]' : 'bg-[#2AC9E9]'}"></div>
            <span class="text-base md:text-lg lg:text-xl">${consulta.nomePaciente || 'Nome não disponível'}</span>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-white">
                &gt;
            </div>
        </div>
        <div class="w-1/3 text-right flex items-center justify-center text-base md:text-lg lg:text-xl">
            ${dataFormatada}
        </div>
    `;

    return div;
}

// Função para ver detalhes da consulta
function verDetalhesConsulta(id) {
    console.log('Abrindo detalhes da consulta para paciente ID:', id);

    // Ocultar tela de consultas e mostrar tela de detalhes
    consultasScreen.classList.add('hidden');
    detalhesConsultaScreen.classList.remove('hidden');

    // Carregar detalhes do paciente
    carregarDetalhesPaciente(id);
}

// Função para carregar detalhes do paciente
async function carregarDetalhesPaciente(idPessoaFisica) {
    console.log('Carregando detalhes do paciente ID:', idPessoaFisica);

    try {
        // Buscar detalhes do paciente no backend
        const response = await fetch(`http://localhost:5128/api/pacientes/detalhes/${idPessoaFisica}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const detalhes = await response.json();
        console.log('Detalhes recebidos:', detalhes);

        // Exibir os detalhes na tela
        const detalhesContent = document.getElementById('detalhes-content');

        // Formatar data da consulta
        let dataConsultaFormatada = 'Não informado';
        if (detalhes.dataConsulta) {
            try {
                const data = new Date(detalhes.dataConsulta);
                if (!isNaN(data.getTime())) {
                    dataConsultaFormatada = data.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch (e) {
                console.error('Erro ao formatar data:', e);
            }
        }

        detalhesContent.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Informações Básicas -->
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <h3 class="text-xl font-semibold text-[#1A2A2A] mb-4" style="font-family: 'Inter', sans-serif;">
                        Informações do Paciente
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Nome Completo:</span>
                            <span class="text-[#1A2A2A]">
                                ${detalhes.nome || 'Não informado'}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Idade:</span>
                            <span class="text-[#1A2A2A]">
                                ${detalhes.idade || 'Não informado'}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Contato:</span>
                            <span class="text-[#1A2A2A]">
                                ${detalhes.contato || 'Não informado'}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">E-mail:</span>
                            <span class="text-[#1A2A2A]">
                                ${detalhes.email || 'Não informado'}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Informações da Consulta -->
                <div class="bg-white rounded-lg p-6 shadow-sm">
                    <h3 class="text-xl font-semibold text-[#1A2A2A] mb-4" style="font-family: 'Inter', sans-serif;">
                        Informações da Consulta
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Sessão:</span>
                            <span class="text-[#1A2A2A] font-semibold">
                                ${detalhes.sessao || 'Não calculada'}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Data/Hora:</span>
                            <span class="text-[#1A2A2A]">
                                ${dataConsultaFormatada}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-[#1A2A2A]">Status:</span>
                            <span class="px-2 py-1 rounded text-sm font-medium ${detalhes.statusConsulta === 'Atendido' ? 'bg-green-100 text-green-800' : detalhes.statusConsulta === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                ${detalhes.statusConsulta || 'Não definido'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botões de Ação -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <button data-anamneses class="flex items-center justify-center space-x-2 bg-[#2AA078] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#238a66] transition-colors">
                    <i data-feather="file-text" class="w-5 h-5"></i>
                    <span>Anamnese</span>
                </button>
                <button data-relatorios class="flex items-center justify-center space-x-2 bg-yellow-400 text-white font-semibold px-4 py-3 rounded-lg hover:bg-yellow-500 transition-colors">
                    <i data-feather="edit-3" class="w-5 h-5"></i>
                    <span>RELATÓRIOS</span>
                </button>
                <button data-atender class="flex items-center justify-center space-x-2 bg-[#2A6DB0] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#1e5a9a] transition-colors">
                    <i data-feather="check-circle" class="w-5 h-5"></i>
                    <span>Marcar Atendido</span>
                </button>
                <button data-cancelar class="flex items-center justify-center space-x-2 bg-[#DC2626] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#b91c1c] transition-colors">
                    <i data-feather="x-circle" class="w-5 h-5"></i>
                    <span>Cancelar</span>
                </button>
                <button data-agendar-retorno class="flex items-center justify-center space-x-2 bg-[#1A2A2A] text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <i data-feather="calendar" class="w-5 h-5"></i>
                    <span>Agendar Retorno</span>
                </button>
            </div>

            <!-- Área de Relatório -->
            <div class="mt-6 bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-xl font-semibold text-[#1A2A2A] mb-4" style="font-family: 'Inter', sans-serif;">
                    Registro de Relatório
                </h3>
                
                <!-- Campo de busca de procedimento -->
                <div class="mb-4">
                    <label for="procedimento-search" class="block text-sm font-medium text-[#1A2A2A] mb-2">
                        Procedimento * (digite "psico" para buscar)
                    </label>
                    <div class="relative">
                        <input 
                            type="text" 
                            id="procedimento-search"
                            placeholder="Digite para buscar procedimentos..."
                            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AA078]"
                        >
                        <div id="procedimento-suggestions" class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto hidden"></div>
                    </div>
                    <input type="hidden" id="procedimento-id" value="">
                </div>
                
                <textarea 
                    id="relatorio-textarea"
                    placeholder="Digite aqui o relatório da consulta..."
                    class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AA078] resize-none"
                ></textarea>
                <div class="mt-3 flex justify-end">
                    <button id="salvar-relatorio-btn" class="bg-[#2AA078] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#238a66] transition-colors">
                        Salvar Relatório
                    </button>
                </div>
            </div>
        `;

        // Reinicializar Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Adicionar eventos aos botões de ação
        adicionarEventoBotaoAnamneses(idPessoaFisica);
        adicionarEventoBotaoRelatorios(detalhes.idPaciente); // Corrigido para usar o idPaciente
        adicionarEventosStatusConsulta(detalhes.idAgenda);
        // Evento para Agendar Retorno
        const btnAgendarRetorno = detalhesContent.querySelector('button[data-agendar-retorno]');
        if (btnAgendarRetorno) {
            btnAgendarRetorno.onclick = () => abrirModalAgendarRetorno(detalhes.idPaciente, detalhes.nome);
        }
        // Evento para Salvar Relatório
        adicionarEventoSalvarRelatorio(detalhes.idPaciente); // Corrigido para usar o idPaciente

        // Inicializar busca de procedimentos
        inicializarBuscaProcedimentos();

    } catch (error) {
        console.error('Erro ao carregar detalhes do paciente:', error);
        const detalhesContent = document.getElementById('detalhes-content');
        detalhesContent.innerHTML = `
            <div class="text-center py-8">
                <div class="text-red-500 mb-4">
                    <i data-feather="alert-circle" class="w-16 h-16 mx-auto"></i>
                </div>
                <h3 class="text-xl font-semibold text-[#1A2A2A] mb-2">Erro ao carregar detalhes</h3>
                <p class="text-[#1A2A2A]">Não foi possível carregar os detalhes do paciente. Tente novamente.</p>
                <button onclick="voltarParaConsultas()" class="mt-4 bg-[#1A2A2A] text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Voltar
                </button>
            </div>
        `;

        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

// Função para mostrar a tela de nova consulta
function mostrarTelaNovaConsulta() {
    consultasScreen.classList.add('hidden');
    novaConsultaScreen.classList.remove('hidden');
    carregarPacientes();
}

// Função para voltar à tela de consultas
function voltarParaConsultas() {
    novaConsultaScreen.classList.add('hidden');
    detalhesConsultaScreen.classList.add('hidden');
    consultasScreen.classList.remove('hidden');
    limparSelecao();
}

// Função para carregar pacientes do banco de dados
async function carregarPacientes() {
    try {
        console.log('Iniciando carregamento de pacientes...');

        // Mostrar loading
        patientList.innerHTML = `
            <div class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AA078]"></div>
                <span class="ml-2 text-[#1A2A2A]">Carregando pacientes...</span>
            </div>
        `;

        console.log('Fazendo requisição para: http://localhost:5128/api/pacientes/pessoas');
        const response = await fetch('http://localhost:5128/api/pacientes/pessoas');

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseText = await response.text();
        console.log('Resposta bruta:', responseText);

        pacientes = JSON.parse(responseText);
        console.log('Pacientes carregados:', pacientes);

        renderizarPacientes(pacientes);
    } catch (error) {
        console.error('Erro detalhado ao carregar pacientes:', error);
        patientList.innerHTML = `
            <div class="text-center text-red-500 py-8">
                Erro ao carregar pacientes. Por favor, tente novamente.<br>
                <small>Erro: ${error.message}</small>
            </div>
        `;
    }
}

// Função para renderizar a lista de pacientes
function renderizarPacientes(pacientesParaRenderizar) {
    if (pacientesParaRenderizar.length === 0) {
        patientList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                Nenhum paciente encontrado.
            </div>
        `;
        return;
    }

    patientList.innerHTML = pacientesParaRenderizar.map(paciente => `
        <div class="patient-item flex items-center bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors" 
             data-id="${paciente.idPessoa}" 
             data-name="${paciente.nomePessoa}">
            <div class="w-8 h-8 ${paciente.sexoPessoa === 'M' ? 'bg-[#1A2A2A]' : 'bg-[#2AC9E9]'} rounded-full flex-shrink-0 mr-3"></div>
            <span class="text-gray-800 font-medium">${paciente.nomePessoa}</span>
        </div>
    `).join('');

    // Adicionar event listeners para seleção
    document.querySelectorAll('.patient-item').forEach(item => {
        item.addEventListener('click', () => selecionarPaciente(item));
    });
}

// Função para selecionar um paciente
function selecionarPaciente(elemento) {
    // Remover seleção anterior
    document.querySelectorAll('.patient-item').forEach(item => {
        item.classList.remove('bg-[#2AA078]', 'text-white', 'border-2', 'border-black');
        item.classList.add('bg-gray-100', 'hover:bg-gray-200');
        item.querySelector('span').classList.remove('text-white');
        item.querySelector('span').classList.add('text-gray-800');
    });

    // Selecionar novo paciente
    elemento.classList.remove('bg-gray-100', 'hover:bg-gray-200');
    elemento.classList.add('bg-[#2AA078]', 'text-white', 'border-2', 'border-black');
    elemento.querySelector('span').classList.remove('text-gray-800');
    elemento.querySelector('span').classList.add('text-white');

    // Habilitar botão avançar
    pacienteSelecionado = {
        id: elemento.dataset.id,
        nome: elemento.dataset.name
    };
    avancarBtn.disabled = false;
}

// Função para limpar seleção
function limparSelecao() {
    pacienteSelecionado = null;
    avancarBtn.disabled = true;
    patientSearchInput.value = '';
    if (patientList) {
        patientList.innerHTML = '';
    }
}

// Função para filtrar pacientes
function filtrarPacientes(termo) {
    const pacientesFiltrados = pacientes.filter(paciente =>
        paciente.nomePessoa.toLowerCase().includes(termo.toLowerCase())
    );
    renderizarPacientes(pacientesFiltrados);
}

// Função para agendar consulta
async function agendarConsulta() {
    if (!pacienteSelecionado) {
        alert('Por favor, selecione um paciente primeiro.');
        return;
    }

    try {
        console.log('Iniciando agendamento para paciente:', pacienteSelecionado);

        // Mostrar loading no botão
        avancarBtn.disabled = true;
        avancarBtn.innerHTML = `
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
        `;

        const dataAtual = new Date();
        const consultaData = {
            idPessoa: pacienteSelecionado.id,
            nomePaciente: pacienteSelecionado.nome,
            dataConsulta: dataAtual.toISOString()
        };

        console.log('Dados da consulta a serem enviados:', consultaData);
        console.log('Fazendo requisição POST para: http://localhost:5128/api/consultas');

        const response = await fetch('http://localhost:5128/api/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(consultaData)
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro do servidor:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Resposta de sucesso do servidor:', responseData);

        // Formata a data retornada pelo servidor
        const dataServidor = new Date(responseData.consulta.dataConsulta);
        const dataFormatada = dataServidor.toLocaleString('pt-BR');

        // Mostrar o modal de sucesso com a data real do servidor
        modalMessage.innerHTML = `Consulta agendada para: <strong>${responseData.consulta.nomePaciente}</strong><br>Data: ${dataFormatada}`;
        successModal.classList.remove('hidden');
        feather.replace(); // Para renderizar o ícone de check

        // Configurar o botão OK do modal
        modalOkBtn.onclick = () => {
            successModal.classList.add('hidden');
            voltarParaConsultas();
            carregarConsultas();
        };

    } catch (error) {
        console.error('Erro detalhado ao agendar consulta:', error);
        alert(`Erro ao agendar consulta. Por favor, tente novamente.\n\nErro: ${error.message}`);
    } finally {
        // Restaurar botão
        avancarBtn.disabled = false;
        avancarBtn.innerHTML = 'Avançar';
    }
}

// Função para abrir o modal de lista de anamneses
async function abrirModalAnamneses(idPessoaFisica) {
    // Cria modal se não existir
    if (!modalAnamneses) {
        modalAnamneses = document.createElement('div');
        modalAnamneses.id = 'modal-anamneses';
        modalAnamneses.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
        document.body.appendChild(modalAnamneses);
    }
    modalAnamneses.innerHTML = `<div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
        <h2 class="text-2xl font-bold mb-4 text-[#2AA078]">Anamneses do Paciente</h2>
        <div id="lista-anamneses" class="space-y-2 max-h-96 overflow-y-auto mb-4 flex flex-col"></div>
        <button id="fechar-anamneses" class="mt-2 px-6 py-2 bg-[#2AA078] text-white rounded hover:bg-[#238a66]">Fechar</button>
    </div>`;
    modalAnamneses.classList.remove('hidden');

    // Buscar anamneses do backend
    try {
        const response = await fetch(`http://localhost:5128/api/pacientes/anamneses/${idPessoaFisica}`);
        if (!response.ok) throw new Error('Erro ao buscar anamneses');
        const anamneses = await response.json();
        const lista = document.getElementById('lista-anamneses');
        if (anamneses.length === 0) {
            lista.innerHTML = '<div class="text-gray-500 text-center">Nenhuma anamnese encontrada.</div>';
        } else {
            lista.innerHTML = anamneses.map(an => `
                <button class="w-full text-left p-3 rounded bg-[#F0F9F4] hover:bg-[#2AA078] hover:text-white transition flex justify-between items-center" data-id="${an.IDANAMNESE}" data-data="${an.DATAANAM || an.DATAANAMNESE}" data-status="${an.STATUSANM}" data-obs="${encodeURIComponent(an.OBSERVACOES || '')}">
                    <span><b>${formatarData(an.DATAANAM || an.DATAANAMNESE)}</b></span>
                    <span class="ml-2 px-2 py-1 rounded text-xs font-semibold bg-[#2AA078] text-white">${an.STATUSANM || 'Sem status'}</span>
                </button>
            `).join('');
            // Adiciona evento para cada item
            lista.querySelectorAll('button').forEach(btn => {
                btn.onclick = () => abrirModalDetalheAnamnese({
                    data: btn.dataset.data,
                    status: btn.dataset.status,
                    obs: decodeURIComponent(btn.dataset.obs)
                });
            });
        }
    } catch (e) {
        document.getElementById('lista-anamneses').innerHTML = '<div class="text-red-500 text-center">Erro ao carregar anamneses.</div>';
    }
    // Fechar modal
    document.getElementById('fechar-anamneses').onclick = () => modalAnamneses.classList.add('hidden');
}

// Função para abrir modal de detalhe da anamnese
function abrirModalDetalheAnamnese({ data, status, obs }) {
    if (!modalAnamneseDetalhe) {
        modalAnamneseDetalhe = document.createElement('div');
        modalAnamneseDetalhe.id = 'modal-anamnese-detalhe';
        modalAnamneseDetalhe.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
        document.body.appendChild(modalAnamneseDetalhe);
    }
    modalAnamneseDetalhe.innerHTML = `<div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-[#2AA078]">Detalhes da Anamnese</h2>
        <div class="mb-2"><b>Data:</b> ${formatarData(data)}</div>
        <div class="mb-2"><b>Status:</b> ${status || 'Sem status'}</div>
        <div class="mb-2"><b>Observações:</b><br><div class="bg-gray-100 rounded p-2 mt-1">${obs || 'Sem observações.'}</div></div>
        <button id="fechar-anamnese-detalhe" class="mt-4 px-6 py-2 bg-[#2AA078] text-white rounded hover:bg-[#238a66]">Fechar</button>
    </div>`;
    modalAnamneseDetalhe.classList.remove('hidden');
    document.getElementById('fechar-anamnese-detalhe').onclick = () => modalAnamneseDetalhe.classList.add('hidden');
}

// Função utilitária para formatar data (YYYY-MM-DD para DD/MM/YYYY)
function formatarData(dataStr) {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('pt-BR');
    }
    // fallback para string tipo 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}/.test(dataStr)) {
        const [y, m, d2] = dataStr.split('-');
        return `${d2}/${m}/${y}`;
    }
    return dataStr;
}

// Adicionar evento ao botão ANAMNESES na tela de detalhes
function adicionarEventoBotaoAnamneses(idPessoaFisica) {
    const btn = document.querySelector('#detalhes-content button[data-anamneses]');
    if (btn) {
        btn.onclick = () => abrirModalAnamneses(idPessoaFisica);
    }
}

// Função para mostrar modal de feedback de status
function showStatusModal({ title, message, icon, iconBg, iconColor }) {
    const modal = document.getElementById('status-modal');
    const iconDiv = document.getElementById('status-modal-icon');
    const titleEl = document.getElementById('status-modal-title');
    const messageEl = document.getElementById('status-modal-message');
    const okBtn = document.getElementById('status-modal-ok-btn');

    iconDiv.innerHTML = `<i data-feather="${icon}" class="w-10 h-10" style="color:${iconColor}"></i>`;
    iconDiv.style.backgroundColor = iconBg;
    titleEl.textContent = title;
    messageEl.textContent = message;

    modal.classList.remove('hidden');
    if (typeof feather !== 'undefined') feather.replace();

    okBtn.onclick = () => {
        modal.classList.add('hidden');
    };

    // Fechar automaticamente após 2,5 segundos (opcional)
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 2500);
}

// Função para atualizar status da consulta (atendido/cancelado)
async function atualizarStatusConsulta(idAgenda, novoStatus) {
    try {
        const response = await fetch(`http://localhost:5128/api/consultas/agenda/${idAgenda}/status?status=${novoStatus}`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error('Erro ao atualizar status');
        // Atualiza a lista de consultas
        carregarConsultas();
        // Fecha modal de detalhes
        detalhesConsultaScreen.classList.add('hidden');
        consultasScreen.classList.remove('hidden');
        // Feedback visual
        if (novoStatus === 2) {
            showStatusModal({
                title: 'Consulta Atendida!',
                message: 'O status da consulta foi atualizado para ATENDIDO.',
                icon: 'check-circle',
                iconBg: '#D1FAE5',
                iconColor: '#059669'
            });
        } else if (novoStatus === 3) {
            showStatusModal({
                title: 'Consulta Cancelada!',
                message: 'O status da consulta foi atualizado para CANCELADO.',
                icon: 'x-circle',
                iconBg: '#FECACA',
                iconColor: '#DC2626'
            });
        }
    } catch (e) {
        showStatusModal({
            title: 'Erro!',
            message: 'Erro ao atualizar status da consulta.',
            icon: 'alert-circle',
            iconBg: '#FDE68A',
            iconColor: '#B45309'
        });
    }
}

// Função para abrir modal de confirmação para marcar atendido/cancelar
function abrirModalConfirmacaoStatus(idAgenda, acao) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
    modal.innerHTML = `<div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
        <h2 class="text-xl font-bold mb-4 text-[#2AA078]">${acao === 'atender' ? 'Marcar como Atendido?' : 'Cancelar Consulta?'}</h2>
        <p class="mb-4">Tem certeza que deseja ${acao === 'atender' ? 'marcar esta consulta como atendida' : 'cancelar esta consulta'}?</p>
        <div class="flex justify-center gap-4">
            <button id="confirmar-status" class="px-6 py-2 bg-[#2AA078] text-white rounded hover:bg-[#238a66]">Sim</button>
            <button id="cancelar-status" class="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Não</button>
        </div>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById('confirmar-status').onclick = () => {
        atualizarStatusConsulta(idAgenda, acao === 'atender' ? 2 : 3);
        document.body.removeChild(modal);
    };
    document.getElementById('cancelar-status').onclick = () => {
        document.body.removeChild(modal);
    };
}

// Ligar botões Marcar Atendido e Cancelar na tela de detalhes
function adicionarEventosStatusConsulta(idAgenda) {
    const btnAtender = document.querySelector('#detalhes-content button[data-atender]');
    const btnCancelar = document.querySelector('#detalhes-content button[data-cancelar]');
    if (btnAtender) btnAtender.onclick = () => abrirModalConfirmacaoStatus(idAgenda, 'atender');
    if (btnCancelar) btnCancelar.onclick = () => abrirModalConfirmacaoStatus(idAgenda, 'cancelar');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar consultas iniciais
    carregarConsultas();

    // Configurar botões de filtro
    const botoesFiltro = document.querySelectorAll('.btn-select');
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            botoesFiltro.forEach(b => b.classList.remove('bg-[#238a66]'));
            // Adicionar classe ativa ao botão clicado
            botao.classList.add('bg-[#238a66]');
            // Carregar consultas do período selecionado
            carregarConsultas(botao.dataset.type);
        });
    });

    // Configurar botão de nova consulta
    if (novaConsultaBtn) {
        novaConsultaBtn.addEventListener('click', mostrarTelaNovaConsulta);
    }

    // Configurar botão voltar
    if (voltarBtn) {
        voltarBtn.addEventListener('click', voltarParaConsultas);
    }

    // Configurar botão voltar para consultas (da tela de detalhes)
    if (voltarParaConsultasBtn) {
        voltarParaConsultasBtn.addEventListener('click', voltarParaConsultas);
    }

    // Configurar botão avançar
    if (avancarBtn) {
        avancarBtn.addEventListener('click', agendarConsulta);
    }

    // Configurar campo de busca
    if (patientSearchInput) {
        patientSearchInput.addEventListener('input', (e) => {
            filtrarPacientes(e.target.value);
        });
    }

    // Inicializar Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

function abrirModalAgendarRetorno(idPaciente, nomePaciente) {
    idPacienteRetorno = idPaciente;
    nomePacienteRetorno = nomePaciente;
    const modal = document.getElementById('modal-agendar-retorno');
    const dataInput = document.getElementById('retorno-data');
    const horaInput = document.getElementById('retorno-hora');

    // Preencher data padrão (hoje)
    const hoje = new Date();
    dataInput.value = hoje.toISOString().split('T')[0];
    // Preencher hora padrão (hora local)
    const pad = n => n.toString().padStart(2, '0');
    horaInput.value = pad(hoje.getHours()) + ':' + pad(hoje.getMinutes());

    modal.classList.remove('hidden');
}

// Evento para abrir modal ao clicar no botão de agendar retorno
// (deve ser chamado após renderizar os detalhes)
function adicionarEventoBotaoAgendarRetorno(idPaciente, nomePaciente) {
    const btn = document.querySelector('#detalhes-content button[data-agendar-retorno]');
    if (btn) {
        btn.onclick = () => abrirModalAgendarRetorno(idPaciente, nomePaciente);
    }
}

// Evento para cancelar modal
const cancelarRetornoBtn = document.getElementById('cancelar-retorno-btn');
if (cancelarRetornoBtn) {
    cancelarRetornoBtn.onclick = () => {
        document.getElementById('modal-agendar-retorno').classList.add('hidden');
    };
}

// Evento para submit do agendamento de retorno
const formAgendarRetorno = document.getElementById('form-agendar-retorno');
if (formAgendarRetorno) {
    formAgendarRetorno.onsubmit = async (e) => {
        e.preventDefault();
        const data = document.getElementById('retorno-data').value;
        const hora = document.getElementById('retorno-hora').value;
        if (!data || !hora) return;
        // Montar data/hora ISO
        const dataHora = data + 'T' + hora + ':00';
        try {
            const consultaData = {
                idPessoa: idPacienteRetorno,
                nomePaciente: nomePacienteRetorno,
                dataConsulta: dataHora
            };
            const response = await fetch('http://localhost:5128/api/consultas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(consultaData)
            });
            if (!response.ok) throw new Error('Erro ao agendar retorno');
            document.getElementById('modal-agendar-retorno').classList.add('hidden');
            showStatusModal({
                title: 'Retorno Agendado!',
                message: 'O retorno foi agendado com sucesso.',
                icon: 'calendar',
                iconBg: '#D1FAE5',
                iconColor: '#059669'
            });
            carregarConsultas();
        } catch (err) {
            showStatusModal({
                title: 'Erro!',
                message: 'Erro ao agendar retorno.',
                icon: 'alert-circle',
                iconBg: '#FDE68A',
                iconColor: '#B45309'
            });
        }
    };
}

// --- RELATÓRIOS ---
function adicionarEventoBotaoRelatorios(idPaciente) {
    const btn = document.querySelector('#detalhes-content button[data-relatorios]');
    if (btn) {
        btn.onclick = () => abrirModalRelatoriosPorNome();
    }
}

async function abrirModalRelatorios(idPaciente) {
    const modal = document.getElementById('modal-relatorios');
    const lista = document.getElementById('lista-relatorios');
    lista.innerHTML = '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AA078]"></div><span class="ml-2 text-[#1A2A2A]">Carregando relatórios...</span></div>';
    modal.classList.remove('hidden');
    try {
        const response = await fetch(`http://localhost:5128/api/relatorios/${idPaciente}`);
        if (!response.ok) throw new Error('Erro ao buscar relatórios');
        const relatorios = await response.json();
        if (!relatorios.length) {
            lista.innerHTML = '<div class="text-gray-500 text-center">Nenhum relatório encontrado.</div>';
        } else {
            lista.innerHTML = relatorios.map(r => `
                <button class="w-full text-left p-3 rounded bg-[#F0F9F4] hover:bg-gray-400 hover:text-white transition flex flex-col md:flex-row md:justify-between md:items-center" 
                        data-id="${r.IDPRONTU}" 
                        data-data="${r.DATAPROCED}" 
                        data-desc="${encodeURIComponent(r.DESCRPRONTU || '')}" 
                        data-proc="${r.DESCRPROC || ''}">
                    <div class="flex flex-col md:flex-row md:items-center">
                        <span class="font-bold text-[#2A6DB0]">${formatarDataHora(r.DATAPROCED)}</span>
                        <span class="ml-2 text-[#2AA078] text-sm">${r.DESCRPROC || 'Procedimento não informado'}</span>
                    </div>
                    <span class="ml-2 truncate max-w-xs">${(r.DESCRPRONTU || '').slice(0, 40)}${r.DESCRPRONTU && r.DESCRPRONTU.length > 40 ? '...' : ''}</span>
                </button>
            `).join('');
            lista.querySelectorAll('button').forEach(btn => {
                btn.onclick = () => abrirModalDetalheRelatorio({
                    data: btn.dataset.data,
                    desc: decodeURIComponent(btn.dataset.desc),
                    proc: btn.dataset.proc
                });
            });
        }
    } catch (e) {
        lista.innerHTML = '<div class="text-red-500 text-center">Erro ao carregar relatórios.</div>';
    }
}

function abrirModalDetalheRelatorio({ data, desc, proc }) {
    const modal = document.getElementById('modal-detalhe-relatorio');
    document.getElementById('detalhe-relatorio-data').textContent = formatarDataHora(data);
    document.getElementById('detalhe-relatorio-desc').textContent = desc || 'Sem descrição.';
    // Exibir o nome do procedimento, se existir
    let procDiv = document.getElementById('detalhe-relatorio-proc');
    if (!procDiv) {
        procDiv = document.createElement('div');
        procDiv.id = 'detalhe-relatorio-proc';
        procDiv.className = 'mb-2';
        document.getElementById('detalhe-relatorio-data').parentNode.insertBefore(procDiv, document.getElementById('detalhe-relatorio-data').nextSibling);
    }
    procDiv.innerHTML = `<b>Procedimento:</b> ${proc || 'Não informado'}`;
    modal.classList.remove('hidden');
    document.getElementById('fechar-detalhe-relatorio').onclick = () => modal.classList.add('hidden');
}

document.getElementById('fechar-relatorios').onclick = () => document.getElementById('modal-relatorios').classList.add('hidden');

// Função utilitária para data/hora
function formatarDataHora(dataStr) {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    if (!isNaN(d.getTime())) {
        return d.toLocaleString('pt-BR');
    }
    return dataStr;
}

// --- Busca de Procedimentos ---
function inicializarBuscaProcedimentos() {
    const searchInput = document.getElementById('procedimento-search');
    const suggestionsDiv = document.getElementById('procedimento-suggestions');

    if (!searchInput || !suggestionsDiv) return;

    let timeoutId;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const termo = e.target.value.trim();

        if (termo.length < 2) {
            suggestionsDiv.classList.add('hidden');
            return;
        }

        timeoutId = setTimeout(() => {
            buscarProcedimentos(termo);
        }, 300);
    });

    // Esconder sugestões quando clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

async function buscarProcedimentos(termo) {
    const suggestionsDiv = document.getElementById('procedimento-suggestions');

    try {
        const response = await fetch(`http://localhost:5128/api/relatorios/procedimentos/buscar?termo=${encodeURIComponent(termo)}`);
        if (!response.ok) throw new Error('Erro ao buscar procedimentos');

        const procedimentos = await response.json();

        if (procedimentos.length === 0) {
            suggestionsDiv.innerHTML = '<div class="p-3 text-gray-500">Nenhum procedimento encontrado</div>';
        } else {
            suggestionsDiv.innerHTML = procedimentos.map(proc => `
                <div class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0" 
                     data-id="${proc.IDPROCED}" 
                     data-descricao="${proc.DESCRPROC || ''}">
                    <div class="font-medium">${proc.DESCRPROC || 'Sem descrição'}</div>
                    <div class="text-sm text-gray-500">ID: ${proc.IDPROCED}</div>
                </div>
            `).join('');

            // Adicionar eventos de clique nas sugestões
            suggestionsDiv.querySelectorAll('div[data-id]').forEach(item => {
                item.addEventListener('click', () => {
                    const id = item.dataset.id;
                    const descricao = item.dataset.descricao;

                    document.getElementById('procedimento-search').value = descricao;
                    document.getElementById('procedimento-id').value = id;
                    suggestionsDiv.classList.add('hidden');
                });
            });
        }

        suggestionsDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao buscar procedimentos:', error);
        suggestionsDiv.innerHTML = '<div class="p-3 text-red-500">Erro ao buscar procedimentos</div>';
        suggestionsDiv.classList.remove('hidden');
    }
}

// --- Salvar Relatório ---
function adicionarEventoSalvarRelatorio(idPaciente) {
    const btn = document.getElementById('salvar-relatorio-btn');
    if (btn) {
        btn.onclick = async () => {
            const desc = document.getElementById('relatorio-textarea').value.trim();
            const procedimentoId = document.getElementById('procedimento-id').value;
            const procedimentoText = document.getElementById('procedimento-search').value.trim();

            if (!desc) {
                showStatusModal({
                    title: 'Atenção',
                    message: 'Digite o relatório antes de salvar.',
                    icon: 'alert-circle',
                    iconBg: '#FDE68A',
                    iconColor: '#B45309'
                });
                return;
            }

            if (!procedimentoId || !procedimentoText) {
                showStatusModal({
                    title: 'Atenção',
                    message: 'Selecione um procedimento antes de salvar.',
                    icon: 'alert-circle',
                    iconBg: '#FDE68A',
                    iconColor: '#B45309'
                });
                return;
            }

            try {
                // Salvar relatório na tabela PRONTUARIO usando o novo endpoint
                const response = await fetch('http://localhost:5128/api/relatorios/prontuario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idPaciente: idPaciente,
                        descricao: desc,
                        idProcedimento: parseInt(procedimentoId)
                    })
                });
                if (!response.ok) throw new Error('Erro ao salvar relatório');
                showStatusModal({
                    title: 'Relatório Salvo!',
                    message: 'O relatório foi salvo com sucesso na tabela PRONTUARIO.',
                    icon: 'edit-3',
                    iconBg: '#D1FAE5',
                    iconColor: '#059669'
                });
                document.getElementById('relatorio-textarea').value = '';
                document.getElementById('procedimento-search').value = '';
                document.getElementById('procedimento-id').value = '';
                // Não abrir a listagem de relatórios automaticamente
            } catch (e) {
                showStatusModal({
                    title: 'Erro!',
                    message: 'Erro ao salvar relatório.',
                    icon: 'alert-circle',
                    iconBg: '#FDE68A',
                    iconColor: '#B45309'
                });
            }
        };
    }
}

// --- RELATÓRIOS ---
function adicionarEventoBotaoRelatoriosPorNome() {
    const btn = document.querySelector('#abrir-relatorios-por-nome');
    if (btn) {
        btn.onclick = () => abrirModalRelatoriosPorNome();
    }
}

// Ajustar largura do modal de relatórios
const modal = document.getElementById('modal-relatorios');
if (modal) {
    const modalBox = modal.querySelector('.max-w-lg');
    if (modalBox) {
        modalBox.classList.remove('max-w-lg');
        modalBox.classList.add('max-w-2xl');
    }
}

// Ajustar função abrirModalRelatoriosPorNome para não mostrar mensagem de nenhum relatório encontrado e exibir descrição completa
async function abrirModalRelatoriosPorNome() {
    const modal = document.getElementById('modal-relatorios');
    const lista = document.getElementById('lista-relatorios');
    let buscaDiv = document.getElementById('busca-relatorio-nome');
    if (!buscaDiv) {
        buscaDiv = document.createElement('div');
        buscaDiv.id = 'busca-relatorio-nome';
        buscaDiv.className = 'mb-4 flex items-center';
        buscaDiv.innerHTML = `
            <input id="input-busca-relatorio-nome" type="text" placeholder="Buscar por nome do paciente..." class="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none" />
            <button id="btn-busca-relatorio-nome" class="bg-[#2AA078] text-white px-4 py-2 rounded-r hover:bg-[#238a66]">Buscar</button>
        `;
        modal.querySelector('.max-w-2xl, .max-w-lg').insertBefore(buscaDiv, lista);
    }
    lista.innerHTML = '';
    modal.classList.remove('hidden');
    document.getElementById('btn-busca-relatorio-nome').onclick = async () => {
        const nome = document.getElementById('input-busca-relatorio-nome').value.trim();
        if (!nome) {
            lista.innerHTML = '<div class="text-gray-500 text-center">Digite um nome para buscar.</div>';
            return;
        }
        lista.innerHTML = '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AA078]"></div><span class="ml-2 text-[#1A2A2A]">Buscando relatórios...</span></div>';
        try {
            const response = await fetch(`http://localhost:5128/api/relatorios/buscar-por-nome?nome=${encodeURIComponent(nome)}`);
            if (!response.ok) throw new Error('Erro ao buscar relatórios');
            const relatorios = await response.json();
            if (!relatorios.length) {
                lista.innerHTML = '';
            } else {
                lista.innerHTML = relatorios.map(r => `
                    <button class="w-full text-left p-3 rounded bg-[#F0F9F4] hover:bg-gray-400 hover:text-white transition flex flex-col md:flex-row md:justify-between md:items-center" 
                            data-id="${r.IDPRONTU}" 
                            data-data="${r.DATAPROCED}" 
                            data-desc="${encodeURIComponent(r.DESCRPRONTU || '')}" 
                            data-proc="${r.DESCRPROC || ''}" 
                            data-nome="${r.NOMEPESSOA || ''}">
                        <div class="flex flex-col md:flex-row md:items-center">
                            <span class="font-bold text-[#2A6DB0]">${formatarDataHora(r.DATAPROCED)}</span>
                            <span class="ml-2 text-[#2AA078] text-sm">${r.DESCRPROC || 'Procedimento não informado'}</span>
                            <span class="ml-2 text-[#1A2A2A] text-xs">${r.NOMEPESSOA || ''}</span>
                        </div>
                        <span class="ml-2">${r.DESCRPRONTU || ''}</span>
                    </button>
                `).join('');
                lista.querySelectorAll('button').forEach(btn => {
                    btn.onclick = () => abrirModalDetalheRelatorio({
                        data: btn.dataset.data,
                        desc: decodeURIComponent(btn.dataset.desc),
                        proc: btn.dataset.proc,
                        nome: btn.dataset.nome
                    });
                });
            }
        } catch (e) {
            lista.innerHTML = '<div class="text-red-500 text-center">Erro ao carregar relatórios.</div>';
        }
    };
}

// Adicionar botão para abrir busca por nome (pode ser colocado em algum lugar visível)
document.addEventListener('DOMContentLoaded', () => {
    let btn = document.getElementById('abrir-relatorios-por-nome');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'abrir-relatorios-por-nome';
        btn.className = 'bg-[#2AA078] text-white px-4 py-2 rounded hover:bg-[#238a66] mb-4';
        btn.innerText = 'Buscar Relatórios por Nome';
        const modal = document.getElementById('modal-relatorios');
        if (modal) {
            modal.querySelector('.max-w-lg').insertBefore(btn, modal.querySelector('.space-y-2'));
        }
    }
    adicionarEventoBotaoRelatoriosPorNome();
});

// Ajustar abrirModalDetalheRelatorio para exibir nome do paciente se disponível
function abrirModalDetalheRelatorio({ data, desc, proc, nome }) {
    const modal = document.getElementById('modal-detalhe-relatorio');
    document.getElementById('detalhe-relatorio-data').textContent = formatarDataHora(data);
    document.getElementById('detalhe-relatorio-desc').textContent = desc || 'Sem descrição.';
    let procDiv = document.getElementById('detalhe-relatorio-proc');
    if (!procDiv) {
        procDiv = document.createElement('div');
        procDiv.id = 'detalhe-relatorio-proc';
        procDiv.className = 'mb-2';
        document.getElementById('detalhe-relatorio-data').parentNode.insertBefore(procDiv, document.getElementById('detalhe-relatorio-data').nextSibling);
    }
    procDiv.innerHTML = `<b>Procedimento:</b> ${proc || 'Não informado'}`;
    let nomeDiv = document.getElementById('detalhe-relatorio-nome');
    if (!nomeDiv) {
        nomeDiv = document.createElement('div');
        nomeDiv.id = 'detalhe-relatorio-nome';
        nomeDiv.className = 'mb-2';
        procDiv.parentNode.insertBefore(nomeDiv, procDiv.nextSibling);
    }
    nomeDiv.innerHTML = `<b>Paciente:</b> ${nome || 'Não informado'}`;
    modal.classList.remove('hidden');
    document.getElementById('fechar-detalhe-relatorio').onclick = () => modal.classList.add('hidden');
}