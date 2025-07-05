// Enhanced SearchManager.js
// Gerencia a busca interativa com autocomplete inteligente
// Utiliza o sistema de cores personalizado

import { 
    pegarPacientes, 
    pegarProfissionais, 
    pegarAnamneses 
} from '../services/apiManager.js';

class SearchManager {
    constructor(inputSelector) {
        this.input = document.querySelector(inputSelector);
        this.dropdown = null;
        this.debounceTimeout = null;
        this.searchCache = new Map();
        this.cacheExpiration = 5 * 60 * 1000; // 5 minutos
        this.currentSuggestionIndex = -1;
        
        // Configurações de autocomplete inteligente
        this.suggestions = {
            pacientes: [
                'paciente nome:', 'paciente cpf:', 'paciente email:', 'paciente telefone:',
                'paciente idade:', 'paciente endereço:', 'paciente histórico'
            ],
            profissionais: [
                'profissional nome:', 'profissional especialidade:', 'profissional crp:',
                'profissional email:', 'profissional telefone:', 'profissional disponível'
            ],
            anamneses: [
                'anamnese título:', 'anamnese data:', 'anamnese paciente:',
                'anamnese completa:', 'anamnese recente:', 'anamnese por período'
            ]
        };

        // Categorias com configurações do sistema de cores
        this.categories = {
            pacientes: { 
                label: 'Pacientes', 
                icon: '👤', 
                color: 'var(--mountain-meadow)',
                bgColor: 'rgba(31, 191, 131, 0.1)',
                borderColor: 'var(--mountain-meadow)'
            },
            profissionais: { 
                label: 'Profissionais', 
                icon: '👨‍⚕️', 
                color: 'var(--zomp)',
                bgColor: 'rgba(54, 166, 144, 0.1)',
                borderColor: 'var(--zomp)'
            },
            anamneses: { 
                label: 'Anamneses', 
                icon: '📋', 
                color: 'var(--oxford-blue)',
                bgColor: 'rgba(4, 47, 64, 0.1)',
                borderColor: 'var(--oxford-blue)'
            }
        };

        this.init();
    }

    init() {
        if (!this.input) {
            console.warn('❌ Input de busca não encontrado');
            return;
        }
        
        this.setupInput();
        this.attachEventListeners();
        this.injectStyles();
        
        console.log('✅ SearchManager Enhanced inicializado');
    }

    setupInput() {
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('placeholder', 'Buscar pacientes, profissionais, anamneses...');
        this.input.style.transition = 'all 0.3s ease';
    }

