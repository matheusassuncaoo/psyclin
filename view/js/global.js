/**
 * @fileoverview Script global para aplicações do Psyclin
 * @version 1.2.0
 * @author Matheus Assunção
 */

/**
 * Configuração dos endpoints da API
 */
const CONFIG_API = {
    baseURL: "http://localhost:8080",
    endpoints: {
        dashboard: {
            profissionais: "/api/profissionais",
            atender: "/api/consultas/ativas",
            anamnese: "/api/pacientes/ativos",
            encontros: "/api/atendimentos/ativos",
            relatorios: "/api/relatorios/ativos",
            historico: "/api/historico"
        },
        cadastro: {
            doutor: {
                path: "/api/profissionais",
                fields: ['nomeProf', 'codProf', 'consProf', 'supProf', 'statusProf', 'tipoProf'],
                filter: item => [1, 2, 3].includes(item.tipoProf),
                mapping: {
                    'nomeProf': 'nome',
                    'codProf': 'código',
                    'consProf': 'registro',
                    'supProf': 'supervisor',
                    'statusProf': 'status',
                    'tipoProf': 'cargo'
                }
            },
            admin: {
                path: "/profissional/tipo/4",
                fields: ['nomeProf', 'codProf', 'consProf', 'statusProf', 'tipoProf'],
                filter: item => item.tipoProf === 4,
                mapping: {
                    'nomeProf': 'nome',
                    'codProf': 'código',
                    'consProf': 'registro',
                    'statusProf': 'status',
                    'tipoProf': 'cargo'
                }
            },
            paciente: {
                path: "/paciente",
                fields: ['nomePac', 'cpfPac', 'telPac', 'statusPac'],
                filter: item => item.statusPac !== 1,
                mapping: {
                    'nomePac': 'nome',
                    'cpfPac': 'cpf',
                    'telPac': 'telefone',
                    'statusPac': 'status'
                }
            },
            anamnese: {
                path: "/anamnese",
                fields: ['paciente', 'data', 'profissional', 'status']
            },
            relatorio: {
                path: "/relatorio",
                fields: ['titulo', 'paciente', 'data', 'status']
            }
        }
    }
};

/**
 * Estado global da aplicação
 */
const AppState = {
    dadosCarregados: {
        doutor: [],
        admin: [],
        paciente: [],
        anamnese: [],
        relatorio: []
    },
    tipoConteudoAtual: null,
    isLoading: false
};

/**
 * Inicializa a API e configura o dashboard
 */
function inicializarAPI() {
    const endpointsDashboard = Object.fromEntries(
        Object.entries(CONFIG_API.endpoints.dashboard).map(([key, value]) => [
            key,
            CONFIG_API.baseURL + value
        ])
    );

    const endpointsCadastro = Object.fromEntries(
        Object.entries(CONFIG_API.endpoints.cadastro).map(([key, value]) => [
            key,
            CONFIG_API.baseURL + value.path
        ])
    );

    configurarDashboard(endpointsDashboard);
    configurarCadastro(endpointsCadastro);
}

/**
 * Configura o sistema de cadastro com handlers para os botões
 * @param {Object} endpoints - URLs dos endpoints da API
 */
function configurarCadastro(endpoints) {
    // Mapeia os botões aos seus handlers
    const botoes = {
        'DOUTOR': () => carregarDados('doutor', endpoints.doutor),
        'ADMIN': () => carregarDados('admin', endpoints.admin),
        'PACIENTE': () => carregarDados('paciente', endpoints.paciente),
        'ANAMNESE': () => carregarDados('anamnese', endpoints.anamnese),
        'RELATORIO': () => carregarDados('relatorio', endpoints.relatorio),
        'ADD MEMBRO': abrirModalAddMembro
    };

    // Adiciona listeners a todos os botões
    document.querySelectorAll('.main-button').forEach(botao => {
        const texto = botao.textContent.trim();
        const handler = botoes[texto];

        if (handler) {
            botao.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove classe ativa de todos os botões
                document.querySelectorAll('.main-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Adiciona classe ativa ao botão clicado
                botao.classList.add('active');

                // Executa o handler
                handler();
            });
            console.log(`Controlador adicionado para botão: ${texto}`);
        }
    });
}

/**
 * Carrega dados de um endpoint específico e exibe na tabela
 * @param {string} tipo - Tipo de dados (doutor, admin, paciente, etc.)
 * @param {string} url - URL do endpoint
 */
