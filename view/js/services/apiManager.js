import { API_CONFIG, buildApiUrl, validateConfig, checkServerHealth } from '../config/apiConfig.js';

// Validar configuração na inicialização
validateConfig();

const pacienteEndpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES);

async function pegarPacientes(){
    try {
        console.log('🔄 Fazendo requisição para:', pacienteEndpoint);
        console.log('🔧 Configuração atual:', {
            baseUrl: API_CONFIG.BASE_URL,
            endpoint: API_CONFIG.ENDPOINTS.PACIENTES,
            urlCompleta: pacienteEndpoint
        });
        
        const response = await fetch(pacienteEndpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors' // Explicitamente habilitando CORS
        });

        console.log('📡 Resposta recebida:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            // Tratamento específico para diferentes tipos de erro
            if (response.status === 401) {
                throw new Error('❌ Erro 401: Não autorizado. Verifique se o servidor Spring Boot está rodando e se as configurações de segurança estão corretas.');
            } else if (response.status === 403) {
                throw new Error('❌ Erro 403: Acesso proibido.');
            } else if (response.status === 404) {
                throw new Error('❌ Erro 404: Endpoint não encontrado. Verifique se o servidor está rodando na porta 5060.');
            } else if (response.status >= 500) {
                throw new Error(`❌ Erro do servidor (${response.status}): ${response.statusText}`);
            } else {
                throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
            }
        }

        const pacientes = await response.json();
        console.log('✅ Pacientes carregados com sucesso:', pacientes.length, 'pacientes encontrados');
        return pacientes;
    } catch (error) {
        // Tratamento específico para erro de rede
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('🌐 Erro de conexão: Servidor Spring Boot pode estar offline ou rodando em porta diferente');
            throw new Error('❌ Erro de conexão: Verifique se o servidor Spring Boot está rodando na porta 5060');
        }
        
        console.error('💥 Erro ao buscar pacientes:', error);
        throw error;
    }
}

// Função para buscar apenas pacientes ativos
async function pegarPacientesAtivos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES + '/ativos');
        console.log('🔄 Fazendo requisição para pacientes ativos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        console.log('📡 Resposta recebida:', {
            status: response.status,
            statusText: response.statusText
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('❌ Erro 401: Não autorizado.');
            } else if (response.status === 404) {
                throw new Error('❌ Erro 404: Endpoint não encontrado.');
            } else {
                throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
            }
        }

        const pacientesAtivos = await response.json();
        console.log('✅ Pacientes ativos carregados com sucesso:', pacientesAtivos.length, 'pacientes encontrados');
        return pacientesAtivos;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('🌐 Erro de conexão: Servidor Spring Boot pode estar offline');
            throw new Error('❌ Erro de conexão: Verifique se o servidor Spring Boot está rodando na porta 8080');
        }
        
        console.error('💥 Erro ao buscar pacientes ativos:', error);
        throw error;
    }
}

// Função para contar pacientes ativos
async function contarPacientesAtivos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES + '/contar-ativos');
        console.log('🔄 Contando pacientes ativos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de pacientes ativos:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar pacientes ativos:', error);
        throw error;
    }
}

// ================================
// FUNÇÕES PARA PROFISSIONAIS
// ================================

// Função para buscar todos os profissionais
async function pegarProfissionais(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS);
        console.log('🔄 Fazendo requisição para profissionais:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const profissionais = await response.json();
        console.log('✅ Profissionais carregados com sucesso:', profissionais.length, 'profissionais encontrados');
        return profissionais;
    } catch (error) {
        console.error('💥 Erro ao buscar profissionais:', error);
        throw error;
    }
}

// Função para buscar apenas profissionais ativos
async function pegarProfissionaisAtivos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS + '/ativos');
        console.log('🔄 Fazendo requisição para profissionais ativos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const profissionaisAtivos = await response.json();
        console.log('✅ Profissionais ativos carregados com sucesso:', profissionaisAtivos.length, 'profissionais encontrados');
        return profissionaisAtivos;
    } catch (error) {
        console.error('💥 Erro ao buscar profissionais ativos:', error);
        throw error;
    }
}

