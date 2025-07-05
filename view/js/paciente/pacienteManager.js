/**
 * @fileoverview Gerenciador de Pacientes - Psyclin
 * Responsável por carregar, filtrar e gerenciar dados dos pacientes
 * @version 1.0.0
 * @author Sistema Psyclin
 */

import { 
    pegarPacientes, 
    pegarPacientesAtivos, 
    contarPacientesAtivos 
} from '../services/apiManager.js';
import { dashboardCache } from '../utils/dashboardCache.js';

/**
 * Classe para gerenciar dados e operações dos pacientes
 */
class PacienteManager {
    constructor() {
        this.pacientes = [];
        this.pacientesFiltrados = [];
        this.paginaAtual = 1;
        this.itensPorPagina = 10;
        this.totalPaginas = 0;
        this.filtroAtual = {
            busca: '',
            status: '',
            ordenacao: 'nome'
        };
        this.estatisticas = {
            total: 0,
            ativos: 0,
            consultasHoje: 0,
            pendentes: 0
        };
    }

    /**
     * Carrega todos os pacientes da API com cache
     */
    async carregarPacientes() {
        try {
            console.log('📊 Carregando pacientes...');
            
            // Verificar cache primeiro (1 hora para pacientes)
            const cacheKey = dashboardCache.generateKey('pacientes', 'todos');
            let pacientes = dashboardCache.get(cacheKey);
            
            if (pacientes === null) {
                // Cache miss - buscar da API
                const response = await pegarPacientes();
                pacientes = response.data || response || [];
                
                // Armazenar no cache por 1 hora
                dashboardCache.set(cacheKey, pacientes, dashboardCache.TTL_1_HOUR);
                console.log('📦 Dados dos pacientes carregados da API e armazenados no cache');
            } else {
                console.log('⚡ Dados dos pacientes carregados do cache');
            }
            
            this.pacientes = pacientes;
            this.aplicarFiltros();
            this.calcularEstatisticas();
            
            return pacientes;
            
        } catch (error) {
            console.error('❌ Erro ao carregar pacientes:', error);
            throw error;
        }
    }

    /**
     * Calcula estatísticas dos pacientes
     */
    calcularEstatisticas() {
        const hoje = new Date().toISOString().split('T')[0];
        
        this.estatisticas = {
            total: this.pacientes.length,
            ativos: this.pacientes.filter(p => p.statusPaciente === '1').length,
            consultasHoje: this.pacientes.filter(p => {
                // Simulação - na prática virá de outra API de agendamentos
                return p.ultimaConsulta === hoje;
            }).length,
            pendentes: this.pacientes.filter(p => p.statusPaciente === '0').length // Agora representa inativos
        };
    }

    /**
     * Aplica filtros aos pacientes
     */
    aplicarFiltros() {
        let resultado = [...this.pacientes];

        // Filtro de busca por nome, email ou CPF
        if (this.filtroAtual.busca.trim()) {
            const termo = this.filtroAtual.busca.toLowerCase().trim();
            resultado = resultado.filter(paciente => 
                paciente.nomePessoa?.toLowerCase().includes(termo) ||
                paciente.email?.toLowerCase().includes(termo) ||
                paciente.cpfPessoa?.includes(termo)
            );
        }

        // Filtro por status
        if (this.filtroAtual.status) {
            resultado = resultado.filter(paciente => {
                switch (this.filtroAtual.status) {
                    case 'ativo':
                        return paciente.statusPaciente === '1';
                    case 'inativo':
                        return paciente.statusPaciente === '0';
                    case 'pendente':
                        // Assumindo que pendente seria um status diferente ou baseado em outra lógica
                        return false; // Por enquanto, não há status pendente no DTO
                    default:
                        return true;
                }
            });
        }

        // Ordenação
        resultado.sort((a, b) => {
            switch (this.filtroAtual.ordenacao) {
                case 'nome':
                    return (a.nomePessoa || '').localeCompare(b.nomePessoa || '');
                case 'data':
                    return new Date(b.dataCadastro || 0) - new Date(a.dataCadastro || 0);
                case 'ultima_consulta':
                    return new Date(b.ultimaConsulta || 0) - new Date(a.ultimaConsulta || 0);
                default:
                    return 0;
            }
        });

        this.pacientesFiltrados = resultado;
        this.calcularPaginacao();
    }