    attachEventListeners() {
        this.input.addEventListener('input', (e) => this.onInput(e));
        this.input.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.input.addEventListener('focus', () => this.onFocus());
        this.input.addEventListener('blur', () => this.onBlur());
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-dropdown {
                background: var(--white);
                border: 1px solid rgba(4, 47, 64, 0.1);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(10, 25, 47, 0.15);
                backdrop-filter: blur(10px);
                font-family: 'DM Sans', sans-serif;
            }

            .search-option {
                transition: all 0.2s ease;
                border-radius: 8px;
                margin: 4px 8px;
            }

            .search-option:hover,
            .search-option.active {
                background: var(--background-light);
                transform: translateY(-1px);
            }

            .search-category-header {
                background: linear-gradient(135deg, var(--background-light), var(--white));
                border-bottom: 1px solid rgba(4, 47, 64, 0.1);
                font-weight: 500;
                color: var(--prussian-blue);
            }

            .search-suggestion {
                background: var(--white);
                border: 1px solid rgba(31, 191, 131, 0.2);
                color: var(--mountain-meadow);
                transition: all 0.2s ease;
            }

            .search-suggestion:hover {
                background: var(--mountain-meadow);
                color: var(--white);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(31, 191, 131, 0.3);
            }

            .search-empty-state {
                background: linear-gradient(135deg, var(--background-light), var(--white));
                color: var(--prussian-blue);
            }

            .search-loading {
                background: var(--white);
                color: var(--zomp);
            }

            .search-error {
                background: var(--white);
                border-color: #ef4444;
                color: #dc2626;
            }

            .search-highlight {
                background: linear-gradient(135deg, var(--mountain-meadow), var(--zomp));
                color: var(--white);
                padding: 2px 4px;
                border-radius: 4px;
                font-weight: 500;
            }

            .search-input-focused {
                border-color: var(--mountain-meadow) !important;
                box-shadow: 0 0 0 3px rgba(31, 191, 131, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    onFocus() {
        this.input.classList.add('search-input-focused');
        
        // Mostra sugestões se o campo estiver vazio
        if (!this.input.value.trim()) {
            this.showSuggestions();
        }
    }

    onBlur() {
        this.input.classList.remove('search-input-focused');
        
        // Remove dropdown com delay para permitir cliques
        setTimeout(() => {
            if (!this.dropdown?.matches(':hover')) {
                this.removeDropdown();
            }
        }, 150);
    }

    onKeyDown(e) {
        if (!this.dropdown) return;
        
        const options = this.dropdown.querySelectorAll('.search-option, .search-suggestion');
        const currentActive = this.dropdown.querySelector('.active');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateOptions(options, currentActive, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateOptions(options, currentActive, -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    currentActive.click();
                }
                break;
            case 'Escape':
                this.removeDropdown();
                this.input.blur();
                break;
            case 'Tab':
                // Autocomplete com Tab
                if (currentActive && currentActive.classList.contains('search-suggestion')) {
                    e.preventDefault();
                    this.applySuggestion(currentActive.textContent);
                }
                break;
        }
    }

    navigateOptions(options, currentActive, direction) {
        let currentIndex = -1;
        
        if (currentActive) {
            currentActive.classList.remove('active');
            currentIndex = Array.from(options).indexOf(currentActive);
        }
        
        const nextIndex = currentIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < options.length) {
            options[nextIndex].classList.add('active');
            options[nextIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    async onInput(e) {
        const query = e.target.value.trim();
        
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        
        if (!query) {
            this.showSuggestions();
            return;
        }
        
        this.debounceTimeout = setTimeout(async () => {
            await this.performSearch(query);
        }, 200);
    }

    showSuggestions() {
        const allSuggestions = [
            ...this.suggestions.pacientes,
            ...this.suggestions.profissionais,
            ...this.suggestions.anamneses
        ];

        this.removeDropdown();
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'search-dropdown absolute left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto';
        this.dropdown.style.top = this.input.offsetHeight + 'px';
        
        // Header de sugestões
        const header = document.createElement('div');
        header.className = 'px-4 py-3 search-category-header';
        header.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="font-medium">Sugestões de busca</span>
                <span class="text-xs opacity-60">Pressione Tab para aplicar</span>
            </div>
        `;
        this.dropdown.appendChild(header);

        // Sugestões organizadas por categoria
        Object.entries(this.suggestions).forEach(([category, suggestions]) => {
            const categoryConfig = this.categories[category];
            
            suggestions.slice(0, 3).forEach(suggestion => {
                const suggestionEl = document.createElement('div');
                suggestionEl.className = 'search-suggestion px-4 py-2 mx-2 my-1 rounded-lg cursor-pointer text-sm font-medium';
                suggestionEl.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <span>${categoryConfig.icon}</span>
                        <span>${suggestion}</span>
                    </div>
                `;
                
                suggestionEl.addEventListener('click', () => {
                    this.applySuggestion(suggestion);
                });
                
                this.dropdown.appendChild(suggestionEl);
            });
        });

        this.input.parentNode.appendChild(this.dropdown);
    }

    applySuggestion(suggestion) {
        this.input.value = suggestion;
        this.input.focus();
        this.removeDropdown();
        
        // Trigger search after applying suggestion
        setTimeout(() => {
            this.performSearch(suggestion);
        }, 100);
    }

    async performSearch(query) {
        try {
            console.log('🔍 Busca inteligente para:', query);
            
            const cacheKey = query.toLowerCase();
            const cached = this.getCachedResult(cacheKey);
            
            if (cached) {
                console.log('📋 Cache hit');
                this.showDropdown(cached, query);
                return;
            }
            
            this.showLoadingDropdown();
            
            const results = await this.fetchAllResults(query);
            const filteredResults = this.filterResults(results, query);
            
            this.setCachedResult(cacheKey, filteredResults);
            this.showDropdown(filteredResults, query);
            
        } catch (error) {
            console.error('❌ Erro na busca:', error);
            this.showErrorDropdown('Erro ao buscar dados. Tente novamente.');
        }
    }

    async fetchAllResults(query) {
        const [pacientes, profissionais, anamneses] = await Promise.all([
            this.safeApiCall(() => pegarPacientes(), 'pacientes'),
            this.safeApiCall(() => pegarProfissionais(), 'profissionais'),
            this.safeApiCall(() => pegarAnamneses(), 'anamneses')
        ]);

        return {
            pacientes: pacientes || [],
            profissionais: profissionais || [],
            anamneses: anamneses || []
        };
    }

    async safeApiCall(apiFunction, type) {
        try {
            const result = await apiFunction();
            console.log(`✅ ${type}:`, result?.length || 0);
            return result;
        } catch (error) {
            console.error(`❌ Erro ${type}:`, error);
            return [];
        }
    }

    filterResults(allResults, query) {
        const queryLower = query.toLowerCase();
        const filtered = {};
        
        // Busca inteligente por categoria
        const categoryMatch = this.detectCategory(query);
        
        Object.entries(allResults).forEach(([category, items]) => {
            // Se detectou categoria específica, prioriza ela
            const priority = categoryMatch === category ? 10 : 3;
            
            filtered[category] = items.filter(item => {
                return this.matchesQuery(item, queryLower, this.getSearchFields(category));
            }).slice(0, priority);
        });
        
        return filtered;
    }

    detectCategory(query) {
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('paciente') || queryLower.includes('cpf')) {
            return 'pacientes';
        } else if (queryLower.includes('profissional') || queryLower.includes('crp') || queryLower.includes('especialidade')) {
            return 'profissionais';
        } else if (queryLower.includes('anamnese') || queryLower.includes('título')) {
            return 'anamneses';
        }
        
        return null;
    }

