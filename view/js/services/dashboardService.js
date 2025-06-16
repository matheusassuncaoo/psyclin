/**
 * Serviço responsável por gerenciar as chamadas da API relacionadas ao dashboard
 */
class DashboardService {
    constructor() {
        // Configuração da URL base da API
        // Em produção, você pode querer usar uma variável de ambiente ou configuração dinâmica
        this.baseUrl = this.getBaseUrl();
    }

    /**
     * Obtém a URL base da API baseado no ambiente
     * @returns {string} URL base da API
     */
    getBaseUrl() {
        // Em desenvolvimento, usa localhost
        // Em produção, você pode querer usar uma URL diferente
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8080';
        } else {
            // Em produção, use a URL do seu servidor
            return `http://${hostname}:8080`;
        }
    }

    /**
     * Configura os headers padrão para as requisições
     * @returns {Object} Headers para as requisições
     */
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Busca os dados resumidos para o dashboard
     * @returns {Promise<Object>} Dados do dashboard
     */
    async buscarDadosDashboard() {
        try {
            console.log('Buscando dados do dashboard da API:', this.baseUrl);
            
            const [profissionais, pacientes, atendimentos, anamneses, encontros, relatorios] = await Promise.all([
                this.buscarProfissionaisAtivos(),
                this.buscarPacientesAtivos(),
                this.buscarAtendimentos(),
                this.buscarAnamneses(),
                this.buscarEncontros(),
                this.buscarRelatorios()
            ]);

            return {
                profissionais,
                pacientes,
                atendimentos,
                anamneses,
                encontros,
                relatorios
            };
        } catch (erro) {
            console.error('Erro ao buscar dados do dashboard:', erro);
            throw new Error(`Falha ao carregar dados: ${erro.message}`);
        }
    }

    /**
     * Método genérico para fazer requisições à API
     * @param {string} endpoint - Endpoint da API
     * @returns {Promise<any>} Resposta da API
     */
    async fazerRequisicao(endpoint) {
        const url = `${this.baseUrl}${endpoint}`;
        const resposta = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status} - ${resposta.statusText}`);
        }

        return resposta.json();
    }

    async buscarProfissionaisAtivos() {
        return this.fazerRequisicao('/profissional/status/1');
    }

    async buscarPacientesAtivos() {
        return this.fazerRequisicao('/paciente/status/1');
    }

    async buscarAtendimentos() {
        return this.fazerRequisicao('/atendimento/contagem');
    }

    async buscarAnamneses() {
        return this.fazerRequisicao('/anamnese/contagem');
    }

    async buscarEncontros() {
        return this.fazerRequisicao('/encontro/contagem');
    }

    async buscarRelatorios() {
        return this.fazerRequisicao('/relatorio/contagem');
    }
} 