    /**
     * Calcula paginação
     */
    calcularPaginacao() {
        this.totalPaginas = Math.ceil(this.pacientesFiltrados.length / this.itensPorPagina);
        if (this.paginaAtual > this.totalPaginas) {
            this.paginaAtual = 1;
        }
    }

    /**
     * Obtém pacientes da página atual
     */
    obterPacientesPaginaAtual() {
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        return this.pacientesFiltrados.slice(inicio, fim);
    }

    /**
     * Define filtro de busca
     */
    definirFiltroBusca(termo) {
        this.filtroAtual.busca = termo;
        this.paginaAtual = 1;
        this.aplicarFiltros();
    }

    /**
     * Define filtro de status
     */
    definirFiltroStatus(status) {
        this.filtroAtual.status = status;
        this.paginaAtual = 1;
        this.aplicarFiltros();
    }

    /**
     * Define ordenação
     */
    definirOrdenacao(ordenacao) {
        this.filtroAtual.ordenacao = ordenacao;
        this.aplicarFiltros();
    }

    /**
     * Navega para página específica
     */
    irParaPagina(pagina) {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaAtual = pagina;
        }
    }

    /**
     * Página anterior
     */
    paginaAnterior() {
        if (this.paginaAtual > 1) {
            this.paginaAtual--;
        }
    }

    /**
     * Próxima página
     */
    proximaPagina() {
        if (this.paginaAtual < this.totalPaginas) {
            this.paginaAtual++;
        }
    }

    /**
     * Limpa todos os filtros
     */
    limparFiltros() {
        this.filtroAtual = {
            busca: '',
            status: '',
            ordenacao: 'nome'
        };
        this.paginaAtual = 1;
        this.aplicarFiltros();
    }

    /**
     * Força refresh dos dados
     */
    async forcarRefresh() {
        console.log('🔄 Forçando refresh dos dados de pacientes...');
        dashboardCache.delete(dashboardCache.generateKey('pacientes', 'todos'));
        await this.carregarPacientes();
    }

    /**
     * Formata dados do paciente para exibição
     */
    formatarPaciente(paciente) {
        return {
            id: paciente.idPaciente || paciente.id,
            nome: paciente.nomePessoa || 'Nome não informado',
            email: paciente.email || 'Email não informado',
            telefone: this.formatarTelefone(paciente.telefone),
            idade: this.calcularIdade(paciente.dataNascimento),
            status: this.formatarStatus(paciente),
            ultimaConsulta: this.formatarData(paciente.ultimaConsulta),
            avatar: this.gerarAvatar(paciente.nomePessoa),
            cpf: paciente.cpfPessoa || 'CPF não informado'
        };
    }

    /**
     * Formata telefone
     */
    formatarTelefone(telefone) {
        if (!telefone) return 'Não informado';
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
        }
        return telefone;
    }

    /**
     * Calcula idade a partir da data de nascimento
     */
    calcularIdade(dataNascimento) {
        if (!dataNascimento) return 'N/A';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return `${idade} anos`;
    }

    /**
     * Formata status do paciente
     */
    formatarStatus(paciente) {
        if (paciente.statusPaciente === '1') {
            return { texto: 'Ativo', classe: 'bg-green-100 text-green-800' };
        } else if (paciente.statusPaciente === '0') {
            return { texto: 'Inativo', classe: 'bg-red-100 text-red-800' };
        } else {
            return { texto: 'Indefinido', classe: 'bg-gray-100 text-gray-800' };
        }
    }

    /**
     * Formata data
     */
    formatarData(data) {
        if (!data) return 'Não informado';
        try {
            return new Date(data).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    }

    /**
     * Gera avatar com iniciais
     */
    gerarAvatar(nome) {
        if (!nome) return 'NN';
        const nomes = nome.trim().split(' ');
        if (nomes.length >= 2) {
            return (nomes[0][0] + nomes[1][0]).toUpperCase();
        }
        return nome.substring(0, 2).toUpperCase();
    }

    /**
     * Obtém informações de paginação
     */
    obterInfoPaginacao() {
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina + 1;
        const fim = Math.min(this.paginaAtual * this.itensPorPagina, this.pacientesFiltrados.length);
        
        return {
            inicio,
            fim,
            total: this.pacientesFiltrados.length,
            paginaAtual: this.paginaAtual,
            totalPaginas: this.totalPaginas,
            temAnterior: this.paginaAtual > 1,
            temProximo: this.paginaAtual < this.totalPaginas
        };
    }
}

// Instância singleton
const pacienteManager = new PacienteManager();

export { pacienteManager, PacienteManager };
