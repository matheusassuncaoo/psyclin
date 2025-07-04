/**
 * @fileoverview Script para a página de configurações do Psyclin
 * Gerencia todas as funcionalidades da interface de configurações
 * @version 1.0.0
 * @author Sistema Psyclin
 */

// Dados de configuração (simulados - em produção viriam da API)
let configData = {
    geral: {
        nomeClinica: 'Clínica Psicológica Psyclin',
        versaoSistema: '1.5A',
        idioma: 'pt-BR',
        fusoHorario: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
        formatoHora: '24h'
    },
    clinica: {
        razaoSocial: 'Psyclin Psicologia Ltda',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 3456-7890',
        email: 'contato@psyclin.com.br',
        site: 'www.psyclin.com.br'
    },
    agenda: {
        horarioInicio: '08:00',
        horarioFim: '18:00',
        duracaoConsulta: 50,
        intervaloConsultas: 10,
        diasFuncionamento: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
        agendamentoAntecedencia: 30,
        cancelamentoAntecedencia: 24
    }
};

// Conteúdo das configurações por aba
const configContent = {
    geral: {
        title: "Configurações Gerais",
        content: `
            <div class="config-section fade-in">
                <h3>Informações do Sistema</h3>
                
                <div class="status-card success">
                    <i data-feather="check-circle"></i>
                    <div>
                        <strong>Sistema Operacional:</strong> Sistema funcionando normalmente
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Nome da Clínica</label>
                        <input type="text" class="form-input" id="nomeClinica" value="${configData.geral.nomeClinica}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Versão do Sistema</label>
                        <input type="text" class="form-input" id="versaoSistema" value="${configData.geral.versaoSistema}" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Idioma</label>
                        <select class="form-select" id="idioma">
                            <option value="pt-BR" ${configData.geral.idioma === 'pt-BR' ? 'selected' : ''}>Português (Brasil)</option>
                            <option value="en-US" ${configData.geral.idioma === 'en-US' ? 'selected' : ''}>English (US)</option>
                            <option value="es-ES" ${configData.geral.idioma === 'es-ES' ? 'selected' : ''}>Español (España)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Fuso Horário</label>
                        <select class="form-select" id="fusoHorario">
                            <option value="America/Sao_Paulo" ${configData.geral.fusoHorario === 'America/Sao_Paulo' ? 'selected' : ''}>São Paulo (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-5)</option>
                            <option value="Europe/London">London (GMT+0)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Formato de Data</label>
                        <select class="form-select" id="formatoData">
                            <option value="DD/MM/YYYY" ${configData.geral.formatoData === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/AAAA</option>
                            <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                            <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Formato de Hora</label>
                        <select class="form-select" id="formatoHora">
                            <option value="24h" ${configData.geral.formatoHora === '24h' ? 'selected' : ''}>24 horas</option>
                            <option value="12h">12 horas (AM/PM)</option>
                        </select>
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="salvarConfiguracoes('geral')">
                        <i data-feather="save"></i>
                        Salvar Alterações
                    </button>
                    <button class="btn-secondary" onclick="resetarConfiguracoes('geral')">
                        <i data-feather="refresh-cw"></i>
                        Restaurar Padrões
                    </button>
                </div>
            </div>
        `
    },

    clinica: {
        title: "Dados da Clínica",
        content: `
            <div class="config-section fade-in">
                <h3>Informações Empresariais</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Razão Social</label>
                        <input type="text" class="form-input" id="razaoSocial" value="${configData.clinica.razaoSocial}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">CNPJ</label>
                        <input type="text" class="form-input" id="cnpj" value="${configData.clinica.cnpj}" placeholder="12.345.678/0001-90">
                    </div>
                </div>

                <h4>Endereço</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="form-group md:col-span-2">
                        <label class="form-label">Endereço Completo</label>
                        <input type="text" class="form-input" id="endereco" value="${configData.clinica.endereco}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">CEP</label>
                        <input type="text" class="form-input" id="cep" value="${configData.clinica.cep}" placeholder="12345-678">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cidade</label>
                        <input type="text" class="form-input" id="cidade" value="${configData.clinica.cidade}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" id="estado">
                            <option value="SP" ${configData.clinica.estado === 'SP' ? 'selected' : ''}>São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <!-- Outros estados... -->
                        </select>
                    </div>
                </div>

                <h4>Contato</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Telefone Principal</label>
                        <input type="tel" class="form-input" id="telefone" value="${configData.clinica.telefone}" placeholder="(11) 3456-7890">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="email" value="${configData.clinica.email}" placeholder="contato@psyclin.com.br">
                    </div>
                    
                    <div class="form-group md:col-span-2">
                        <label class="form-label">Website</label>
                        <input type="url" class="form-input" id="site" value="${configData.clinica.site}" placeholder="www.psyclin.com.br">
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="salvarConfiguracoes('clinica')">
                        <i data-feather="save"></i>
                        Salvar Alterações
                    </button>
                    <button class="btn-secondary" onclick="resetarConfiguracoes('clinica')">
                        <i data-feather="refresh-cw"></i>
                        Restaurar Padrões
                    </button>
                </div>
            </div>
        `
    },

    usuarios: {
        title: "Usuários e Permissões",
        content: `
            <div class="config-section fade-in">
                <h3>Gestão de Usuários</h3>
                
                <div class="flex justify-between items-center mb-6">
                    <p>Gerencie os usuários do sistema e suas permissões de acesso.</p>
                    <button class="btn-primary" onclick="novoUsuario()">
                        <i data-feather="user-plus"></i>
                        Novo Usuário
                    </button>
                </div>

                <table class="config-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Último Acesso</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dr. João Silva</td>
                            <td>joao@psyclin.com.br</td>
                            <td><span class="badge success">Administrador</span></td>
                            <td><span class="badge success">Ativo</span></td>
                            <td>Hoje, 14:30</td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="editarUsuario(1)">
                                    <i data-feather="edit-2"></i>
                                </button>
                                <button class="btn-danger" style="padding: 0.5rem;" onclick="desativarUsuario(1)">
                                    <i data-feather="user-x"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Dra. Maria Santos</td>
                            <td>maria@psyclin.com.br</td>
                            <td><span class="badge warning">Profissional</span></td>
                            <td><span class="badge success">Ativo</span></td>
                            <td>Ontem, 18:45</td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="editarUsuario(2)">
                                    <i data-feather="edit-2"></i>
                                </button>
                                <button class="btn-danger" style="padding: 0.5rem;" onclick="desativarUsuario(2)">
                                    <i data-feather="user-x"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Ana Costa</td>
                            <td>ana@psyclin.com.br</td>
                            <td><span class="badge">Recepcionista</span></td>
                            <td><span class="badge error">Inativo</span></td>
                            <td>15/06/2025</td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="editarUsuario(3)">
                                    <i data-feather="edit-2"></i>
                                </button>
                                <button class="btn-primary" style="padding: 0.5rem;" onclick="ativarUsuario(3)">
                                    <i data-feather="user-check"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h4>Perfis de Acesso</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="status-card success">
                        <i data-feather="shield"></i>
                        <div>
                            <strong>Administrador</strong><br>
                            <small>Acesso total ao sistema</small>
                        </div>
                    </div>
                    <div class="status-card warning">
                        <i data-feather="user-check"></i>
                        <div>
                            <strong>Profissional</strong><br>
                            <small>Seus pacientes e agenda</small>
                        </div>
                    </div>
                    <div class="status-card">
                        <i data-feather="calendar"></i>
                        <div>
                            <strong>Recepcionista</strong><br>
                            <small>Agendamentos e cadastros</small>
                        </div>
                    </div>
                    <div class="status-card">
                        <i data-feather="file-text"></i>
                        <div>
                            <strong>Assistente</strong><br>
                            <small>Apoio administrativo</small>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    agenda: {
        title: "Agenda e Horários",
        content: `
            <div class="config-section fade-in">
                <h3>Configurações da Agenda</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Horário de Início</label>
                        <input type="time" class="form-input" id="horarioInicio" value="${configData.agenda.horarioInicio}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Horário de Fim</label>
                        <input type="time" class="form-input" id="horarioFim" value="${configData.agenda.horarioFim}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Duração da Consulta (minutos)</label>
                        <select class="form-select" id="duracaoConsulta">
                            <option value="30" ${configData.agenda.duracaoConsulta === 30 ? 'selected' : ''}>30 minutos</option>
                            <option value="45" ${configData.agenda.duracaoConsulta === 45 ? 'selected' : ''}>45 minutos</option>
                            <option value="50" ${configData.agenda.duracaoConsulta === 50 ? 'selected' : ''}>50 minutos</option>
                            <option value="60" ${configData.agenda.duracaoConsulta === 60 ? 'selected' : ''}>60 minutos</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Intervalo entre Consultas (minutos)</label>
                        <select class="form-select" id="intervaloConsultas">
                            <option value="0" ${configData.agenda.intervaloConsultas === 0 ? 'selected' : ''}>Sem intervalo</option>
                            <option value="5" ${configData.agenda.intervaloConsultas === 5 ? 'selected' : ''}>5 minutos</option>
                            <option value="10" ${configData.agenda.intervaloConsultas === 10 ? 'selected' : ''}>10 minutos</option>
                            <option value="15" ${configData.agenda.intervaloConsultas === 15 ? 'selected' : ''}>15 minutos</option>
                        </select>
                    </div>
                </div>

                <h4>Dias de Funcionamento</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="domingo" ${configData.agenda.diasFuncionamento.includes('domingo') ? 'checked' : ''}>
                        <label for="domingo" class="form-label mb-0">Domingo</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="segunda" ${configData.agenda.diasFuncionamento.includes('segunda') ? 'checked' : ''}>
                        <label for="segunda" class="form-label mb-0">Segunda</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="terca" ${configData.agenda.diasFuncionamento.includes('terca') ? 'checked' : ''}>
                        <label for="terca" class="form-label mb-0">Terça</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="quarta" ${configData.agenda.diasFuncionamento.includes('quarta') ? 'checked' : ''}>
                        <label for="quarta" class="form-label mb-0">Quarta</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="quinta" ${configData.agenda.diasFuncionamento.includes('quinta') ? 'checked' : ''}>
                        <label for="quinta" class="form-label mb-0">Quinta</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="sexta" ${configData.agenda.diasFuncionamento.includes('sexta') ? 'checked' : ''}>
                        <label for="sexta" class="form-label mb-0">Sexta</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox" id="sabado" ${configData.agenda.diasFuncionamento.includes('sabado') ? 'checked' : ''}>
                        <label for="sabado" class="form-label mb-0">Sábado</label>
                    </div>
                </div>

                <h4>Políticas de Agendamento</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Antecedência Mínima para Agendamento (dias)</label>
                        <select class="form-select" id="agendamentoAntecedencia">
                            <option value="0" ${configData.agenda.agendamentoAntecedencia === 0 ? 'selected' : ''}>Mesmo dia</option>
                            <option value="1" ${configData.agenda.agendamentoAntecedencia === 1 ? 'selected' : ''}>1 dia</option>
                            <option value="7" ${configData.agenda.agendamentoAntecedencia === 7 ? 'selected' : ''}>1 semana</option>
                            <option value="30" ${configData.agenda.agendamentoAntecedencia === 30 ? 'selected' : ''}>1 mês</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Antecedência Mínima para Cancelamento (horas)</label>
                        <select class="form-select" id="cancelamentoAntecedencia">
                            <option value="1" ${configData.agenda.cancelamentoAntecedencia === 1 ? 'selected' : ''}>1 hora</option>
                            <option value="6" ${configData.agenda.cancelamentoAntecedencia === 6 ? 'selected' : ''}>6 horas</option>
                            <option value="24" ${configData.agenda.cancelamentoAntecedencia === 24 ? 'selected' : ''}>24 horas</option>
                            <option value="48" ${configData.agenda.cancelamentoAntecedencia === 48 ? 'selected' : ''}>48 horas</option>
                        </select>
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="salvarConfiguracoes('agenda')">
                        <i data-feather="save"></i>
                        Salvar Alterações
                    </button>
                    <button class="btn-secondary" onclick="resetarConfiguracoes('agenda')">
                        <i data-feather="refresh-cw"></i>
                        Restaurar Padrões
                    </button>
                </div>
            </div>
        `
    },

    notificacoes: {
        title: "Notificações",
        content: `
            <div class="config-section fade-in">
                <h3>Configurações de Notificações</h3>
                
                <h4>Notificações do Sistema</h4>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <strong>Lembretes de Consulta</strong>
                            <p class="text-sm text-gray-600">Enviar lembretes automáticos para pacientes</p>
                        </div>
                        <input type="checkbox" class="form-switch" checked>
                    </div>
                    
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <strong>Notificações de Agenda</strong>
                            <p class="text-sm text-gray-600">Alertas sobre mudanças na agenda</p>
                        </div>
                        <input type="checkbox" class="form-switch" checked>
                    </div>
                    
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <strong>Backup Automático</strong>
                            <p class="text-sm text-gray-600">Notificar quando backup for concluído</p>
                        </div>
                        <input type="checkbox" class="form-switch">
                    </div>
                    
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <strong>Aniversários de Pacientes</strong>
                            <p class="text-sm text-gray-600">Lembrar aniversários dos pacientes</p>
                        </div>
                        <input type="checkbox" class="form-switch" checked>
                    </div>
                </div>

                <h4>Configurações de Email</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Servidor SMTP</label>
                        <input type="text" class="form-input" placeholder="smtp.gmail.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Porta</label>
                        <input type="number" class="form-input" placeholder="587">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email de Envio</label>
                        <input type="email" class="form-input" placeholder="noreply@psyclin.com.br">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Senha do Email</label>
                        <input type="password" class="form-input" placeholder="••••••••">
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="testarEmail()">
                        <i data-feather="mail"></i>
                        Testar Configuração
                    </button>
                    <button class="btn-primary" onclick="salvarConfiguracoes('notificacoes')">
                        <i data-feather="save"></i>
                        Salvar Alterações
                    </button>
                </div>
            </div>
        `
    },

    personalizacao: {
        title: "Personalização",
        content: `
            <div class="config-section fade-in">
                <h3>Personalização da Interface</h3>
                
                <h4>Tema</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onclick="selecionarTema('claro')">
                        <div class="w-full h-20 bg-white border rounded mb-2"></div>
                        <strong>Tema Claro</strong>
                        <p class="text-sm text-gray-600">Padrão do sistema</p>
                    </div>
                    
                    <div class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onclick="selecionarTema('escuro')">
                        <div class="w-full h-20 bg-gray-800 border rounded mb-2"></div>
                        <strong>Tema Escuro</strong>
                        <p class="text-sm text-gray-600">Menos cansativo</p>
                    </div>
                    
                    <div class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onclick="selecionarTema('auto')">
                        <div class="w-full h-20 bg-gradient-to-r from-white to-gray-800 border rounded mb-2"></div>
                        <strong>Automático</strong>
                        <p class="text-sm text-gray-600">Segue o sistema</p>
                    </div>
                </div>

                <h4>Logo da Clínica</h4>
                <div class="form-group">
                    <label class="form-label">Upload do Logo</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i data-feather="upload" class="mx-auto mb-4 text-gray-400" style="width: 48px; height: 48px;"></i>
                        <p class="text-gray-600 mb-4">Clique para fazer upload ou arraste o arquivo aqui</p>
                        <p class="text-sm text-gray-500">PNG, JPG até 2MB</p>
                        <input type="file" class="hidden" accept="image/*">
                        <button class="btn-secondary mt-4">
                            <i data-feather="folder"></i>
                            Escolher Arquivo
                        </button>
                    </div>
                </div>

                <h4>Cores do Sistema</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="form-group">
                        <label class="form-label">Cor Principal</label>
                        <input type="color" class="form-input h-12" value="#1FBF83">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor Secundária</label>
                        <input type="color" class="form-input h-12" value="#36A690">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor de Destaque</label>
                        <input type="color" class="form-input h-12" value="#042F40">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor de Fundo</label>
                        <input type="color" class="form-input h-12" value="#F5F7FA">
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="aplicarPersonalizacao()">
                        <i data-feather="eye"></i>
                        Visualizar Mudanças
                    </button>
                    <button class="btn-primary" onclick="salvarConfiguracoes('personalizacao')">
                        <i data-feather="save"></i>
                        Salvar Alterações
                    </button>
                    <button class="btn-secondary" onclick="resetarPersonalizacao()">
                        <i data-feather="refresh-cw"></i>
                        Restaurar Padrão
                    </button>
                </div>
            </div>
        `
    },

    backup: {
        title: "Backup e Segurança",
        content: `
            <div class="config-section fade-in">
                <h3>Backup e Segurança dos Dados</h3>
                
                <div class="status-card success mb-6">
                    <i data-feather="shield-check"></i>
                    <div>
                        <strong>Último Backup:</strong> Hoje às 03:00 - Sucesso<br>
                        <small>Próximo backup agendado para amanhã às 03:00</small>
                    </div>
                </div>

                <h4>Configurações de Backup</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="form-label">Frequência do Backup</label>
                        <select class="form-select">
                            <option value="diario" selected>Diário</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Horário do Backup</label>
                        <input type="time" class="form-input" value="03:00">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Retenção (dias)</label>
                        <select class="form-select">
                            <option value="30" selected>30 dias</option>
                            <option value="60">60 dias</option>
                            <option value="90">90 dias</option>
                            <option value="365">1 ano</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Local do Backup</label>
                        <select class="form-select">
                            <option value="local" selected>Servidor Local</option>
                            <option value="nuvem">Nuvem (Google Drive)</option>
                            <option value="ambos">Local + Nuvem</option>
                        </select>
                    </div>
                </div>

                <h4>Ações de Backup</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button class="btn-primary" onclick="executarBackup()">
                        <i data-feather="download"></i>
                        Backup Manual
                    </button>
                    
                    <button class="btn-secondary" onclick="restaurarBackup()">
                        <i data-feather="upload"></i>
                        Restaurar Backup
                    </button>
                    
                    <button class="btn-secondary" onclick="baixarBackup()">
                        <i data-feather="hard-drive"></i>
                        Baixar Backup
                    </button>
                </div>

                <h4>Histórico de Backups</h4>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Tipo</th>
                            <th>Tamanho</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>04/07/2025 03:00</td>
                            <td>Automático</td>
                            <td>125 MB</td>
                            <td><span class="badge success">Sucesso</span></td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem;" onclick="baixarBackupEspecifico('20250704')">
                                    <i data-feather="download"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>03/07/2025 03:00</td>
                            <td>Automático</td>
                            <td>123 MB</td>
                            <td><span class="badge success">Sucesso</span></td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem;" onclick="baixarBackupEspecifico('20250703')">
                                    <i data-feather="download"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>02/07/2025 15:30</td>
                            <td>Manual</td>
                            <td>122 MB</td>
                            <td><span class="badge success">Sucesso</span></td>
                            <td>
                                <button class="btn-secondary" style="padding: 0.5rem;" onclick="baixarBackupEspecifico('20250702')">
                                    <i data-feather="download"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="salvarConfiguracoes('backup')">
                        <i data-feather="save"></i>
                        Salvar Configurações
                    </button>
                </div>
            </div>
        `
    },

    sistema: {
        title: "Sistema e Logs",
        content: `
            <div class="config-section fade-in">
                <h3>Informações do Sistema</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="status-card success">
                        <i data-feather="server"></i>
                        <div>
                            <strong>Status do Servidor</strong><br>
                            <small>Online - 99.9% uptime</small>
                        </div>
                    </div>
                    
                    <div class="status-card success">
                        <i data-feather="database"></i>
                        <div>
                            <strong>Banco de Dados</strong><br>
                            <small>MySQL 8.0 - Conectado</small>
                        </div>
                    </div>
                    
                    <div class="status-card warning">
                        <i data-feather="hard-drive"></i>
                        <div>
                            <strong>Espaço em Disco</strong><br>
                            <small>75% utilizado (750GB/1TB)</small>
                        </div>
                    </div>
                    
                    <div class="status-card success">
                        <i data-feather="wifi"></i>
                        <div>
                            <strong>Conectividade</strong><br>
                            <small>Estável - 100ms latência</small>
                        </div>
                    </div>
                </div>

                <h4>Logs do Sistema</h4>
                <div class="form-group">
                    <label class="form-label">Filtrar por Tipo</label>
                    <select class="form-select" onchange="filtrarLogs(this.value)">
                        <option value="todos">Todos os Logs</option>
                        <option value="info">Informações</option>
                        <option value="warning">Avisos</option>
                        <option value="error">Erros</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>

                <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto mb-6">
                    <div>[2025-07-04 14:30:15] INFO: Sistema iniciado com sucesso</div>
                    <div>[2025-07-04 14:30:16] INFO: Conexão com banco de dados estabelecida</div>
                    <div>[2025-07-04 14:30:17] INFO: Carregando configurações...</div>
                    <div>[2025-07-04 14:31:02] INFO: Usuário 'admin@psyclin.com.br' fez login</div>
                    <div>[2025-07-04 14:35:18] INFO: Backup automático agendado para 03:00</div>
                    <div>[2025-07-04 14:42:33] WARNING: Uso de memória em 85%</div>
                    <div>[2025-07-04 14:45:01] INFO: Paciente 'João Silva' cadastrado</div>
                    <div>[2025-07-04 14:47:22] INFO: Consulta agendada para 15:00</div>
                    <div class="text-yellow-400">[2025-07-04 14:50:30] WARNING: Tentativa de login inválida de IP 192.168.1.100</div>
                    <div>[2025-07-04 14:52:15] INFO: Relatório mensal gerado</div>
                </div>

                <h4>Manutenção do Sistema</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button class="btn-secondary" onclick="limparCache()">
                        <i data-feather="trash-2"></i>
                        Limpar Cache
                    </button>
                    
                    <button class="btn-secondary" onclick="otimizarBanco()">
                        <i data-feather="database"></i>
                        Otimizar Banco
                    </button>
                    
                    <button class="btn-danger" onclick="reiniciarSistema()">
                        <i data-feather="refresh-cw"></i>
                        Reiniciar Sistema
                    </button>
                </div>

                <h4>Estatísticas de Uso</h4>
                <table class="config-table">
                    <thead>
                        <tr>
                            <th>Métrica</th>
                            <th>Atual</th>
                            <th>Máximo</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Usuários Conectados</td>
                            <td>3</td>
                            <td>10</td>
                            <td><span class="badge success">Normal</span></td>
                        </tr>
                        <tr>
                            <td>Consultas Hoje</td>
                            <td>12</td>
                            <td>25</td>
                            <td><span class="badge success">Normal</span></td>
                        </tr>
                        <tr>
                            <td>Uso de CPU</td>
                            <td>45%</td>
                            <td>100%</td>
                            <td><span class="badge success">Normal</span></td>
                        </tr>
                        <tr>
                            <td>Uso de Memória</td>
                            <td>85%</td>
                            <td>100%</td>
                            <td><span class="badge warning">Alto</span></td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-6 flex gap-4">
                    <button class="btn-primary" onclick="exportarLogs()">
                        <i data-feather="download"></i>
                        Exportar Logs
                    </button>
                    <button class="btn-secondary" onclick="atualizarEstatisticas()">
                        <i data-feather="refresh-cw"></i>
                        Atualizar Dados
                    </button>
                </div>
            </div>
        `
    }
};

// Variáveis globais
let currentTab = 'geral';

// Função para carregar conteúdo de uma aba
function loadTab(tab) {
    const content = configContent[tab];
    if (!content) return;

    // Atualizar botão ativo
    document.querySelectorAll('.config-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Carregar conteúdo
    const contentDiv = document.getElementById('config-content');
    contentDiv.innerHTML = content.content;
    
    // Re-renderizar ícones Feather
    feather.replace();
    
    // Atualizar aba atual
    currentTab = tab;
    
    // Scroll para o topo
    contentDiv.scrollTo(0, 0);
}

// Função para salvar configurações
function salvarConfiguracoes(categoria) {
    // Mostrar loading
    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    // Simular salvamento (em produção, seria uma chamada para API)
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        
        // Mostrar toast de sucesso
        mostrarToast('Configurações salvas com sucesso!', 'success');
        
        // Atualizar dados locais
        atualizarConfigLocal(categoria);
    }, 1500);
}

// Função para resetar configurações
function resetarConfiguracoes(categoria) {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
        mostrarToast('Configurações restauradas para o padrão', 'info');
        loadTab(categoria); // Recarregar a aba
    }
}

// Função para mostrar toast
function mostrarToast(mensagem, tipo = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <i data-feather="${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'x-circle' : 'info'}"></i>
        <span class="ml-3">${mensagem}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto">
            <i data-feather="x"></i>
        </button>
    `;
    
    container.appendChild(toast);
    feather.replace();
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Funções específicas para cada seção
function novoUsuario() {
    alert('Funcionalidade de novo usuário será implementada');
}

function editarUsuario(id) {
    alert(`Editar usuário ID: ${id}`);
}

function desativarUsuario(id) {
    if (confirm('Tem certeza que deseja desativar este usuário?')) {
        mostrarToast('Usuário desativado com sucesso', 'info');
    }
}

function ativarUsuario(id) {
    mostrarToast('Usuário ativado com sucesso', 'success');
}

function testarEmail() {
    mostrarToast('Testando configuração de email...', 'info');
    setTimeout(() => {
        mostrarToast('Email de teste enviado com sucesso!', 'success');
    }, 2000);
}

function selecionarTema(tema) {
    mostrarToast(`Tema ${tema} selecionado`, 'info');
}

function aplicarPersonalizacao() {
    mostrarToast('Visualizando mudanças...', 'info');
}

function resetarPersonalizacao() {
    if (confirm('Restaurar cores padrão do sistema?')) {
        mostrarToast('Personalização restaurada', 'info');
    }
}

function executarBackup() {
    mostrarToast('Iniciando backup manual...', 'info');
    setTimeout(() => {
        mostrarToast('Backup concluído com sucesso!', 'success');
    }, 3000);
}

function restaurarBackup() {
    if (confirm('Tem certeza que deseja restaurar um backup? Todos os dados atuais serão substituídos.')) {
        alert('Selecione o arquivo de backup');
    }
}

function baixarBackup() {
    mostrarToast('Preparando download do backup...', 'info');
}

function baixarBackupEspecifico(data) {
    mostrarToast(`Baixando backup de ${data}...`, 'info');
}

function limparCache() {
    mostrarToast('Limpando cache do sistema...', 'info');
    setTimeout(() => {
        mostrarToast('Cache limpo com sucesso!', 'success');
    }, 1000);
}

function otimizarBanco() {
    mostrarToast('Otimizando banco de dados...', 'info');
    setTimeout(() => {
        mostrarToast('Banco de dados otimizado!', 'success');
    }, 2000);
}

function reiniciarSistema() {
    if (confirm('Tem certeza que deseja reiniciar o sistema? Todos os usuários serão desconectados.')) {
        mostrarToast('Sistema será reiniciado em 30 segundos...', 'warning');
    }
}

function filtrarLogs(tipo) {
    mostrarToast(`Filtrando logs por: ${tipo}`, 'info');
}

function exportarLogs() {
    mostrarToast('Exportando logs do sistema...', 'info');
}

function atualizarEstatisticas() {
    mostrarToast('Atualizando estatísticas...', 'info');
}

function atualizarConfigLocal(categoria) {
    // Em produção, isso atualizaria os dados locais com os valores dos formulários
    console.log(`Atualizando configurações da categoria: ${categoria}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carregar conteúdo inicial
    loadTab('geral');
    
    // Configurar botões de aba
    document.querySelectorAll('.config-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            loadTab(tab);
        });
    });
});

// Função global para navegação entre seções
window.loadTab = loadTab;
