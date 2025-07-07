# 🧠 Psyclin - Sistema Web para Psicologia Acadêmica

<div align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</div>

---

## 📖 Sobre o Projeto

O **Psyclin** é um sistema web desenvolvido como atividade extracurricular na **FASIPE - Cuiabá** para automatizar e modernizar o processo de acompanhamento psicológico em ambientes acadêmicos. A aplicação centraliza todas as atividades relacionadas ao estágio supervisionado de psicologia, oferecendo uma solução digital completa para substituir processos manuais e descentralizados.

Este projeto foi desenvolvido como parte das atividades práticas do curso, visando aplicar conhecimentos adquiridos em sala de aula em um contexto real e relevante para a área de psicologia, sob orientação do **Prof. João Francisco Borba**.

### 🎯 Objetivo Principal
Fornecer uma plataforma simples, funcional e responsiva que auxilie a formação acadêmica dos alunos de psicologia, garantindo organização, rastreabilidade e agilidade na gestão dos atendimentos.

---

## 🚀 Funcionalidades

- 👥 **Cadastro de Pacientes** com dados clínicos completos
- 📝 **Registro de Anamnese** e documentos de campo
- 📅 **Agendamento e Controle de Consultas**
- ✔️ **Aprovação de Relatórios** pelo supervisor
- 📄 **Geração e Emissão de Documentos** em PDF
- 📊 **Dashboard** com indicadores gerais
- 🔐 **Controle de Acesso** por perfis de usuário

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 24** com Spring Boot 3.x
- **Spring Security** para autenticação e autorização
- **Spring Data JPA** para persistência de dados
- **Maven** para gerenciamento de dependências

### Frontend
- **HTML5** semântico
- **TailwindCSS** para estilização moderna
- **JavaScript Vanilla** para interatividade
- **CSS3** customizado

### Banco de Dados
- **MySQL 8.0** como SGBD principal

### Arquitetura
- **MVC (Model-View-Controller)**
- **Clean Code** e boas práticas
- **Modularização por funcionalidades**

---

## 👥 Organização das Branches

Cada integrante é responsável por um módulo específico, isolado em branches para facilitar o desenvolvimento e integração:

| Funcionalidade | Branch | Responsável | Status |
|----------------|--------|-------------|--------|
| Cadastro de Pacientes | `feature/cadastro-matheus` | Matheus Assunção | ✅ |
| Registro de Anamnese | `feature/anamnese-silas` | Silas Gabriel | ✅ |
| Gestão de Consultas | `feature/consulta-yuri` | Yuri Del Poso | ✅ |
| Aprovação do Orientador | `feature/aprovacao-erasmo` | Erasmo Cossatto | ✅ |
| Emissão de Relatórios | `feature/relatorio-joao` | João Carlos | ✅ |

**Legenda:** ✅ Concluído | 🔄 Em Desenvolvimento | ⏳ Pendente


---

## 🔄 Fluxo de Trabalho (Git Flow)

### Antes de começar a programar:

```bash
# 1. Atualize a branch main
git checkout main
git pull origin main

# 2. Volte para sua branch e integre as mudanças
git checkout sua-branch
git merge main

# 3. Resolva conflitos se houver
# 4. Comece a programar
```

### Ao finalizar uma funcionalidade:

```bash
# 1. Adicione e commite suas mudanças
git add .
git commit -m "feat: adiciona funcionalidade X"

# 2. Envie para o repositório remoto
git push origin sua-branch

# 3. Abra um Pull Request no GitHub
# 4. Aguarde revisão e aprovação
```

### Padrão de Commit Messages:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação/estilo
- `refactor:` Refatoração
- `test:` Testes

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Java 24 ou superior
- MySQL 8.0
- Maven 3.8+
- Node.js (opcional, para build do TailwindCSS)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/psyclin.git
cd psyclin
```

2. **Configure o banco de dados:**

> **Opção 1 - Configuração Local:**
```sql
CREATE DATABASE psyclin_db;
CREATE USER 'psyclin_user'@'localhost' IDENTIFIED BY 'psyclin_password';
GRANT ALL PRIVILEGES ON psyclin_db.* TO 'psyclin_user'@'localhost';
FLUSH PRIVILEGES;
```

> **Opção 2 - Usar DBA em Operação:**
```bash
# Para conectar com um DBA já configurado
# Configure as variáveis de ambiente com os dados do DBA de produção
DB_URL=jdbc:mysql://seu-dba-server:3306/psyclin_production
DB_USERNAME=psyclin_prod_user
DB_PASSWORD=senha_do_dba_production
```

3. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env

# Configure as variáveis:
DB_URL=jdbc:mysql://localhost:3306/psyclin_db
DB_USERNAME=psyclin_user
DB_PASSWORD=psyclin_password
```

