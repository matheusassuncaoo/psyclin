# Organização das Branches e Responsabilidades

Este projeto está dividido em funcionalidades, cada uma atribuída a um integrante da equipe. Cada funcionalidade deve ser desenvolvida em sua respectiva branch.

## Branches e Responsáveis

| Funcionalidade           | Branch                     | Responsável  |
|------------------------- |---------------------------|--------------|
| Login                    | feature/login-reynaldo     | Reynaldo     |
| Cadastro                 | feature/cadastro-matheus   | Matheus      |
| Anamnese                 | feature/anamnese-silas     | Silas        |
| Consulta                 | feature/consulta-yuri      | Yuri         |
| Aprovação do Orientador  | feature/aprovacao-erasmo   | Erasmo       |
| Emissão de Relatório     | feature/relatorio-joao     | João         |

## Fluxo de Trabalho

1. **Sempre atualize sua branch local com a branch principal antes de começar a trabalhar:**
   ```bash
   git checkout main
   git pull
   git checkout sua-branch
   git merge main
   ```
2. **Faça commits frequentes e descritivos.**
3. **Ao finalizar uma funcionalidade, abra um Pull Request para a branch principal.**
4. **Solicite revisão de código de pelo menos um colega.**
5. **Após aprovação, faça o merge para a branch principal.**

## Dicas

- Mantenha sua branch sempre atualizada com a principal para evitar conflitos.
- Documente qualquer decisão importante no código ou neste arquivo.
- Em caso de dúvidas, comunique-se pelo grupo do projeto.
