import { 
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
    pegarUltimosProntuarios
} from '../services/apiManager.js';
import { dashboardCache } from '../utils/dashboardCache.js';

// Variáveis do DOM
const pacienteAtivos = document.getElementById('active-patients-count');
const profissionaisAtivos = document.getElementById('active-professionals-count');
const anamnesesAtivas = document.getElementById('active-anamneses-count');
const encontrosHoje = document.getElementById('active-encounters-today-count');
const procedimentosDisponiveis = document.getElementById('active-procedures-count');
const historicoTotal = document.getElementById('historico-count');

/**
 * Carrega contagem de pacientes ativos com cache
 */
async function carregarPacientesDashboard() {
    try {
        console.log('📊 Carregando pacientes ativos...');
        
        // Verificar cache primeiro
        const cacheKey = dashboardCache.generateKey('pacientes', 'contar-ativos');
        let countAtivos = dashboardCache.get(cacheKey);
        
        if (countAtivos === null) {
            // Cache miss - buscar da API
            countAtivos = await contarPacientesAtivos();
            // Armazenar no cache por 1 hora (pacientes mudam mais frequentemente)
            dashboardCache.set(cacheKey, countAtivos, dashboardCache.TTL_1_HOUR);
        }
        
        if (pacienteAtivos) {
            pacienteAtivos.textContent = countAtivos;
            console.log('✅ Dashboard atualizado - Pacientes ativos:', countAtivos);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar pacientes no dashboard:', error);
        if (pacienteAtivos) {
            pacienteAtivos.textContent = '0';
        }
    }
}

/**
 * Carrega contagem de profissionais ativos com cache de 8 horas
 */
async function carregarProfissionaisDashboard() {
    try {
        console.log('👨‍⚕️ Carregando profissionais ativos...');
        
        // Verificar cache primeiro (8 horas para profissionais)
        const cacheKey = dashboardCache.generateKey('profissionais', 'contar-ativos');
        let countAtivos = dashboardCache.get(cacheKey);
        
        if (countAtivos === null) {
            // Cache miss - buscar da API
            countAtivos = await contarProfissionaisAtivos();
            // Armazenar no cache por 8 horas (profissionais mudam menos frequentemente)
            dashboardCache.set(cacheKey, countAtivos, dashboardCache.TTL_8_HOURS);
        }
        
        if (profissionaisAtivos) {
            profissionaisAtivos.textContent = countAtivos;
            console.log('✅ Dashboard atualizado - Profissionais ativos:', countAtivos);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar profissionais no dashboard:', error);
        if (profissionaisAtivos) {
            profissionaisAtivos.textContent = '0';
        }
    }
}

/**
 * Carrega contagem de anamneses ativas com cache de 4 horas
 */
async function carregarAnamnesesDashboard() {
    try {
        console.log('📋 Carregando anamneses ativas...');
        
        // Verificar cache primeiro (4 horas para anamneses - intermediário entre pacientes e profissionais)
        const cacheKey = dashboardCache.generateKey('anamneses', 'contar-ativas');
        let countAtivas = dashboardCache.get(cacheKey);
        
        if (countAtivas === null) {
            // Cache miss - buscar da API
            countAtivas = await contarAnamnesesAtivas();
            // Armazenar no cache por 4 horas (balanceando segurança e performance)
            dashboardCache.set(cacheKey, countAtivas, dashboardCache.TTL_4_HOURS);
        }
        
        if (anamnesesAtivas) {
            anamnesesAtivas.textContent = countAtivas;
            console.log('✅ Dashboard atualizado - Anamneses ativas:', countAtivas);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar anamneses no dashboard:', error);
        if (anamnesesAtivas) {
            anamnesesAtivas.textContent = '0';
        }
    }
}

/**
 * Carrega contagem de encontros ativos de hoje com cache de 1 hora
 */
async function carregarEncontrosDashboard() {
    try {
        console.log('📅 Carregando encontros ativos de hoje...');
        
        // Cache de 1 hora para encontros (agenda do dia muda frequentemente)
        const cacheKey = dashboardCache.generateKey('encontros', 'contar-ativos-hoje');
        let countAtivos = dashboardCache.get(cacheKey);
        
        if (countAtivos === null) {
            // Cache miss - buscar da API
            countAtivos = await contarEncontrosAtivosHoje();
            // Armazenar no cache por 1 hora (agenda muda durante o dia)
            dashboardCache.set(cacheKey, countAtivos, dashboardCache.TTL_1_HOUR);
        }
        
        if (encontrosHoje) {
            encontrosHoje.textContent = countAtivos;
            console.log('✅ Dashboard atualizado - Encontros ativos hoje:', countAtivos);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar encontros no dashboard:', error);
        if (encontrosHoje) {
            encontrosHoje.textContent = '0';
        }
    }
}

/**
 * Carrega contagem de procedimentos disponíveis com cache de 24 horas
 */
async function carregarProcedimentosDashboard() {
    try {
        console.log('📋 Carregando procedimentos disponíveis...');
        
        // Cache de 24 horas para procedimentos (catálogo não muda frequentemente)
        const cacheKey = dashboardCache.generateKey('procedimentos', 'contar-total');
        let countTotal = dashboardCache.get(cacheKey);
        
        if (countTotal === null) {
            // Cache miss - buscar da API
            countTotal = await contarProcedimentos();
            // Armazenar no cache por 24 horas (procedimentos são relativamente estáticos)
            dashboardCache.set(cacheKey, countTotal, dashboardCache.TTL_24_HOURS);
        }
        
        if (procedimentosDisponiveis) {
            procedimentosDisponiveis.textContent = countTotal;
            console.log('✅ Dashboard atualizado - Procedimentos disponíveis:', countTotal);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar procedimentos no dashboard:', error);
        if (procedimentosDisponiveis) {
            procedimentosDisponiveis.textContent = '0';
        }
    }
}

/**
 * Carrega contagem total de prontuários (histórico) com cache de 6 horas
 */
async function carregarHistoricoDashboard() {
    try {
        console.log('📚 Carregando histórico de prontuários...');
        
        // Cache de 6 horas para histórico (prontuários crescem menos frequentemente)
        const cacheKey = dashboardCache.generateKey('historico', 'contar-total');
        let countTotal = dashboardCache.get(cacheKey);
        
        if (countTotal === null) {
            // Cache miss - buscar da API
            countTotal = await contarProntuarios();
            // Armazenar no cache por 6 horas (histórico é cumulativo, muda menos frequentemente)
            dashboardCache.set(cacheKey, countTotal, dashboardCache.TTL_6_HOURS);
        }
        
        if (historicoTotal) {
            historicoTotal.textContent = countTotal;
            console.log('✅ Dashboard atualizado - Histórico total de prontuários:', countTotal);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar histórico no dashboard:', error);
        if (historicoTotal) {
            historicoTotal.textContent = '0';
        }
    }
}

/**
 * Carrega todos os dados do dashboard
 */
async function carregarDashboardCompleto() {
    console.log('🚀 Iniciando carregamento completo do dashboard...');
    
    // Executar em paralelo para melhor performance
    await Promise.allSettled([
        carregarPacientesDashboard(),
        carregarProfissionaisDashboard(),
        carregarAnamnesesDashboard(),
        carregarEncontrosDashboard(),
        carregarProcedimentosDashboard(),
        carregarHistoricoDashboard()
    ]);
    
    // Mostrar estatísticas do cache para debug
    const stats = dashboardCache.getStats();
    console.log('📈 Estatísticas do cache:', stats);
    
    console.log('✅ Dashboard carregado com sucesso!');
}

// Chamar a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', carregarDashboardCompleto);

// Função para forçar refresh dos dados (útil para desenvolvimento)
window.refreshDashboard = () => {
    console.log('🔄 Forçando refresh do dashboard...');
    dashboardCache.clear();
    carregarDashboardCompleto();
};

// Função para debug do cache
window.dashboardCacheStats = () => {
    console.table(dashboardCache.getStats());
};