4. **Execute a aplicação:**
```bash
# Compile e execute
mvn clean install
mvn spring-boot:run

# Ou usando o wrapper
./mvnw spring-boot:run
```

5. **Acesse a aplicação:**
- URL: `http://localhost:8080`
- Login padrão: `admin@psyclin.com` / `admin123`

---

## 🔐 Perfis de Usuário

### ADMIN (Coordenador)
- Gerencia todos os usuários do sistema
- Acesso completo a relatórios e estatísticas
- Configurações gerais do sistema

### SUPERVISOR (Professor Orientador)
- Aprova relatórios e documentos dos alunos
- Visualiza progresso dos supervisionados
- Emite pareceres e avaliações

### ALUNO (Estudante de Psicologia)
- Cadastra pacientes e agenda consultas
- Registra anamneses e sessões
- Gera relatórios para aprovação

---

## 📋 To-Do List

### 🔄 Falta Desenvolver
- [ ] Finalizar módulo de Anamnese
- [ ] Implementar sistema de consultas
- [ ] Desenvolver aprovação do orientador
- [ ] Criar geração de relatórios em PDF

### ⏳ Próximas Funcionalidades
- [ ] Notificações por email
- [ ] Dashboard com gráficos avançados
- [ ] Backup automático de dados
- [ ] Integração com calendário
- [ ] Sistema de chat interno
- [ ] Relatórios estatísticos
- [ ] Tema escuro/claro
- [ ] Aplicativo mobile (React Native)

### 🐛 Bugs Conhecidos
- [ ] Validação de CPF no cadastro
- [ ] Layout responsivo em telas pequenas
- [ ] Timeout de sessão muito curto

---

## 📁 Estrutura do Projeto

```
psyclin/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/psyclin/
│   │   │       ├── config/          # Configurações
│   │   │       ├── controller/      # Controllers REST
│   │   │       ├── service/         # Regras de negócio
│   │   │       ├── repository/      # Acesso a dados
│   │   │       ├── model/           # Entidades
│   │   │       └── security/        # Segurança
│   │   └── resources/
│   │       ├── static/              # CSS, JS, imagens
│   │       ├── templates/           # Templates Thymeleaf
│   │       └── application.yml      # Configurações
│   └── test/                        # Testes unitários
├── docs/                            # Documentação
├── database/                        # Scripts SQL
├── README.md
└── pom.xml
```

---

## 🔧 Boas Práticas

### Desenvolvimento
- Sempre criar testes unitários para novas funcionalidades
- Seguir padrões de nomenclatura Java (camelCase)
- Comentar código complexo
- Usar mensagens de commit descritivas
- Fazer code review antes de merge

### Banco de Dados
- Usar migrações Flyway para mudanças no schema
- Nunca commitar dados sensíveis
- Fazer backup regular durante desenvolvimento
- Usar índices adequados para consultas

### Segurança
- Validar todos os inputs do usuário
- Usar HTTPS em produção
- Implementar rate limiting
- Logs de auditoria para ações críticas

---

## 🤝 Equipe de Desenvolvimento

### Psyclin Team - FASIPE Cuiabá

**Matheus Assunção** - *Estudante de Analise e Desenvolvimento de Sistemas & Tech Lead*
- 🐙 [@matheusassuncao](https://github.com/matheusassuncaoo)

**Silas Gabriel** - *Estudante de Analise e Desenvolvimento de Sistemas*
- 🐙 [@silasgabriel](https://github.com/silasgabriel)

**Yuri Del Poso** - *Estudante de Analise e Desenvolvimento de Sistemas*
- 🐙 [@yuridelposo](https://github.com/yuridellpozzo)

**Erasmo Cossatto** - *Estudante de Analise e Desenvolvimento de Sistemas*
- 🐙 [@erasmocossatto](https://github.com/ErasmoCossatto)

**João Carlos** - *Estudante de Analise e Desenvolvimento de Sistemas*
- 🐙 https://www.linkedin.com/in/jcasjoca/
- 🐙 https://github.com/jcasjoca
 
### 👨‍🏫 Orientação Acadêmica

**Prof. João Francisco Borba** - *Orientador do Projeto*
- 📧 ads@fasipecuiaba.com.br
- 🎯 Supervisão técnica e acadêmica

---

## 📞 Suporte e Contato

- **Issues:** Use o GitHub Issues para reportar bugs
- **Discussões:** GitHub Discussions para ideias e dúvidas
- **Email:** psyclin.fasipe@gmail.com
- **Documentação:** [Wiki do Projeto](https://github.com/seu-usuario/psyclin/wiki)
- **Instituição:** FASIPE - Cuiabá/MT
- **Orientador:** Prof. João Francisco Borba

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  

**- Equipe Psyclin | FASIPE Cuiabá 2025**
**Orientação: Prof. João Francisco Borba**

---

**⭐ Se este projeto te ajudou, deixe uma estrela no repositório!**

</div>
