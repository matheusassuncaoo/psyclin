// Configurações centralizadas da API
const API_CONFIG = {
    // URL base da API - Porta 8080 é o padrão do Spring Boot
    BASE_URL: 'http://localhost:8080',
    
    // Endpoints específicos (mantendo compatibilidade com estrutura atual)
    ENDPOINTS: {
        PACIENTES: '/paciente',
        PROFISSIONAIS: '/profissional',
        ANAMNESES: '/anamnese',
        AGENDA: '/agenda',
        PROCEDIMENTOS: '/procedimento',
        PRONTUARIOS: '/prontuario',
        PERGUNTAS: '/pergunta',
        RESPOSTAS: '/resposta',
        MODULOS: '/modulo'
    },
    
    // Headers padrão
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Timeout padrão para requisições (em ms)
    TIMEOUT: 10000,
    
    // Configurações de ambiente
    ENVIRONMENT: {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production'
    },
    
    // Portas alternativas em caso de falha
    FALLBACK_PORTS: [8080, 8090, 3000, 9090]
};

// Função helper para construir URLs completas
function buildApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Função para verificar se o servidor está acessível
async function checkServerHealth() {
    try {
        console.log('🏥 Verificando saúde do servidor...');
        const response = await fetch(`${API_CONFIG.BASE_URL}/actuator/health`, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
        });
        
        if (response.ok) {
            console.log('✅ Servidor está saudável');
            return true;
        } else {
            console.warn('⚠️ Servidor respondeu com status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao verificar saúde do servidor:', error.message);
        return false;
    }
}

// Função para testar conectividade básica
async function testConnectivity() {
    try {
        console.log('🔌 Testando conectividade básica...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(API_CONFIG.BASE_URL, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors' // Para evitar problemas de CORS em teste básico
        });
        
        clearTimeout(timeoutId);
        console.log('✅ Conectividade básica OK');
        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('❌ Timeout na conexão');
        } else {
            console.error('❌ Erro de conectividade:', error.message);
        }
        return false;
    }
}

// Função para validar se a porta é segura para navegadores
function isPortSafe(port) {
    // Lista de portas consideradas inseguras pelos navegadores
    const unsafePorts = [
        1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669, 5060
    ];
    
    return !unsafePorts.includes(parseInt(port));
}

// Função para extrair porta da URL
function getPortFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
    } catch (error) {
        console.error('❌ Erro ao extrair porta da URL:', error);
        return null;
    }
}

// Validação inicial da configuração
function validateConfig() {
    const port = getPortFromUrl(API_CONFIG.BASE_URL);
    
    if (!isPortSafe(port)) {
        console.warn(`⚠️ ATENÇÃO: Porta ${port} pode ser bloqueada pelos navegadores!`);
        console.log('💡 Recomendação: Use portas seguras como 8080, 8090, 3000 ou 9090');
        return false;
    }
    
    console.log(`✅ Porta ${port} é segura para navegadores`);
    return true;
}

// Exportar configurações e funções utilitárias
export { 
    API_CONFIG, 
    buildApiUrl, 
    checkServerHealth, 
    testConnectivity, 
    validateConfig,
    isPortSafe 
};
