/**
 * Chat Widget - Assistente Virtual Educacional para Psicologia
 * Sistema de chat flutuante com integração à API OpenAI
 */

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.serverUrl = this.detectServerUrl();
        this.init();
    }

    detectServerUrl() {
        // Detectar se estamos em desenvolvimento (Live Server) ou produção
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        
        // Se estamos no Live Server (porta 5500), apontar para o Spring Boot (8080)
        if (currentPort === '5500' || currentHost === '127.0.0.1') {
            return 'http://localhost:8080';
        }
        
        // Se já estamos na porta do Spring Boot, usar origem atual
        if (currentPort === '8080') {
            return window.location.origin;
        }
        
        // Fallback padrão
        return 'http://localhost:8080';
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.addWelcomeMessage();
        this.checkServerStatus();
    }

    async checkServerStatus() {
        try {
            console.log(`🔍 Verificando servidor em: ${this.serverUrl}`);
            const response = await fetch(`${this.serverUrl}/chat/health`, {
                method: 'GET',
                timeout: 5000
            });
            if (response.ok) {
                console.log('✅ Chat service está ativo');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Chat service pode estar offline:', error.message);
            return false;
        }
        return false;
    }

    createWidget() {
        const widgetHTML = `
            <div class="chat-widget">
                <button class="chat-toggle" id="chatToggle" aria-label="Abrir chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
                
                <div class="chat-container" id="chatContainer">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                            </svg>
                        </div>
                        <div class="chat-info">
                            <h3>Assistente Psyclin</h3>
                            <p>Ajuda educacional em psicologia</p>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="welcome-message">
                            <h4>👋 Olá!</h4>
                            <p>Sou seu assistente educacional especializado em psicologia. Posso ajudar com conceitos, teorias e orientações acadêmicas.</p>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <textarea 
                                class="chat-input" 
                                id="chatInput" 
                                placeholder="Digite sua pergunta sobre psicologia..."
                                rows="1"
                                maxlength="500"></textarea>
                            <button class="chat-send" id="chatSend" aria-label="Enviar mensagem">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatToggle');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSend');

        toggle.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        input.addEventListener('input', () => this.autoResizeInput());

        // Fechar chat clicando fora
        document.addEventListener('click', (e) => {
            const widget = document.querySelector('.chat-widget');
            if (this.isOpen && !widget.contains(e.target)) {
                this.toggleChat();
            }
        });
    }

    toggleChat() {
        const container = document.getElementById('chatContainer');
        const toggle = document.getElementById('chatToggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('show');
            toggle.classList.add('active');
            // Focar no input após a animação
            setTimeout(() => {
                document.getElementById('chatInput').focus();
            }, 300);
        } else {
            container.classList.remove('show');
            toggle.classList.remove('active');
        }
    }

    autoResizeInput() {
        const input = document.getElementById('chatInput');
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    }

    addWelcomeMessage() {
        // Mensagem de boas-vindas já está no HTML
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Limpar input
        input.value = '';
        input.style.height = 'auto';
        
        // Desabilitar envio
        this.setTyping(true);
        
        try {
            // Enviar para API
            const response = await this.callChatAPI(message);
            
            // Adicionar resposta do bot
            this.addMessage(response.message, 'bot', response.type);
            
        } catch (error) {
            console.error('Erro no chat:', error);
            this.addMessage(
                'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
                'bot',
                'error'
            );
        } finally {
            this.setTyping(false);
        }
    }

    async callChatAPI(message) {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        console.log(`📡 Enviando mensagem para: ${this.serverUrl}/chat/message`);
        
        try {
            const response = await fetch(`${this.serverUrl}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            console.log(`📨 Resposta recebida - Status: ${response.status}`);

            if (!response.ok) {
                // Se POST falhar com 405, tentar GET
                if (response.status === 405) {
                    console.log('🔄 Tentando GET como fallback...');
                    const getResponse = await fetch(`${this.serverUrl}/chat/message?message=${encodeURIComponent(message)}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });
                    
                    if (!getResponse.ok) {
                        throw new Error(`Erro na comunicação GET: ${getResponse.status}`);
                    }
                    
                    return await getResponse.json();
                }
                
                throw new Error(`Erro na comunicação POST: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Erro na API do chat:', error);
            
            // Verificar se é erro de CORS ou conexão
            if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
                return {
                    message: `⚠️ **Servidor Spring Boot não encontrado!**\n\nPara usar o chat AI:\n\n1. Certifique-se de que o servidor Spring Boot está rodando\n2. Execute: \`mvn spring-boot:run\`\n3. Aguarde ver "Started PsyclinApplication"\n4. Verifique se está rodando em: ${this.serverUrl}\n\nEnquanto isso, posso te ajudar com orientações gerais sobre psicologia e uso do sistema.`,
                    type: 'limitation',
                    success: true
                };
            }
            
            // Fallback para outros erros
            return {
                message: 'O serviço de chat está temporariamente indisponível. Como assistente educacional, posso te orientar que você consulte a documentação do sistema ou entre em contato com seu supervisor para dúvidas específicas sobre psicologia.',
                type: 'limitation',
                success: true
            };
        }
    }

    addMessage(text, sender, type = 'answer') {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Remover mensagem de boas-vindas se existir
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) {
            welcome.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'bot' && type !== 'answer') {
            messageDiv.classList.add(type);
        }
        
        // Processar e formatar o texto
        const formattedText = this.formatMessage(text);
        messageDiv.innerHTML = formattedText;
        
        messagesContainer.appendChild(messageDiv);

        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Salvar mensagem
        this.messages.push({ text, sender, type, timestamp: new Date() });
    }

    formatMessage(text) {
        // Converter markdown básico para HTML
        let formatted = text
            // Títulos com **
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Títulos com #
            .replace(/^### (.*$)/gm, '<h4>$1</h4>')
            .replace(/^## (.*$)/gm, '<h3>$1</h3>')
            .replace(/^# (.*$)/gm, '<h2>$1</h2>')
            // Itálico
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Código inline
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Links (básico)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Emojis comuns primeiro
            .replace(/📋/g, '<span class="emoji">📋</span>')
            .replace(/📨/g, '<span class="emoji">📨</span>')
            .replace(/✅/g, '<span class="emoji">✅</span>')
            .replace(/⚠️/g, '<span class="emoji">⚠️</span>')
            .replace(/🎓/g, '<span class="emoji">🎓</span>')
            .replace(/🖥️/g, '<span class="emoji">🖥️</span>')
            .replace(/⚖️/g, '<span class="emoji">⚖️</span>')
            .replace(/👋/g, '<span class="emoji">👋</span>');

        // Processar listas com bullets •
        const lines = formatted.split('\n');
        let inList = false;
        let result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('• ')) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                result.push('<li>' + line.substring(2) + '</li>');
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push('</ul>');
        }
        
        formatted = result.join('\n');
        
        // Quebras de linha para parágrafos
        formatted = formatted.replace(/\n\n+/g, '</p><p>');
        
        // Envolver em parágrafos se necessário
        if (!formatted.includes('<h') && !formatted.includes('<ul>')) {
            formatted = `<p>${formatted}</p>`;
        }

        return formatted;
    }

    setTyping(typing) {
        this.isTyping = typing;
        const sendBtn = document.getElementById('chatSend');
        const messagesContainer = document.getElementById('chatMessages');

        sendBtn.disabled = typing;

        if (typing) {
            // Adicionar indicador de digitação
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span style="margin-left: 8px; font-size: 12px; color: #666;">Digitando...</span>
            `;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            // Remover indicador de digitação
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    }

    // Método público para mostrar chat com mensagem específica
    showWithMessage(message) {
        if (!this.isOpen) {
            this.toggleChat();
        }
        
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            input.value = message;
            input.focus();
            this.autoResizeInput();
        }, 300);
    }

    // Método para limpar conversa
    clearChat() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h4>👋 Olá!</h4>
                <p>Sou seu assistente educacional especializado em psicologia. Posso ajudar com conceitos, teorias e orientações acadêmicas.</p>
            </div>
        `;
        this.messages = [];
    }
}

// Inicializar o chat widget quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já existe um chat widget
    if (!document.querySelector('.chat-widget')) {
        window.chatWidget = new ChatWidget();
    }
});

// Expor globalmente para uso em outras páginas
window.ChatWidget = ChatWidget;