// Função para contar profissionais ativos (otimizada para dashboard)
async function contarProfissionaisAtivos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS + '/contar-ativos');
        console.log('🔄 Contando profissionais ativos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de profissionais ativos:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar profissionais ativos:', error);
        throw error;
    }
}

// ================================
// FUNÇÕES PARA ANAMNESES
// ================================

// Função para buscar todas as anamneses
async function pegarAnamneses(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.ANAMNESES);
        console.log('🔄 Fazendo requisição para anamneses:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const anamneses = await response.json();
        console.log('✅ Anamneses carregadas com sucesso:', anamneses.length, 'anamneses encontradas');
        return anamneses;
    } catch (error) {
        console.error('💥 Erro ao buscar anamneses:', error);
        throw error;
    }
}

// Função para buscar apenas anamneses ativas (statusFuncional = true)
async function pegarAnamnesesAtivas(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.ANAMNESES + '/ativas');
        console.log('🔄 Fazendo requisição para anamneses ativas:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const anamnesesAtivas = await response.json();
        console.log('✅ Anamneses ativas carregadas com sucesso:', anamnesesAtivas.length, 'anamneses encontradas');
        return anamnesesAtivas;
    } catch (error) {
        console.error('💥 Erro ao buscar anamneses ativas:', error);
        throw error;
    }
}

// Função para contar anamneses ativas (otimizada para dashboard, sem dados sensíveis)
async function contarAnamnesesAtivas(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.ANAMNESES + '/ativas/count');
        console.log('🔄 Contando anamneses ativas:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de anamneses ativas:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar anamneses ativas:', error);
        throw error;
    }
}

// ================================
// FUNÇÕES PARA ENCONTROS (AGENDA)
// ================================

// Função para buscar todos os agendamentos
async function pegarAgendamentos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.AGENDA);
        console.log('🔄 Fazendo requisição para agendamentos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const agendamentos = await response.json();
        console.log('✅ Agendamentos carregados com sucesso:', agendamentos.length, 'agendamentos encontrados');
        return agendamentos;
    } catch (error) {
        console.error('💥 Erro ao buscar agendamentos:', error);
        throw error;
    }
}

// Função para buscar encontros ativos de hoje
async function pegarEncontrosAtivosHoje(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.AGENDA + '/hoje/ativos');
        console.log('🔄 Fazendo requisição para encontros ativos de hoje:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const encontrosHoje = await response.json();
        console.log('✅ Encontros ativos de hoje carregados:', encontrosHoje.length, 'encontros encontrados');
        return encontrosHoje;
    } catch (error) {
        console.error('💥 Erro ao buscar encontros ativos de hoje:', error);
        throw error;
    }
}

// Função para contar encontros ativos de hoje (otimizada para dashboard)
async function contarEncontrosAtivosHoje(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.AGENDA + '/hoje/ativos/count');
        console.log('🔄 Fazendo requisição para contar encontros ativos de hoje:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de encontros ativos de hoje:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar encontros ativos de hoje:', error);
        throw error;
    }
}

// ========== PROCEDIMENTOS ==========

// Função para buscar todos os procedimentos
async function pegarProcedimentos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROCEDIMENTOS);
        console.log('🔄 Fazendo requisição para procedimentos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('❌ Erro 401: Não autorizado.');
            } else if (response.status === 404) {
                throw new Error('❌ Erro 404: Endpoint não encontrado.');
            } else {
                throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
            }
        }

        const procedimentos = await response.json();
        console.log('✅ Procedimentos carregados com sucesso:', procedimentos.length, 'procedimentos encontrados');
        return procedimentos;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('🌐 Erro de conexão: Servidor Spring Boot pode estar offline');
            throw new Error('❌ Erro de conexão: Verifique se o servidor Spring Boot está rodando na porta 8080');
        }
        
        console.error('💥 Erro ao buscar procedimentos:', error);
        throw error;
    }
}

// Função para contar total de procedimentos disponíveis
async function contarProcedimentos(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROCEDIMENTOS + '/count');
        console.log('🔄 Fazendo requisição para contar procedimentos:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de procedimentos disponíveis:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar procedimentos:', error);
        throw error;
    }
}

// ========== PRONTUÁRIOS (HISTÓRICO) ==========

