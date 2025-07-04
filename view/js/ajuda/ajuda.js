// Dados de conteúdo da ajuda
const helpContent = {
    inicio: {
        title: "Primeiros Passos",
        content: `
            <div class="help-section fade-in">
                <h2>Bem-vindo ao Psyclin!</h2>
                
                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="info" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Sistema de Gestão para Psicólogos</h4>
                            <p>O Psyclin é uma plataforma completa para gerenciar sua clínica de psicologia, desde o cadastro de pacientes até a geração de relatórios.</p>
                        </div>
                    </div>
                </div>

                <h3>🚀 Começando a usar o sistema</h3>
                <ol>
                    <li><strong>Cadastre Profissionais:</strong> Comece registrando os psicólogos que irão usar o sistema</li>
                    <li><strong>Configure Especialidades:</strong> Defina as áreas de atuação</li>
                    <li><strong>Cadastre Pacientes:</strong> Registre os dados dos seus pacientes</li>
                    <li><strong>Agende Consultas:</strong> Use a agenda para organizar os atendimentos</li>
                    <li><strong>Realize Anamneses:</strong> Colete informações importantes dos pacientes</li>
                    <li><strong>Gere Prontuários:</strong> Mantenha o histórico organizado</li>
                </ol>

                <h3>📋 Navegação no Sistema</h3>
                <p>Use o menu lateral para navegar entre as diferentes seções:</p>
                <ul>
                    <li><strong>Dashboard:</strong> Visão geral dos atendimentos e estatísticas</li>
                    <li><strong>Pacientes:</strong> Gerenciamento completo de pacientes</li>
                    <li><strong>Agenda:</strong> Agendamento e controle de consultas</li>
                    <li><strong>Anamnese:</strong> Questionários e avaliações</li>
                    <li><strong>Prontuários:</strong> Histórico médico detalhado</li>
                    <li><strong>Relatórios:</strong> Análises e documentos para impressão</li>
                </ul>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('pacientes')">
                        <i data-feather="arrow-right"></i>
                        Próximo: Gerenciar Pacientes
                    </a>
                </div>
            </div>
        `
    },

    pacientes: {
        title: "Gerenciar Pacientes",
        content: `
            <div class="help-section fade-in">
                <h2>Gestão de Pacientes</h2>
                
                <h3>➕ Cadastrando um Novo Paciente</h3>
                <ol>
                    <li>Acesse <strong>Pacientes</strong> no menu lateral</li>
                    <li>Clique no botão <strong>"Novo Paciente"</strong></li>
                    <li>Preencha os dados pessoais obrigatórios</li>
                    <li>Adicione informações de contato</li>
                    <li>Registre o endereço completo</li>
                    <li>Salve o cadastro</li>
                </ol>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="check-circle" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Dica Importante</h4>
                            <p>Sempre mantenha os dados de contato atualizados. Isso facilita o agendamento de consultas e comunicação com os pacientes.</p>
                        </div>
                    </div>
                </div>

                <h3>✏️ Editando Informações</h3>
                <p>Para editar dados de um paciente:</p>
                <ul>
                    <li>Localize o paciente na lista ou use a busca</li>
                    <li>Clique no ícone de edição (lápis)</li>
                    <li>Modifique as informações necessárias</li>
                    <li>Confirme as alterações</li>
                </ul>

                <h3>🔍 Buscando Pacientes</h3>
                <p>Você pode encontrar pacientes das seguintes formas:</p>
                <ul>
                    <li><strong>Por nome:</strong> Digite o nome na barra de busca</li>
                    <li><strong>Por CPF:</strong> Insira o CPF do paciente</li>
                    <li><strong>Por telefone:</strong> Use o número de contato</li>
                    <li><strong>Filtros:</strong> Filtre por status, idade, etc.</li>
                </ul>

                <div class="warning-card">
                    <div class="flex items-start">
                        <i data-feather="alert-triangle" class="warning-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Atenção com Dados Sensíveis</h4>
                            <p>Mantenha sempre a confidencialidade dos dados dos pacientes conforme a LGPD e o código de ética profissional.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 space-x-4">
                    <a href="#" class="action-btn" onclick="loadCategory('agenda')">
                        <i data-feather="calendar"></i>
                        Próximo: Agenda
                    </a>
                    <a href="/view/html/cadastro/cadastrarpaciente.html" class="action-btn secondary">
                        <i data-feather="user-plus"></i>
                        Cadastrar Paciente
                    </a>
                </div>
            </div>
        `
    },

    agenda: {
        title: "Agenda e Consultas",
        content: `
            <div class="help-section fade-in">
                <h2>Gestão da Agenda</h2>
                
                <h3>📅 Agendando uma Consulta</h3>
                <ol>
                    <li>Acesse a <strong>Agenda</strong> no menu lateral</li>
                    <li>Clique em <strong>"Nova Consulta"</strong> ou no horário desejado</li>
                    <li>Selecione o paciente</li>
                    <li>Escolha o profissional responsável</li>
                    <li>Defina data e horário</li>
                    <li>Adicione observações se necessário</li>
                    <li>Confirme o agendamento</li>
                </ol>

                <h3>⏰ Tipos de Visualização</h3>
                <ul>
                    <li><strong>Visão Diária:</strong> Mostra todos os agendamentos do dia</li>
                    <li><strong>Visão Semanal:</strong> Exibe a semana completa</li>
                    <li><strong>Visão Mensal:</strong> Calendário do mês inteiro</li>
                </ul>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="clock" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Gestão de Tempo</h4>
                            <p>Defina a duração padrão das consultas nas configurações. Isso ajuda no planejamento automático da agenda.</p>
                        </div>
                    </div>
                </div>

                <h3>✅ Status dos Agendamentos</h3>
                <ul>
                    <li><strong>Agendado:</strong> Consulta confirmada</li>
                    <li><strong>Em Andamento:</strong> Consulta acontecendo agora</li>
                    <li><strong>Concluído:</strong> Consulta finalizada</li>
                    <li><strong>Cancelado:</strong> Consulta desmarcada</li>
                    <li><strong>Faltou:</strong> Paciente não compareceu</li>
                </ul>

                <h3>🔄 Reagendamento</h3>
                <p>Para reagendar uma consulta:</p>
                <ol>
                    <li>Clique na consulta agendada</li>
                    <li>Selecione <strong>"Reagendar"</strong></li>
                    <li>Escolha nova data e horário</li>
                    <li>Confirme a alteração</li>
                </ol>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('anamnese')">
                        <i data-feather="clipboard"></i>
                        Próximo: Anamnese
                    </a>
                </div>
            </div>
        `
    },

    anamnese: {
        title: "Anamnese",
        content: `
            <div class="help-section fade-in">
                <h2>Sistema de Anamnese</h2>
                
                <h3>📝 O que é a Anamnese?</h3>
                <p>A anamnese é uma entrevista estruturada que coleta informações importantes sobre o histórico do paciente, seus sintomas, comportamentos e contexto de vida.</p>

                <h3>🎯 Criando uma Nova Anamnese</h3>
                <ol>
                    <li>Acesse <strong>Anamnese</strong> no menu</li>
                    <li>Clique em <strong>"Nova Anamnese"</strong></li>
                    <li>Selecione o paciente</li>
                    <li>Escolha o modelo de questionário</li>
                    <li>Preencha as perguntas durante a consulta</li>
                    <li>Salve as respostas</li>
                </ol>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="edit-3" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Personalização de Questionários</h4>
                            <p>Você pode criar modelos de anamnese específicos para diferentes tipos de atendimento (adulto, infantil, casal, etc.).</p>
                        </div>
                    </div>
                </div>

                <h3>📊 Tipos de Perguntas</h3>
                <ul>
                    <li><strong>Texto Livre:</strong> Respostas abertas e descritivas</li>
                    <li><strong>Múltipla Escolha:</strong> Seleção entre opções pré-definidas</li>
                    <li><strong>Escala:</strong> Avaliação numérica (ex: 1 a 10)</li>
                    <li><strong>Sim/Não:</strong> Perguntas objetivas</li>
                    <li><strong>Data:</strong> Informações temporais</li>
                </ul>

                <h3>💾 Gerenciamento de Respostas</h3>
                <p>As respostas da anamnese são:</p>
                <ul>
                    <li>Automaticamente salvas no sistema</li>
                    <li>Vinculadas ao prontuário do paciente</li>
                    <li>Disponíveis para consultas futuras</li>
                    <li>Utilizadas para gerar relatórios</li>
                </ul>

                <h3>🔄 Atualizando Anamneses</h3>
                <p>Recomenda-se atualizar a anamnese:</p>
                <ul>
                    <li>A cada 6 meses de tratamento</li>
                    <li>Quando houver mudanças significativas</li>
                    <li>Antes de iniciar nova abordagem terapêutica</li>
                    <li>Para acompanhar evolução do quadro</li>
                </ul>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('prontuario')">
                        <i data-feather="file-text"></i>
                        Próximo: Prontuários
                    </a>
                </div>
            </div>
        `
    },

    prontuario: {
        title: "Prontuários",
        content: `
            <div class="help-section fade-in">
                <h2>Gestão de Prontuários</h2>
                
                <h3>📁 O que é o Prontuário?</h3>
                <p>O prontuário é o registro completo de todo o histórico clínico do paciente, incluindo anamneses, evolução do tratamento, diagnósticos e intervenções realizadas.</p>

                <h3>📝 Criando Entradas no Prontuário</h3>
                <ol>
                    <li>Acesse o perfil do paciente</li>
                    <li>Clique em <strong>"Prontuário"</strong></li>
                    <li>Selecione <strong>"Nova Entrada"</strong></li>
                    <li>Escolha o tipo de registro</li>
                    <li>Preencha as informações da sessão</li>
                    <li>Salve o registro</li>
                </ol>

                <h3>📋 Tipos de Registros</h3>
                <ul>
                    <li><strong>Evolução:</strong> Progresso da terapia</li>
                    <li><strong>Diagnóstico:</strong> Avaliações clínicas</li>
                    <li><strong>Plano Terapêutico:</strong> Estratégias de tratamento</li>
                    <li><strong>Intercorrências:</strong> Eventos importantes</li>
                    <li><strong>Observações:</strong> Notas gerais</li>
                </ul>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="shield" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Confidencialidade</h4>
                            <p>Todos os registros do prontuário são protegidos por criptografia e só podem ser acessados por profissionais autorizados.</p>
                        </div>
                    </div>
                </div>

                <h3>🔍 Consultando Histórico</h3>
                <p>Para visualizar o histórico do paciente:</p>
                <ul>
                    <li>Acesse o prontuário do paciente</li>
                    <li>Use filtros por data ou tipo de registro</li>
                    <li>Clique em qualquer entrada para ver detalhes</li>
                    <li>Exporte relatórios quando necessário</li>
                </ul>

                <h3>📤 Exportação e Relatórios</h3>
                <p>O sistema permite:</p>
                <ul>
                    <li>Exportar prontuário completo em PDF</li>
                    <li>Gerar relatórios por período</li>
                    <li>Criar sumários executivos</li>
                    <li>Imprimir sessões específicas</li>
                </ul>

                <div class="warning-card">
                    <div class="flex items-start">
                        <i data-feather="lock" class="warning-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Backup e Segurança</h4>
                            <p>Os prontuários são automaticamente salvos e protegidos. Nunca compartilhe informações sem autorização do paciente.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('relatorios')">
                        <i data-feather="bar-chart-2"></i>
                        Próximo: Relatórios
                    </a>
                </div>
            </div>
        `
    },

    relatorios: {
        title: "Relatórios",
        content: `
            <div class="help-section fade-in">
                <h2>Sistema de Relatórios</h2>
                
                <h3>📊 Tipos de Relatórios Disponíveis</h3>
                <ul>
                    <li><strong>Relatório de Atendimentos:</strong> Estatísticas de consultas</li>
                    <li><strong>Relatório Financeiro:</strong> Controle de recebimentos</li>
                    <li><strong>Relatório de Pacientes:</strong> Demografia e análises</li>
                    <li><strong>Relatório de Profissionais:</strong> Produtividade da equipe</li>
                    <li><strong>Relatório Personalizado:</strong> Dados específicos</li>
                </ul>

                <h3>🎯 Gerando um Relatório</h3>
                <ol>
                    <li>Acesse <strong>Relatórios</strong> no menu</li>
                    <li>Escolha o tipo de relatório</li>
                    <li>Defina o período de análise</li>
                    <li>Configure filtros específicos</li>
                    <li>Clique em <strong>"Gerar Relatório"</strong></li>
                    <li>Visualize ou exporte o resultado</li>
                </ol>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="download" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Formatos de Exportação</h4>
                            <p>Os relatórios podem ser exportados em PDF, Excel ou impressos diretamente do sistema.</p>
                        </div>
                    </div>
                </div>

                <h3>📈 Relatórios Gerenciais</h3>
                <p>Informações importantes para gestão:</p>
                <ul>
                    <li><strong>Taxa de ocupação:</strong> Percentual de horários preenchidos</li>
                    <li><strong>Frequência de pacientes:</strong> Acompanhamento de comparecimento</li>
                    <li><strong>Receita por período:</strong> Análise financeira</li>
                    <li><strong>Crescimento da clínica:</strong> Novos pacientes vs. alta</li>
                </ul>

                <h3>🔄 Relatórios Automáticos</h3>
                <p>Configure relatórios para serem gerados automaticamente:</p>
                <ul>
                    <li>Relatórios mensais enviados por email</li>
                    <li>Alertas de metas não atingidas</li>
                    <li>Resumos semanais de atividades</li>
                    <li>Backups de dados importantes</li>
                </ul>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('configuracao')">
                        <i data-feather="settings"></i>
                        Próximo: Configurações
                    </a>
                </div>
            </div>
        `
    },

    configuracao: {
        title: "Configurações",
        content: `
            <div class="help-section fade-in">
                <h2>Configurações do Sistema</h2>
                
                <h3>⚙️ Configurações Gerais</h3>
                <ul>
                    <li><strong>Dados da Clínica:</strong> Nome, endereço, contato</li>
                    <li><strong>Horário de Funcionamento:</strong> Dias e horários de atendimento</li>
                    <li><strong>Duração das Consultas:</strong> Tempo padrão dos atendimentos</li>
                    <li><strong>Moeda e Valores:</strong> Configurações financeiras</li>
                </ul>

                <h3>👥 Gestão de Usuários</h3>
                <p>Configure permissões e acessos:</p>
                <ul>
                    <li><strong>Administrador:</strong> Acesso total ao sistema</li>
                    <li><strong>Profissional:</strong> Acesso aos próprios pacientes</li>
                    <li><strong>Recepcionista:</strong> Agendamentos e cadastros</li>
                    <li><strong>Assistente:</strong> Apoio administrativo</li>
                </ul>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="key" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Segurança de Acesso</h4>
                            <p>Sempre use senhas fortes e atualize-as regularmente. Configure autenticação em duas etapas quando possível.</p>
                        </div>
                    </div>
                </div>

                <h3>🔔 Notificações</h3>
                <p>Configure alertas automáticos:</p>
                <ul>
                    <li>Lembretes de consultas por email/SMS</li>
                    <li>Alertas de aniversário de pacientes</li>
                    <li>Notificações de pagamentos pendentes</li>
                    <li>Avisos de backup de dados</li>
                </ul>

                <h3>🎨 Personalização</h3>
                <p>Personalize a interface:</p>
                <ul>
                    <li>Tema claro ou escuro</li>
                    <li>Cores da interface</li>
                    <li>Logo da clínica</li>
                    <li>Layout dos relatórios</li>
                </ul>

                <h3>💾 Backup e Restauração</h3>
                <p>Proteção dos dados:</p>
                <ul>
                    <li>Backup automático diário</li>
                    <li>Exportação manual de dados</li>
                    <li>Restauração de versões anteriores</li>
                    <li>Sincronização em nuvem</li>
                </ul>

                <div class="warning-card">
                    <div class="flex items-start">
                        <i data-feather="alert-circle" class="warning-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Cuidado com Alterações</h4>
                            <p>Algumas configurações podem afetar o funcionamento do sistema. Teste em ambiente de desenvolvimento antes de aplicar em produção.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('faq')">
                        <i data-feather="help-circle"></i>
                        Próximo: FAQ
                    </a>
                </div>
            </div>
        `
    },

    faq: {
        title: "Perguntas Frequentes",
        content: `
            <div class="help-section fade-in">
                <h2>Perguntas Frequentes (FAQ)</h2>
                
                <h3>🔐 Login e Acesso</h3>
                
                <h4>P: Esqueci minha senha, como recuperar?</h4>
                <p><strong>R:</strong> Clique em "Esqueci minha senha" na tela de login. Digite seu email e siga as instruções enviadas para sua caixa de entrada.</p>
                
                <h4>P: Posso acessar o sistema de qualquer computador?</h4>
                <p><strong>R:</strong> Sim, o Psyclin é web-based. Acesse através de qualquer navegador com internet, usando suas credenciais.</p>

                <h3>👥 Gestão de Pacientes</h3>
                
                <h4>P: Como alterar dados de um paciente já cadastrado?</h4>
                <p><strong>R:</strong> Acesse a lista de pacientes, encontre o paciente desejado e clique no ícone de edição (lápis). Faça as alterações e salve.</p>
                
                <h4>P: Posso cadastrar pacientes menores de idade?</h4>
                <p><strong>R:</strong> Sim. Para menores, adicione também os dados do responsável legal nos campos específicos do cadastro.</p>

                <h3>📅 Agenda</h3>
                
                <h4>P: Como cancelar uma consulta agendada?</h4>
                <p><strong>R:</strong> Clique na consulta na agenda e selecione "Cancelar". Opcionalmente, envie uma notificação automática ao paciente.</p>
                
                <h4>P: Posso agendar consultas recorrentes?</h4>
                <p><strong>R:</strong> Sim. Ao agendar, marque a opção "Recorrente" e defina a frequência (semanal, quinzenal, mensal).</p>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="lightbulb" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Dica Rápida</h4>
                            <p>Use a busca rápida (Ctrl+F) para encontrar respostas específicas nesta página de FAQ.</p>
                        </div>
                    </div>
                </div>

                <h3>📝 Prontuários e Documentos</h3>
                
                <h4>P: Como imprimir um prontuário completo?</h4>
                <p><strong>R:</strong> Acesse o prontuário do paciente, clique em "Exportar" e escolha "PDF Completo". O documento será gerado para download.</p>
                
                <h4>P: Posso editar registros antigos do prontuário?</h4>
                <p><strong>R:</strong> Por questões de segurança e auditoria, registros antigos têm edição limitada. Você pode adicionar observações complementares.</p>

                <h3>💰 Financeiro</h3>
                
                <h4>P: Como controlar os pagamentos dos pacientes?</h4>
                <p><strong>R:</strong> Na ficha do paciente, há uma aba "Financeiro" onde você pode registrar pagamentos, gerar recibos e acompanhar pendências.</p>
                
                <h4>P: O sistema emite nota fiscal?</h4>
                <p><strong>R:</strong> O sistema gera recibos. Para notas fiscais, integre com seu software contábil ou emita manualmente conforme legislação local.</p>

                <h3>🛠️ Problemas Técnicos</h3>
                
                <h4>P: O sistema está lento, o que fazer?</h4>
                <p><strong>R:</strong> Verifique sua conexão de internet. Limpe o cache do navegador (Ctrl+Shift+Del). Se persistir, entre em contato com o suporte.</p>
                
                <h4>P: Perdi dados, existe backup?</h4>
                <p><strong>R:</strong> Sim! O sistema faz backup automático diário. Entre em contato com o suporte para restaurar dados específicos se necessário.</p>

                <div class="warning-card">
                    <div class="flex items-start">
                        <i data-feather="phone" class="warning-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Não encontrou sua resposta?</h4>
                            <p>Entre em contato com nosso suporte técnico através da seção "Contato e Suporte" desta ajuda.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <a href="#" class="action-btn" onclick="loadCategory('contato')">
                        <i data-feather="phone"></i>
                        Contato e Suporte
                    </a>
                </div>
            </div>
        `
    },

    contato: {
        title: "Contato e Suporte",
        content: `
            <div class="help-section fade-in">
                <h2>Contato e Suporte</h2>
                
                <h3>📞 Canais de Atendimento</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-center mb-3">
                            <i data-feather="phone" class="text-green-600 mr-3"></i>
                            <h4 class="font-semibold text-gray-800">Telefone</h4>
                        </div>
                        <p class="text-gray-600">📱 (11) 9999-9999</p>
                        <p class="text-sm text-gray-500">Segunda a Sexta: 8h às 18h</p>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-center mb-3">
                            <i data-feather="mail" class="text-blue-600 mr-3"></i>
                            <h4 class="font-semibold text-gray-800">Email</h4>
                        </div>
                        <p class="text-gray-600">✉️ suporte@psyclin.com.br</p>
                        <p class="text-sm text-gray-500">Resposta em até 24h</p>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-center mb-3">
                            <i data-feather="message-circle" class="text-purple-600 mr-3"></i>
                            <h4 class="font-semibold text-gray-800">WhatsApp</h4>
                        </div>
                        <p class="text-gray-600">💬 (11) 9999-9999</p>
                        <p class="text-sm text-gray-500">Segunda a Sexta: 8h às 18h</p>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-center mb-3">
                            <i data-feather="globe" class="text-indigo-600 mr-3"></i>
                            <h4 class="font-semibold text-gray-800">Site</h4>
                        </div>
                        <p class="text-gray-600">🌐 www.psyclin.com.br</p>
                        <p class="text-sm text-gray-500">Documentação e tutoriais</p>
                    </div>
                </div>

                <h3>🚨 Tipos de Suporte</h3>
                
                <h4>🔧 Suporte Técnico</h4>
                <p>Para problemas com:</p>
                <ul>
                    <li>Login e acesso ao sistema</li>
                    <li>Lentidão ou travamentos</li>
                    <li>Erros e bugs do sistema</li>
                    <li>Recuperação de dados</li>
                    <li>Instalação e configuração</li>
                </ul>

                <h4>📚 Suporte Funcional</h4>
                <p>Para dúvidas sobre:</p>
                <ul>
                    <li>Como usar funcionalidades</li>
                    <li>Melhores práticas</li>
                    <li>Configuração de relatórios</li>
                    <li>Personalização do sistema</li>
                    <li>Treinamento da equipe</li>
                </ul>

                <div class="tip-card">
                    <div class="flex items-start">
                        <i data-feather="clock" class="tip-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Horários de Atendimento</h4>
                            <p><strong>Suporte Urgente:</strong> 24h para problemas críticos<br>
                            <strong>Suporte Geral:</strong> Segunda a Sexta, 8h às 18h<br>
                            <strong>Treinamentos:</strong> Agendamento prévio necessário</p>
                        </div>
                    </div>
                </div>

                <h3>🎓 Recursos de Aprendizado</h3>
                
                <ul>
                    <li><strong>📖 Manual do Usuário:</strong> Guia completo em PDF</li>
                    <li><strong>🎥 Videoaulas:</strong> Tutoriais passo a passo</li>
                    <li><strong>💡 Blog:</strong> Dicas e novidades</li>
                    <li><strong>📱 App Mobile:</strong> Acesso via smartphone</li>
                    <li><strong>🔄 Webinars:</strong> Treinamentos online mensais</li>
                </ul>

                <h3>🆕 Solicitação de Melhorias</h3>
                
                <p>Tem uma ideia para melhorar o Psyclin?</p>
                <ul>
                    <li>Envie suas sugestões para: <strong>melhorias@psyclin.com.br</strong></li>
                    <li>Participe do nosso grupo de beta testers</li>
                    <li>Vote nas funcionalidades em desenvolvimento</li>
                    <li>Compartilhe casos de uso específicos</li>
                </ul>

                <div class="warning-card">
                    <div class="flex items-start">
                        <i data-feather="shield" class="warning-icon flex-shrink-0 mt-1"></i>
                        <div>
                            <h4>Informações de Segurança</h4>
                            <p>Nunca compartilhe suas credenciais com terceiros. Nossa equipe jamais solicitará senhas por telefone ou email.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <h3>Muito obrigado por usar o Psyclin! 🙏</h3>
                    <p class="text-gray-600 mt-2">Nossa missão é facilitar seu trabalho e melhorar o atendimento aos seus pacientes.</p>
                </div>
            </div>
        `
    }
};

