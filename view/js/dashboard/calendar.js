/**
 * Sistema de Calendário Psyclin - Versão Tailwind
 * Cache por 1 semana - reseta se limpar cookies
 */

class PsyclinCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.editingEventId = null;
        this.cacheKey = 'psyclin_calendar_events';
        this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 1 semana
        
        this.months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        this.daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        this.init();
    }
    
    init() {
        this.loadEventsFromCache();
        this.render();
        this.createEventModal();
        this.bindEvents();
        console.log('📅 Calendário Psyclin inicializado!');
    }
    
    // === CACHE MANAGEMENT ===
    saveEventsToCache() {
        const cacheData = {
            events: this.events,
            timestamp: Date.now()
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        console.log(`💾 Cache salvo: ${this.events.length} eventos`);
    }
    
    loadEventsFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const cacheData = JSON.parse(cached);
                const now = Date.now();
                
                if (now - cacheData.timestamp < this.cacheExpiry) {
                    this.events = cacheData.events || [];
                    console.log(`📂 Cache carregado: ${this.events.length} eventos`);
                } else {
                    console.log('🗑️ Cache expirado, limpando...');
                    this.clearCache();
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar cache:', error);
            this.clearCache();
        }
    }
    
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        this.events = [];
    }
    
    // === RENDER CALENDAR ===
    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.container.innerHTML = `
            <!-- Header do Calendário -->
            <div class="bg-gradient-to-r from-[var(--zomp)] to-[var(--mountain-meadow)] text-white p-6 rounded-t-lg">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="flex items-center gap-4">
                        <button id="prevMonth" class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 btn-hover">
                            <i data-feather="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <h2 class="text-2xl font-bold">${this.months[month]} ${year}</h2>
                        <button id="nextMonth" class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 btn-hover">
                            <i data-feather="chevron-right" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="todayBtn" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-all duration-300 btn-hover">
                            Hoje
                        </button>
                        <button id="addEventBtn" class="bg-white text-[var(--zomp)] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 btn-hover">
                            <i data-feather="plus" class="w-4 h-4"></i>
                            Novo Evento
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Grid do Calendário -->
            <div class="bg-white rounded-b-lg shadow-lg overflow-hidden">
                <!-- Cabeçalho dos dias -->
                <div class="grid grid-cols-7 bg-gray-50 border-b">
                    ${this.daysOfWeek.map(day => `
                        <div class="p-3 text-center font-semibold text-gray-700 text-sm border-r last:border-r-0">
                            ${day}
                        </div>
                    `).join('')}
                </div>
                
                <!-- Dias do calendário -->
                <div id="calendarGrid" class="grid grid-cols-7">
                    ${this.generateCalendarDays(year, month)}
                </div>
            </div>
        `;
        
        // Renderizar ícones
        if (window.feather) {
            feather.replace();
        }
    }
    
    generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        let daysHTML = '';
        const today = new Date();
        
        // Dias do mês anterior
        const prevMonth = new Date(year, month - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            daysHTML += this.generateDayHTML(year, month - 1, day, true);
        }
        
        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getFullYear() === year && 
                           today.getMonth() === month && 
                           today.getDate() === day;
            daysHTML += this.generateDayHTML(year, month, day, false, isToday);
        }
        
        // Completar grade (próximo mês)
        const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
        const remainingDays = totalCells - (startingDayOfWeek + daysInMonth);
        
        for (let day = 1; day <= remainingDays; day++) {
            daysHTML += this.generateDayHTML(year, month + 1, day, true);
        }
        
        return daysHTML;
    }
    
    generateDayHTML(year, month, day, isOtherMonth = false, isToday = false) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = this.events.filter(event => event.date === dateKey);
        
        let dayClasses = 'calendar-day-hover min-h-[80px] sm:min-h-[100px] p-2 border-b border-r last:border-r-0 cursor-pointer transition-all duration-300 flex flex-col';
        
        if (isOtherMonth) {
            dayClasses += ' bg-gray-50 text-gray-400';
        } else {
            dayClasses += ' bg-white hover:bg-blue-50';
        }
        
        if (isToday) {
            dayClasses += ' bg-gradient-to-br from-[var(--mountain-meadow)] to-[var(--zomp)] text-white font-bold';
        }
        
        if (dayEvents.length > 0 && !isOtherMonth) {
            dayClasses += ' border-l-4 border-[var(--mountain-meadow)]';
        }
        
        const eventsHTML = dayEvents.slice(0, 2).map(event => `
            <div class="calendar-event-item text-xs px-2 py-1 mb-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate priority-${event.priority}" 
                 data-event-id="${event.id}" 
                 title="${event.title} - ${event.time}">
                ${event.title}
            </div>
        `).join('');
        
        const moreEventsHTML = dayEvents.length > 2 ? `
            <div class="text-xs text-gray-600 font-semibold">
                +${dayEvents.length - 2} mais
            </div>
        ` : '';
        
        return `
            <div class="${dayClasses}" data-date="${dateKey}">
                <div class="font-semibold text-sm mb-1">${day}</div>
                <div class="flex-1 overflow-hidden">
                    ${eventsHTML}
                    ${moreEventsHTML}
                </div>
            </div>
        `;
    }
    
    // === EVENT MODAL ===
    createEventModal() {
        const modalHTML = `
            <div id="eventModal" class="fixed inset-0 z-50 hidden">
                <!-- Overlay -->
                <div class="modal-overlay fixed inset-0 bg-black/50"></div>
                
                <!-- Modal Content -->
                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <div class="modal-content bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <!-- Header -->
                        <div class="flex justify-between items-center p-6 border-b">
                            <h3 id="modalTitle" class="text-xl font-bold text-gray-800">Novo Evento</h3>
                            <button id="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <i data-feather="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        
                        <!-- Body -->
                        <form id="eventForm" class="p-6 space-y-4">
                            <!-- Título -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Título do Evento</label>
                                <input type="text" id="eventTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mountain-meadow)] focus:border-transparent" 
                                       placeholder="Ex: Consulta com João" required>
                            </div>
                            
                            <!-- Data e Hora -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Data</label>
                                    <input type="date" id="eventDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mountain-meadow)] focus:border-transparent" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Horário</label>
                                    <input type="time" id="eventTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mountain-meadow)] focus:border-transparent" required>
                                </div>
                            </div>
                            
                            <!-- Tipo -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Evento</label>
                                <select id="eventType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mountain-meadow)] focus:border-transparent" required>
                                    <option value="">Selecione o tipo</option>
                                    <option value="consulta">Consulta</option>
                                    <option value="avaliacao">Avaliação</option>
                                    <option value="reuniao">Reunião</option>
                                    <option value="administrativo">Administrativo</option>
                                    <option value="pessoal">Pessoal</option>
                                </select>
                            </div>
                            
                            <!-- Prioridade -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Prioridade</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <button type="button" class="priority-btn px-3 py-2 border-2 border-[var(--mountain-meadow)] text-[var(--mountain-meadow)] rounded-lg font-semibold hover:bg-[var(--mountain-meadow)] hover:text-white transition-colors" data-priority="low">
                                        Baixa
                                    </button>
                                    <button type="button" class="priority-btn px-3 py-2 border-2 border-yellow-500 text-yellow-500 rounded-lg font-semibold hover:bg-yellow-500 hover:text-white transition-colors" data-priority="medium">
                                        Média
                                    </button>
                                    <button type="button" class="priority-btn px-3 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors" data-priority="high">
                                        Alta
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Descrição -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Descrição (Opcional)</label>
                                <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mountain-meadow)] focus:border-transparent" 
                                          placeholder="Detalhes do evento..."></textarea>
                            </div>
                        </form>
                        
                        <!-- Footer -->
                        <div class="flex flex-col sm:flex-row justify-between gap-3 p-6 border-t">
                            <button id="deleteEventBtn" class="hidden bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors btn-hover">
                                <i data-feather="trash-2" class="w-4 h-4 inline mr-2"></i>
                                Excluir
                            </button>
                            <div class="flex gap-3 ml-auto">
                                <button type="button" id="cancelEventBtn" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" id="saveEventBtn" form="eventForm" class="bg-[var(--mountain-meadow)] hover:bg-[var(--zomp)] text-white px-4 py-2 rounded-lg font-semibold transition-colors btn-hover">
                                    <i data-feather="save" class="w-4 h-4 inline mr-2"></i>
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (window.feather) {
            feather.replace();
        }
    }
    
    // === EVENT HANDLERS ===
    bindEvents() {
        // Navegação
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
            this.bindEvents();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
            this.bindEvents();
        });
        
        document.getElementById('todayBtn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.render();
            this.bindEvents();
        });
        
        // Adicionar evento
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.openEventModal();
        });
        
        // Clique nos dias
        document.querySelectorAll('[data-date]').forEach(day => {
            day.addEventListener('click', (e) => {
                if (!e.target.closest('.calendar-event-item')) {
                    const date = day.dataset.date;
                    this.openEventModal(null, date);
                }
            });
        });
        
        // Clique nos eventos
        document.querySelectorAll('.calendar-event-item').forEach(event => {
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = event.dataset.eventId;
                if (eventId) {
                    this.openEventModal(eventId);
                }
            });
        });
        
        this.bindModalEvents();
    }
    
    bindModalEvents() {
        const modal = document.getElementById('eventModal');
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelEventBtn');
        const deleteBtn = document.getElementById('deleteEventBtn');
        const form = document.getElementById('eventForm');
        
        // Fechar modal
        [overlay, closeBtn, cancelBtn].forEach(element => {
            element.addEventListener('click', () => this.closeEventModal());
        });
        
        // Seleção de prioridade
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.priority-btn').forEach(b => {
                    b.classList.remove('bg-[var(--mountain-meadow)]', 'bg-yellow-500', 'bg-red-500', 'text-white');
                    b.classList.add('text-[var(--mountain-meadow)]', 'text-yellow-500', 'text-red-500');
                });
                
                const priority = btn.dataset.priority;
                if (priority === 'low') {
                    btn.classList.add('bg-[var(--mountain-meadow)]', 'text-white');
                    btn.classList.remove('text-[var(--mountain-meadow)]');
                } else if (priority === 'medium') {
                    btn.classList.add('bg-yellow-500', 'text-white');
                    btn.classList.remove('text-yellow-500');
                } else if (priority === 'high') {
                    btn.classList.add('bg-red-500', 'text-white');
                    btn.classList.remove('text-red-500');
                }
            });
        });
        
        // Salvar evento
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
        
        // Deletar evento
        deleteBtn.addEventListener('click', () => {
            this.deleteEvent();
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeEventModal();
            }
        });
    }
    
    // === MODAL MANAGEMENT ===
    openEventModal(eventId = null, selectedDate = null) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteEventBtn');
        
        // Reset form
        document.getElementById('eventForm').reset();
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('bg-[var(--mountain-meadow)]', 'bg-yellow-500', 'bg-red-500', 'text-white');
        });
        
        // Selecionar prioridade média por padrão
        const mediumBtn = document.querySelector('[data-priority="medium"]');
        mediumBtn.classList.add('bg-yellow-500', 'text-white');
        mediumBtn.classList.remove('text-yellow-500');
        
        if (eventId) {
            // Editar evento
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                modalTitle.textContent = 'Editar Evento';
                deleteBtn.classList.remove('hidden');
                
                document.getElementById('eventTitle').value = event.title;
                document.getElementById('eventDate').value = event.date;
                document.getElementById('eventTime').value = event.time;
                document.getElementById('eventType').value = event.type;
                document.getElementById('eventDescription').value = event.description || '';
                
                // Reset e definir prioridade
                document.querySelectorAll('.priority-btn').forEach(btn => {
                    btn.classList.remove('bg-[var(--mountain-meadow)]', 'bg-yellow-500', 'bg-red-500', 'text-white');
                });
                
                const priorityBtn = document.querySelector(`[data-priority="${event.priority}"]`);
                if (priorityBtn) {
                    if (event.priority === 'low') {
                        priorityBtn.classList.add('bg-[var(--mountain-meadow)]', 'text-white');
                        priorityBtn.classList.remove('text-[var(--mountain-meadow)]');
                    } else if (event.priority === 'medium') {
                        priorityBtn.classList.add('bg-yellow-500', 'text-white');
                        priorityBtn.classList.remove('text-yellow-500');
                    } else if (event.priority === 'high') {
                        priorityBtn.classList.add('bg-red-500', 'text-white');
                        priorityBtn.classList.remove('text-red-500');
                    }
                }
                
                this.editingEventId = eventId;
            }
        } else {
            // Novo evento
            modalTitle.textContent = 'Novo Evento';
            deleteBtn.classList.add('hidden');
            this.editingEventId = null;
            
            if (selectedDate) {
                document.getElementById('eventDate').value = selectedDate;
            }
        }
        
        modal.classList.remove('hidden');
        document.getElementById('eventTitle').focus();
    }
    
    closeEventModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.add('hidden');
        this.editingEventId = null;
    }
    
    // === EVENT CRUD ===
    saveEvent() {
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const type = document.getElementById('eventType').value;
        const description = document.getElementById('eventDescription').value;
        
        // Obter prioridade selecionada
        const selectedPriority = document.querySelector('.priority-btn.bg-red-500, .priority-btn.bg-yellow-500, .priority-btn.bg-\\[var\\(--mountain-meadow\\)\\]');
        const priority = selectedPriority ? selectedPriority.dataset.priority : 'medium';
        
        const eventData = {
            id: this.editingEventId || Date.now().toString(),
            title,
            date,
            time,
            type,
            description,
            priority,
            createdAt: new Date().toISOString()
        };
        
        if (this.editingEventId) {
            // Atualizar evento existente
            const index = this.events.findIndex(e => e.id === this.editingEventId);
            if (index !== -1) {
                this.events[index] = { ...this.events[index], ...eventData };
                console.log('✏️ Evento atualizado:', eventData.title);
            }
        } else {
            // Adicionar novo evento
            this.events.push(eventData);
            console.log('➕ Novo evento criado:', eventData.title);
        }
        
        this.saveEventsToCache();
        this.closeEventModal();
        this.render();
        this.bindEvents();
        
        // Feedback visual
        this.showToast(`Evento "${title}" ${this.editingEventId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
    }
    
    deleteEvent() {
        if (this.editingEventId) {
            const event = this.events.find(e => e.id === this.editingEventId);
            if (event && confirm(`Tem certeza que deseja excluir o evento "${event.title}"?`)) {
                this.events = this.events.filter(e => e.id !== this.editingEventId);
                this.saveEventsToCache();
                this.closeEventModal();
                this.render();
                this.bindEvents();
                
                this.showToast(`Evento "${event.title}" excluído com sucesso!`, 'success');
                console.log('🗑️ Evento excluído:', event.title);
            }
        }
    }
    
    // === UTILS ===
    showToast(message, type = 'info') {
        const existingToast = document.getElementById('calendar-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        const toast = document.createElement('div');
        toast.id = 'calendar-toast';
        toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // === PUBLIC METHODS ===
    getEvents() {
        return this.events;
    }
    
    addEvent(eventData) {
        const event = {
            id: Date.now().toString(),
            ...eventData,
            createdAt: new Date().toISOString()
        };
        this.events.push(event);
        this.saveEventsToCache();
        this.render();
        this.bindEvents();
        return event;
    }
    
    clearAllEvents() {
        if (confirm('Tem certeza que deseja excluir TODOS os eventos?')) {
            this.events = [];
            this.saveEventsToCache();
            this.render();
            this.bindEvents();
            this.showToast('Todos os eventos foram excluídos!', 'success');
        }
    }
}

// Função para inicializar o calendário
function initPsyclinCalendar() {
    if (document.getElementById('psyclin-calendar')) {
        const calendar = new PsyclinCalendar('psyclin-calendar');
        
        // Disponibilizar globalmente para debug
        window.psyclinCalendar = calendar;
        
        return calendar;
    }
}

// Auto-init quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initPsyclinCalendar, 100);
});

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PsyclinCalendar;
}