async function carregarDados(tipo, url) {
    try {
        mostrarLoader(true);
        AppState.tipoConteudoAtual = tipo;

        console.log(`Carregando dados de ${tipo} de: ${url}`);

        // Sempre busca do backend, não usa cache local
        const dados = await buscarDadosAPI(url);
        // Formata os dados de acordo com o tipo
        AppState.dadosCarregados[tipo] = formatarDados(tipo, dados);

        exibirTabelaDados(tipo, AppState.dadosCarregados[tipo]);

    } catch (erro) {
        console.error(`Erro ao carregar dados de ${tipo}:`, erro);
        exibirErro(`Erro ao carregar dados de ${tipo}: ${erro.message}`);
    } finally {
        mostrarLoader(false);
    }
}

function formatarDados(tipo, dados) {
    if (!Array.isArray(dados)) {
        console.warn('Dados recebidos não são um array:', dados);
        return [];
    }

    const config = CONFIG_API.endpoints.cadastro[tipo];
    if (!config) return dados;

    // Filtra os dados com base no tipo de profissional
    const dadosFiltrados = config.filter ? dados.filter(config.filter) : dados;

    return dadosFiltrados.map(item => {
        const dadoFormatado = {};
        config.fields.forEach(field => {
            const campoExibicao = config.mapping ? (config.mapping[field] || field) : field;

            switch (field) {
                case 'statusProf':
                    dadoFormatado[campoExibicao] = item[field] === 1 ? 'Ativo' : item[field] === 2 ? 'Inativo' : 'Suspenso';
                    break;
                case 'tipoProf':
                    dadoFormatado[campoExibicao] = getTipoProfissionalLabel(item[field]);
                    break;
                default:
                    dadoFormatado[campoExibicao] = item[field] || '-';
            }
        });
        return dadoFormatado;
    });
}

function getTipoProfissionalLabel(tipo) {
    switch (tipo) {
        case 1:
            return 'Administrativo';
        case 2:
            return 'Técnico Básico';
        case 3:
            return 'Técnico Superior';
        case 4:
            return 'Administrador Master';
        default:
            return 'Não definido';
    }
}

/**
 * Exibe os dados em uma tabela estruturada
 * @param {string} tipo - Tipo de dados
 * @param {Array} dados - Array de dados para exibir
 */