// Variáveis globais
let currentCategory = 'inicio';

// Função para carregar conteúdo de uma categoria
function loadCategory(category) {
    const content = helpContent[category];
    if (!content) return;

    // Atualizar botão ativo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Carregar conteúdo
    const contentDiv = document.getElementById('help-content');
    contentDiv.innerHTML = content.content;
    
    // Re-renderizar ícones Feather
    feather.replace();
    
    // Atualizar categoria atual
    currentCategory = category;
    
    // Scroll para o topo
    contentDiv.scrollTo(0, 0);
}

// Função de busca
function searchHelp(query) {
    if (!query.trim()) {
        loadCategory(currentCategory);
        return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    // Buscar em todas as categorias
    Object.entries(helpContent).forEach(([category, data]) => {
        if (data.title.toLowerCase().includes(lowerQuery) || 
            data.content.toLowerCase().includes(lowerQuery)) {
            results.push({
                category,
                title: data.title,
                content: data.content
            });
        }
    });

    // Exibir resultados
    displaySearchResults(results, query);
}

// Função para exibir resultados da busca
function displaySearchResults(results, query) {
    const contentDiv = document.getElementById('help-content');
    
    if (results.length === 0) {
        contentDiv.innerHTML = `
            <div class="help-section fade-in">
                <h2>Nenhum resultado encontrado</h2>
                <p>Não encontramos resultados para "<strong>${query}</strong>".</p>
                <p>Tente:</p>
                <ul>
                    <li>Verificar a ortografia</li>
                    <li>Usar palavras-chave diferentes</li>
                    <li>Ser mais específico na busca</li>
                </ul>
                <div class="mt-4">
                    <button class="action-btn" onclick="loadCategory('inicio')">
                        <i data-feather="home"></i>
                        Voltar ao início
                    </button>
                </div>
            </div>
        `;
    } else {
        let html = `
            <div class="help-section fade-in">
                <h2>Resultados da busca: "${query}"</h2>
                <p>Encontramos ${results.length} resultado(s):</p>
                <div class="mt-4">
        `;
        
        results.forEach(result => {
            // Extrair preview do conteúdo
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            const preview = textContent.substring(0, 150) + '...';
            
            html += `
                <div class="search-result" onclick="loadCategory('${result.category}')">
                    <h4>${result.title}</h4>
                    <p>${preview}</p>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
    }
    
    feather.replace();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carregar conteúdo inicial
    loadCategory('inicio');
    
    // Configurar botões de categoria
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            loadCategory(category);
        });
    });
    
    // Configurar busca
    const searchInput = document.getElementById('search-help');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchHelp(this.value);
        }, 300);
    });
    
    // Limpar busca com ESC
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            loadCategory(currentCategory);
        }
    });
});

// Função global para navegação entre seções (usada nos links do conteúdo)
window.loadCategory = loadCategory;