    getSearchFields(category) {
        const fields = {
            pacientes: ['nome', 'cpf', 'email', 'telefone', 'endereco'],
            profissionais: ['nome', 'email', 'especialidade', 'crp', 'telefone'],
            anamneses: ['titulo', 'descricao', 'pacienteNome', 'observacoes']
        };
        
        return fields[category] || [];
    }

    matchesQuery(item, query, fields) {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(query);
        });
    }

    showDropdown(results, query) {
        this.removeDropdown();
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'search-dropdown absolute left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto';
        this.dropdown.style.top = this.input.offsetHeight + 'px';
        
        let hasResults = false;
        
        Object.entries(this.categories).forEach(([key, config]) => {
            const items = results[key];
            if (items && items.length > 0) {
                hasResults = true;
                this.addCategorySection(config, items, query);
            }
        });
        
        if (!hasResults) {
            this.addEmptyState();
        }
        
        this.input.parentNode.appendChild(this.dropdown);
    }

    addCategorySection(config, items, query) {
        // Header da categoria
        const header = document.createElement('div');
        header.className = 'search-category-header px-4 py-3 text-sm font-semibold';
        header.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="text-lg">${config.icon}</span>
                    <span>${config.label}</span>
                </div>
                <span class="text-xs opacity-60">${items.length} resultado${items.length > 1 ? 's' : ''}</span>
            </div>
        `;
        this.dropdown.appendChild(header);
        
        // Itens
        items.forEach(item => {
            const option = document.createElement('div');
            option.className = 'search-option px-4 py-3 cursor-pointer';
            option.innerHTML = this.createOptionHTML(item, config, query);
            option.addEventListener('click', () => this.onSelect(item, config));
            this.dropdown.appendChild(option);
        });
    }

    createOptionHTML(item, config, query) {
        const { text, subtitle } = this.formatItem(item, config);
        const highlightedText = this.highlightQuery(text, query);
        const highlightedSubtitle = subtitle ? this.highlightQuery(subtitle, query) : null;
        
        return `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                     style="background: ${config.bgColor}; border: 2px solid ${config.borderColor};">
                    <span class="text-sm">${config.icon}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900">${highlightedText}</div>
                    ${highlightedSubtitle ? `<div class="text-xs text-gray-500">${highlightedSubtitle}</div>` : ''}
                </div>
                <div class="flex-shrink-0">
                    <span class="text-xs font-medium px-2 py-1 rounded-full" 
                          style="background: ${config.bgColor}; color: ${config.color};">
                        ${config.label.slice(0, -1)}
                    </span>
                </div>
            </div>
        `;
    }

    highlightQuery(text, query) {
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    formatItem(item, config) {
        const key = Object.keys(this.categories).find(k => this.categories[k] === config);
        
        switch (key) {
            case 'pacientes':
                return {
                    text: item.nome || 'Nome não informado',
                    subtitle: [item.cpf, item.email, item.telefone].filter(Boolean).join(' • ')
                };
            case 'profissionais':
                return {
                    text: item.nome || 'Nome não informado',
                    subtitle: [item.especialidade, item.crp, item.email].filter(Boolean).join(' • ')
                };
            case 'anamneses':
                return {
                    text: item.titulo || 'Título não informado',
                    subtitle: [item.pacienteNome, item.data].filter(Boolean).join(' • ')
                };
            default:
                return { text: 'Item desconhecido', subtitle: null };
        }
    }

    addEmptyState() {
        const empty = document.createElement('div');
        empty.className = 'search-empty-state px-6 py-8 text-center';
        empty.innerHTML = `
            <div class="flex flex-col items-center space-y-3">
                <svg class="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <div>
                    <h3 class="font-medium text-gray-900">Nenhum resultado encontrado</h3>
                    <p class="text-sm text-gray-500 mt-1">Tente usar termos mais específicos ou diferentes</p>
                </div>
            </div>
        `;
        this.dropdown.appendChild(empty);
    }

    showLoadingDropdown() {
        this.removeDropdown();
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'search-dropdown absolute left-0 right-0 mt-1 z-50';
        this.dropdown.style.top = this.input.offsetHeight + 'px';
        
        const loading = document.createElement('div');
        loading.className = 'search-loading px-4 py-6 text-center';
        loading.innerHTML = `
            <div class="flex items-center justify-center space-x-3">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                <span class="font-medium">Buscando dados...</span>
            </div>
        `;
        
        this.dropdown.appendChild(loading);
        this.input.parentNode.appendChild(this.dropdown);
    }

    showErrorDropdown(message) {
        this.removeDropdown();
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'search-dropdown absolute left-0 right-0 mt-1 z-50';
        this.dropdown.style.top = this.input.offsetHeight + 'px';
        
        const error = document.createElement('div');
        error.className = 'search-error px-4 py-4 text-sm flex items-center space-x-3';
        error.innerHTML = `
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">${message}</span>
        `;
        
        this.dropdown.appendChild(error);
        this.input.parentNode.appendChild(this.dropdown);
    }

    onSelect(item, config) {
        console.log('🎯 Selecionado:', config.label, item);
        
        this.removeDropdown();
        this.input.value = '';
        
        // Animação de feedback
        this.input.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.input.style.transform = 'scale(1)';
        }, 100);
        
        this.redirectTo(item, config);
    }

    redirectTo(item, config) {
        if (!item.id) {
            console.error('❌ Item sem ID:', item);
            return;
        }
        
        const categoryKey = Object.keys(this.categories).find(k => this.categories[k] === config);
        const routes = {
            pacientes: `/view/html/paciente/paciente.html?id=${item.id}`,
            profissionais: `/view/html/cadastro/cadastro.html?id=${item.id}`,
            anamneses: `/view/html/anamnese/anamnese.html?id=${item.id}`
        };
        
        const route = routes[categoryKey];
        if (route) {
            console.log('🔀 Navegando para:', route);
            window.location.href = route;
        }
    }

    getCachedResult(key) {
        const cached = this.searchCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
            return cached.data;
        }
        return null;
    }

    setCachedResult(key, data) {
        this.searchCache.set(key, { data, timestamp: Date.now() });
        this.cleanupCache();
    }

    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.searchCache.entries()) {
            if (now - value.timestamp > this.cacheExpiration) {
                this.searchCache.delete(key);
            }
        }
    }

    removeDropdown() {
        if (this.dropdown?.parentNode) {
            this.dropdown.parentNode.removeChild(this.dropdown);
            this.dropdown = null;
        }
    }

    handleClickOutside(e) {
        if (this.dropdown && 
            !this.input.contains(e.target) && 
            !this.dropdown.contains(e.target)) {
            this.removeDropdown();
        }
    }

    destroy() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.removeDropdown();
        this.searchCache.clear();
        console.log('🗑️ SearchManager destruído');
    }
}

// Auto-inicialização
window.addEventListener('DOMContentLoaded', () => {
    try {
        const searchManager = new SearchManager('#search-bar input');
        window.searchManager = searchManager;
        console.log('🚀 Enhanced SearchManager inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar SearchManager:', error);
    }
});

export default SearchManager;