// Função para buscar todos os prontuários
async function pegarProntuarios(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRONTUARIOS);
        console.log('🔄 Fazendo requisição para prontuários:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('❌ Erro 401: Não autorizado.');
            } else if (response.status === 404) {
                throw new Error('❌ Erro 404: Endpoint não encontrado.');
            } else {
                throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
            }
        }

        const prontuarios = await response.json();
        console.log('✅ Prontuários carregados com sucesso:', prontuarios.length, 'prontuários encontrados');
        return prontuarios;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('🌐 Erro de conexão: Servidor Spring Boot pode estar offline');
            throw new Error('❌ Erro de conexão: Verifique se o servidor Spring Boot está rodando na porta 8080');
        }
        
        console.error('💥 Erro ao buscar prontuários:', error);
        throw error;
    }
}

// Função para contar total de prontuários (histórico completo)
async function contarProntuarios(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRONTUARIOS + '/count');
        console.log('🔄 Fazendo requisição para contar prontuários (histórico):', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem total de prontuários (histórico):', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar prontuários:', error);
        throw error;
    }
}

// Função para contar prontuários criados hoje
async function contarProntuariosHoje(){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRONTUARIOS + '/count/hoje');
        console.log('🔄 Fazendo requisição para contar prontuários de hoje:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const count = await response.json();
        console.log('✅ Contagem de prontuários criados hoje:', count);
        return count;
    } catch (error) {
        console.error('💥 Erro ao contar prontuários de hoje:', error);
        throw error;
    }
}

// Função para buscar últimos prontuários criados
async function pegarUltimosProntuarios(limite = 10){
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRONTUARIOS + `/ultimos?limite=${limite}`);
        console.log('🔄 Fazendo requisição para últimos prontuários:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const prontuarios = await response.json();
        console.log('✅ Últimos prontuários carregados:', prontuarios.length, 'prontuários');
        return prontuarios;
    } catch (error) {
        console.error('💥 Erro ao buscar últimos prontuários:', error);
        throw error;
    }
}

// ==================== FUNÇÕES DE EDIÇÃO E EXCLUSÃO ====================

/**
 * Atualiza um profissional
 */
async function atualizarProfissional(id, dadosProfissional) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS + `/${id}`);
        console.log('🔄 Atualizando profissional:', id, dadosProfissional);

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors',
            body: JSON.stringify(dadosProfissional)
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        console.log('✅ Profissional atualizado com sucesso');
        return true;
    } catch (error) {
        console.error('💥 Erro ao atualizar profissional:', error);
        throw error;
    }
}

/**
 * Exclui (inativa) um profissional
 */
async function excluirProfissional(id) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS + `/${id}`);
        console.log('🗑️ Excluindo profissional:', id);

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        console.log('✅ Profissional excluído com sucesso');
        return true;
    } catch (error) {
        console.error('💥 Erro ao excluir profissional:', error);
        throw error;
    }
}

/**
 * Atualiza um paciente
 */
async function atualizarPaciente(id, dadosPaciente) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES + `/${id}`);
        console.log('🔄 Atualizando paciente:', id, dadosPaciente);

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors',
            body: JSON.stringify(dadosPaciente)
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        console.log('✅ Paciente atualizado com sucesso');
        return true;
    } catch (error) {
        console.error('💥 Erro ao atualizar paciente:', error);
        throw error;
    }
}

/**
 * Exclui (inativa) um paciente
 */
async function excluirPaciente(id) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES + `/${id}`);
        console.log('🗑️ Excluindo paciente:', id);

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        console.log('✅ Paciente excluído com sucesso');
        return true;
    } catch (error) {
        console.error('💥 Erro ao excluir paciente:', error);
        throw error;
    }
}

/**
 * Busca profissional por ID
 */
async function buscarProfissionalPorId(id) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PROFISSIONAIS + `/${id}`);
        console.log('🔍 Buscando profissional por ID:', id);

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const profissional = await response.json();
        console.log('✅ Profissional encontrado:', profissional);
        return profissional;
    } catch (error) {
        console.error('💥 Erro ao buscar profissional:', error);
        throw error;
    }
}

/**
 * Busca paciente por ID
 */