function exibirTabelaDados(tipo, dados) {
    const container = document.querySelector('.content-wrapper');
    if (!container) {
        console.error('Container principal não encontrado');
        return;
    }

    // Remove tabela existente se houver
    const tabelaExistente = container.querySelector('.tabela-dados');
    if (tabelaExistente) {
        tabelaExistente.remove();
    }

    // Cria a estrutura da tabela
    const estruturaTabela = criarEstruturaTabela(tipo, dados);

    // Insere a tabela após os botões
    const botoes = container.querySelector('.flex.flex-wrap');
    if (botoes && botoes.nextSibling) {
        container.insertBefore(estruturaTabela, botoes.nextSibling);
    } else {
        container.appendChild(estruturaTabela);
    }

    // Inicializa os ícones Feather após criar a tabela
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

/**
 * Cria a estrutura HTML da tabela baseada no tipo de dados
 * @param {string} tipo - Tipo de dados
 * @param {Array} dados - Array de dados
 * @returns {HTMLElement} Elemento da tabela
 */
function criarEstruturaTabela(tipo, dados) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tabela-dados mt-8 bg-white rounded-lg shadow-lg overflow-hidden';

    // Configurações específicas para cada tipo
    const configuracoes = {
        doutor: {
            titulo: 'Profissionais',
            colunas: ['Nome', 'Código', 'Registro', 'Supervisor', 'Status', 'Cargo', 'Ações'],
            campos: ['nome', 'código', 'registro', 'supervisor', 'status', 'cargo']
        },
        admin: {
            titulo: 'Administradores',
            colunas: ['Nome', 'Código', 'Registro', 'Status', 'Cargo', 'Ações'],
            campos: ['nome', 'código', 'registro', 'status', 'cargo']
        },
        paciente: {
            titulo: 'Pacientes',
            colunas: ['Nome', 'CPF', 'Telefone', 'Status', 'Ações'],
            campos: ['nome', 'cpf', 'telefone', 'status']
        },
        anamnese: {
            titulo: 'Anamneses',
            colunas: ['Paciente', 'Data', 'Profissional', 'Status', 'Ações'],
            campos: ['paciente', 'data', 'profissional', 'status']
        },
        relatorio: {
            titulo: 'Relatórios',
            colunas: ['Título', 'Paciente', 'Data', 'Status', 'Ações'],
            campos: ['titulo', 'paciente', 'data', 'status']
        }
    };

    const config = configuracoes[tipo];
    if (!config) {
        console.error(`Configuração não encontrada para tipo: ${tipo}`);
        return wrapper;
    }

    // Detecta mobile
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
        // Cards para mobile
        wrapper.innerHTML = `
            <div class="flex flex-col gap-4">
                ${dados.length === 0 ? 
                    `<div class="text-center text-gray-500">Nenhum registro encontrado</div>` :
                    dados.map((item, index) => `
                        <div class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                            ${config.campos.map((campo, i) => `
                                <div>
                                    <span class="font-bold">${config.colunas[i]}:</span>
                                    <span>${item[campo] || '-'}</span>
                                </div>
                            `).join('')}
                            <div class="flex gap-2 mt-2">
                                <!-- Botões de ação -->
                                <button onclick="editarItem('${tipo}', ${index})"><i data-feather="edit-2"></i></button>
                                <button onclick="excluirItem('${tipo}', ${index})"><i data-feather="trash-2"></i></button>
                                <button onclick="visualizarItem('${tipo}', ${index})"><i data-feather="eye"></i></button>
                            </div>
                        </div>
                    `).join('')}
            </div>
        `;
    } else {
        // Tabela tradicional para desktop
        wrapper.innerHTML = `
            <div class="p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">${config.titulo}</h2>
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="bg-gray-50">
                            <tr>
                                ${config.colunas.map(coluna => 
                                    `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${coluna}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${dados.length === 0 ? 
                                `<tr><td colspan="${config.colunas.length}" class="px-6 py-4 text-center text-gray-500">Nenhum registro encontrado</td></tr>` :
                                dados.map((item, index) => criarLinhaTabela(item, config.campos, index)).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    return wrapper;
}

/**
 * Cria uma linha da tabela
 * @param {Object} item - Item de dados
 * @param {Array} campos - Campos a serem exibidos
 * @param {number} index - Índice do item
 * @returns {string} HTML da linha
 */
function criarLinhaTabela(item, campos, index) {
    const config = CONFIG_API.endpoints.cadastro[AppState.tipoConteudoAtual];
    if (!config) return '';

    // Altera os ícones para usar Feather em vez de classes
    const acoes = `
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end space-x-2">
                <button class="text-black-900 hover:text-black-100" onclick="editarItem('${AppState.tipoConteudoAtual}', ${index})">
                    <i data-feather="edit-2" class="w-4 h-4"></i>
                </button>
                <button  class="text-black-900 hover:text-black-100" onclick="excluirItem('${AppState.tipoConteudoAtual}', ${index})">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
                <button class="text-black-900 hover:text-black-100"  onclick="visualizarItem('${AppState.tipoConteudoAtual}', ${index})">
                    <i data-feather="eye" class="w-4 h-4"></i>
                </button>
            </div>
        </td>
    `;

    return `
        <tr class="hover:bg-gray-50 transition-colors">
            ${campos.map((campo, i) => {
                const valor = item[campo];
                if (i === 0) {
                    return `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <img class="h-10 w-10 rounded-full" src='https://static-00.iconduck.com/assets.00/avatar-icon-512x512-gu21ei4u.png${index + 1}' alt="Avatar">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${valor || '-'}</div>
                                    <div class="text-sm text-gray-500">${item.cargo || 'Profissional'}</div>
                                </div>
                            </div>
                        </td>
                    `;
                } else if (campo === 'status') {
                    const isAtivo = valor === 'Ativo';
                    return `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${valor}
                            </span>
                        </td>
                    `;
                }
                return `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${valor || '-'}
                    </td>
                `;
            }).join('')}
            ${acoes}
        </tr>
    `;
}

/**
 * Configura o dashboard com os dados obtidos da API
 * @param {Object} endpoints - URLs dos endpoints da API
 */
function configurarDashboard(endpoints) {
    mostrarLoader(true);

    const contadores = {
        profissionais: "active-professionals-count",
        atender: "attend-count",
        anamnese: "anamnese-count",
        encontros: "encontros-count",
        relatorios: "relatorios-count",
        historico: "historico-count"
    };

    Object.keys(endpoints).forEach(tipo => {
        const url = endpoints[tipo];
        const contadorId = contadores[tipo];

        buscarDadosAPI(url)
            .then(dados => {
                atualizarContador(contadorId, dados);
            })
            .catch(erro => {
                console.error(`Erro ao buscar dados de ${tipo}:`, erro);
                if (document.getElementById(contadorId)) {
                    document.getElementById(contadorId).textContent = "Erro";
                }
            });
    });

    setTimeout(() => {
        mostrarLoader(false);
    }, 1000);
}

/**
 * Busca dados de um endpoint da API
 * @param {string} url - URL do endpoint
 * @returns {Promise} Promise com o resultado da requisição
 */
async function buscarDadosAPI(url) {
    console.log(`Iniciando requisição para: ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Resposta recebida de ${url}:`, response);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Dados recebidos de ${url}:`, data);
        
        if (!data) {
            throw new Error('Dados vazios recebidos da API');
        }
        
        return data;
        
    } catch (erro) {
        console.error(`Erro ao buscar dados de ${url}:`, erro);
        throw erro;
    }
}

/**
 * Atualiza o contador no card com o valor adequado
 * @param {string} contadorId - ID do elemento contador no DOM
 * @param {Array|Object} dados - Dados obtidos da API
 */
function atualizarContador(contadorId, dados) {
    console.log(`Atualizando contador ${contadorId} com dados:`, dados);

    const elemento = document.getElementById(contadorId);
    if (!elemento) {
        console.error(`Elemento com ID ${contadorId} não encontrado.`);
        return;
    }

    let valor = 0;

    try {
        if (Array.isArray(dados)) {
            valor = dados.length;
        } else if (typeof dados === 'object' && dados !== null) {
            valor = dados.total || dados.quantidade || dados.count ||
                dados.length || dados.size || Object.keys(dados).length;
        } else if (typeof dados === 'number') {
            valor = dados;
        }
    } catch (erro) {
        console.error(`Erro ao processar dados para ${contadorId}:`, erro);
    }

    valor = Number(valor) || 0;
    const valorFormatado = valor < 100 ? valor.toString().padStart(3, '0') : valor;
    
    elemento.textContent = valorFormatado;
    elemento.classList.add('atualizado');
    
    setTimeout(() => {
        elemento.classList.remove('atualizado');
    }, 1000);
}

/**
 * Mostra ou esconde o loader
 * @param {boolean} mostrar - Se true, mostra o loader; se false, esconde
 */
function mostrarLoader(mostrar) {
    const loader = document.querySelector('.loader');
    if (loader) {
        AppState.isLoading = mostrar;
        loader.classList.toggle('hidden', !mostrar);
    }
}

/**
 * Exibe mensagem de erro
 * @param {string} mensagem - Mensagem de erro
 */
function exibirErro(mensagem) {
    const container = document.querySelector('.content-wrapper');
    if (!container) return;

    const erroDiv = document.createElement('div');
    erroDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4';
    erroDiv.innerHTML = `
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline">${mensagem}</span>
    `;

    container.appendChild(erroDiv);

    setTimeout(() => {
        erroDiv.remove();
    }, 5000);
}

/**
 * Handlers para ações da tabela
 */
function editarItem(tipo, index) {
    console.log(`Editando item ${index} do tipo ${tipo}`);
    // Implementar lógica de edição
}

function excluirItem(tipo, index) {
    console.log(`Excluindo item ${index} do tipo ${tipo}`);
    if (confirm('Tem certeza que deseja excluir este item?')) {
        AppState.dadosCarregados[tipo].splice(index, 1);
        exibirTabelaDados(tipo, AppState.dadosCarregados[tipo]);
    }
}

function visualizarItem(tipo, index) {
    console.log(`Visualizando item ${index} do tipo ${tipo}`);
    // Implementar lógica de visualização
}

/**
 * Abre modal para adicionar novo membro
 */
function abrirModalAddMembro() {
    console.log('Abrindo modal para adicionar membro');
    // Implementar modal de adição
}

/**
 * Atualiza manualmente o dashboard
 */
function atualizarDashboard() {
    inicializarAPI();
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando aplicação Psyclin...');
    inicializarAPI();

    // Configura a atualização automática a cada 5 minutos
    setInterval(inicializarAPI, 5 * 60 * 1000);

    // Inicializa os ícones Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});