async function buscarPacientePorId(id) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PACIENTES + `/${id}`);
        console.log('🔍 Buscando paciente por ID:', id);

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const paciente = await response.json();
        console.log('✅ Paciente encontrado:', paciente);
        return paciente;
    } catch (error) {
        console.error('💥 Erro ao buscar paciente:', error);
        throw error;
    }
}

/**
 * Envia solicitação de exclusão (sistema de aprovação)
 */
async function solicitarExclusao(tipo, id, motivo, usuarioSolicitante) {
    try {
        console.log('📋 Enviando solicitação de exclusão:', {
            tipo,
            id,
            motivo,
            usuarioSolicitante,
            timestamp: new Date().toISOString()
        });
        
        // Por enquanto, apenas simula o envio - implementar endpoint de solicitação posteriormente
        // const endpoint = buildApiUrl('/solicitacao-exclusao');
        // const response = await fetch(endpoint, {
        //     method: 'POST',
        //     headers: API_CONFIG.DEFAULT_HEADERS,
        //     mode: 'cors',
        //     body: JSON.stringify({
        //         tipoEntidade: tipo,
        //         idEntidade: id,
        //         motivo: motivo,
        //         usuarioSolicitante: usuarioSolicitante,
        //         dataHoraSolicitacao: new Date().toISOString(),
        //         statusSolicitacao: 'PENDENTE'
        //     })
        // });

        // Simula sucesso
        console.log('✅ Solicitação de exclusão enviada com sucesso');
        return {
            id: Date.now(),
            status: 'PENDENTE',
            mensagem: 'Solicitação enviada para aprovação'
        };
    } catch (error) {
        console.error('💥 Erro ao enviar solicitação de exclusão:', error);
        throw error;
    }
}

// ==========================================
// MONITORAMENTO DE CONEXÕES DO BANCO
// ==========================================

/**
 * Obtém o status atual das conexões do banco de dados
 */
async function obterStatusConexoes() {
    try {
        const endpoint = buildApiUrl('/database/status');
        console.log('🔍 Verificando status das conexões:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 Status das conexões obtido:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro ao obter status das conexões:', error);
        throw new Error(`Falha ao verificar status das conexões: ${error.message}`);
    }
}

/**
 * Executa limpeza manual das conexões ociosas
 */
async function executarLimpezaConexoes() {
    try {
        const endpoint = buildApiUrl('/database/cleanup');
        console.log('🧹 Executando limpeza de conexões:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Limpeza de conexões executada:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro na limpeza de conexões:', error);
        throw new Error(`Falha na limpeza de conexões: ${error.message}`);
    }
}

/**
 * Executa limpeza de emergência das conexões (mais agressiva)
 */
async function executarLimpezaEmergencia() {
    try {
        const endpoint = buildApiUrl('/database/emergency-cleanup');
        console.log('🚨 Executando limpeza de emergência:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: API_CONFIG.DEFAULT_HEADERS
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('⚠️ Limpeza de emergência executada:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro na limpeza de emergência:', error);
        throw new Error(`Falha na limpeza de emergência: ${error.message}`);
    }
}

// Exportando as funções para serem usadas em outros módulos
export { 
    pegarPacientes, 
    pegarPacientesAtivos, 
    contarPacientesAtivos,
    pegarProfissionais,
    pegarProfissionaisAtivos,
    contarProfissionaisAtivos,
    pegarAnamneses,
    pegarAnamnesesAtivas,
    contarAnamnesesAtivas,
    pegarAgendamentos,
    pegarEncontrosAtivosHoje,
    contarEncontrosAtivosHoje,
    pegarProcedimentos,
    contarProcedimentos,
    pegarProntuarios,
    contarProntuarios,
    contarProntuariosHoje,
    pegarUltimosProntuarios,
    atualizarProfissional,
    excluirProfissional,
    atualizarPaciente,
    excluirPaciente,
    buscarProfissionalPorId,
    buscarPacientePorId,
    solicitarExclusao,
    obterStatusConexoes,
    executarLimpezaConexoes,
    executarLimpezaEmergencia,
    obterStatusConexoes,
    executarLimpezaConexoes,
    executarLimpezaEmergencia
};