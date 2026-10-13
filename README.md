# Adgestio - Plataforma de Gestão Corporativa

> Centralize. Organize. Monitore. Decida.

Uma plataforma de web de **Gestão Corporativa Centralizada**, desenvolvida para simular um produto SaaS de nível profissional capaz de reunir **documentos, tarefas e indicadores de desempenho** em um único ambiente.

O projeto foi concebido com foco em **boas práticas de Engenharia de Software, arquitetura organizada, reutilização de componentes, tipagem estrita e experiência de usuário (UX/UI).**

A proposta é representar uma aplicação próxima de um cenário real de mercado, onde diferentes informações corporativas podem ser acompanhadas de forma clara, estruturada e centralizada.

---

# 💡 Sobre o Projeto

Em ambientes corporativos, informações importantes costumam ficar distribuídas entre diferentes ferramentas, planilhas e sistemas.

O **Adgestio** propõe uma abordagem diferente:

> **Um único painel para visualizar informações importantes da organização e acompanhar suas principais atividades.**

A plataforma possui um dashboard centralizado onde o usuário pode acompanhar indicadores, gerenciar tarefas e consultar o status de documentos.

# 🎯 Objetivos

- Centralizar informações corporativas;
- Facilitar o acompanhamento de atividades;
- Melhorar a visualização de indicadores;
- Organizar documentos e seus respectivos status;
- Criar uma experiência de uso simples e intuitiva
- Aplicar conceito de arquitetura e desenvolvimento utilizados no mercado.

# 👥 Público-alvo

A plataforma foi concebida para atender diferentes empresas, independente de um segmento empresarial específico, que necessitem centralizar informações e acompanhar suas unidades, documentos e tarefas.

---

# 🔗 Principais Funcionalidades

## Tela de Login

Área destinada á autenticação dos usuários e ao controle de acesso á plataforma.

- Formulário de login com e-mail e senha
- Validação dos campos obrigatórios
- Mensagens de erro específicas
- Feedback visual de sucesso ou falha
- Redirecionamento de usuários não
- Autenticados para a tela de login

## 📊 Dashboard de Indicadores

Painel central responsável por apresentar uma visão geral da situação da organização.

**Principais informações:**

- Indicadores de desempenho;
- Resumo de tarefas;
- Status de documentos;
- Alerta e pendências;
- Atividades recentes;
- Cards e componentes visuais para facilitar a interpretação dos dados.
  
### Exemplos de Indicadores

| Indicador                      | Descrição                     |
| ------------------------------ | ----------------------------- |
|  Tarefas Pendentes             |  Quantidade de atividades ainda não concluídas |
|  Tarefas Concluídas            |  Atividades Finalizads        |
|  Documentos Ativos             |  Documentos atualmente em acompanhamentos |
|  Documentos Pendentes          |  Documentos que necessitam de alguma ação |
|  Desempenho                    |  Indicadores gerais da organização |


---

## Gestão de Tarefas

 Módulo destinado ao acompanhamento das atividades corporativas.

 **Possibilidades:**
 
 - Criar tarefas;
 - Visualizar tarefas pedentes;
 - Alterar status;
 - Definir prioridades;
 - Organizar atividades por categoria;
 - Acompanhar prazos;
 - Identificar tarefas concluídas e pendentes.

 ### Regras de status dos documentos

| Status      |      Significado              |
|-------------|-------------------------------|
| 🔵 Ativo    | Documento válido e em acompanhamento |
| 🟡 Pendente | Necessita alguma ação |
| 🟠 Em análise| Documento sendo avaliado |
| 🔴 Expirado | Documento fora de validade |
| 🟢 Concluído | Tarefa Finalizada |
| ⚪ Arquivado| Documento não está mais ativo | 
| ⚫ Inativa | Unidade sem permissão para receber novos documentos ou tarefas |

- A **conclusão** de uma tarefa deverá exigir confirmação do usuário, evitando alterações acidentais.
- Unidade **inativas** deverão apresentar seus documentos e tarefas em modo somente leitura no detalhamento.

---

## Acompanhamento de Documentos

Área destinada ao controle e acompanhamento de documentos corporativos.

**Funcionalidades planejadas:**

- Listagem de documentos;
- Identificação do status;
- Controle de documentos pendentes;
- Visualização de informações relevantes;
- Organização por categoria;
- Acompanhamento de validade e prazos;
- Identificação de documentos que precisam de atenção.

---

# Arquitetura e Boas Praticas

O projeto foi estruturado buscando seguir princípios utilizados em aplicações modernas de mercado.

A organização combina conceitos de Feature-Driven Development, separação de responsabilidades e princípios associados á Clean Architecture, mantendo a aplicação preparada para futuras evoluções.

## Princípios Adotados

- Separation of Concerns;
- Single Responsibility Principle;
- Componetização;
- Reutilização de código;
- Tipagem estrita com TypeScript;
- Organização por funcionalidades;
- Baixo acoplamento;
- Alta coesão;
- código legível e sustentável;
- Responsividade;
- Acessibilidade como preocupação de UX.
  
## Componentes reutilizáveis

A aplicação poderá utilizar componentes compartilhados, como: 

- Button
- Input
- Modal
- Table
- Badge
- Sidebar
- Header
- MetriCard

Isso evita duplicação de código e facilita a manutenção da aplicação.

---

# Tecnologias Utilizadas

|  Tecnologia  |  Utilização  |
|--------------|--------------|
|  Next.js     |  Framework principal da aplicação  |
|  TypeScript  |  Linguagem principal e tipagem estática  |
|  HTML5       |  Estrutura semântica das páginas  |
|  CSS3        |  Estilização e responsividade  |
|  JavaSript ES6+  |  Recursos e funcionalidades da aplicação  |

## Stack

---

# Estrutura de Páginas

## Responsabilidade das Principais Pastas

---

# 🗺️ Roadmap

O projeto foi pensado para evoluir progressivamente de uma aplicação demonstrativa para uma arquitetura cada vez mais próxima de um produto SaaS real.

**Fase 1 - Interface**

- [x] Estrutura inicial do projeto
- [x] Definição da identidade visual
- [x] Dashboard corporativo
- [x] Componentização da interface
- [ ] Responsividade completa
- [ ] Refinamento de UX/UI

**Fase 2 - Funcionalidades**
- [ ] CRUD de tarefas
- [ ] CRUD de documentos
- [ ] Filtros e pesquisas
- [ ] Sistema de prioridades
- [ ] Indicadores dinânmicos
- [ ] Notificações

**Fase 3 - Backend e Dados**

- [ ] Integração com bancos de dados real
- [ ] API para comunicação com o front-end
- [ ] Persistência de tarefas
- [ ] Persistência de documentos
- [ ] Histórico de alterações

**Fase 4 - Segurança e Autenticação**

- [ ] Sistema de login
- [ ] Autenticação de usuários
- [ ] Controle de permissões
- [ ] Diferentes níveis de acesso
- [ ] Proteção de rotas

**Fase 5 - Evolução Tecnológica**

- [ ] Novas ferramentas e bibliotecas
- [ ] Integração com serviços externos
- [ ] Monitoramento de aplicação
- [ ] Testes automatizados
- [ ] Pipeline de CI/CD
- [ ] Deploy em ambiente de produção

---

# 🎨 UX/UI

A experiência do usuário é um dos pilares do projeto.

A interface busca utilizar princípios como:

- Hierarquia visual
- Consistência de componentes
- Feedback visual
- Navegação intuitiva
- Responsividade
- Legibilidade
- Acessibilidade
- Redução de complexidade cognitiva

O objetivo não é apenas criar uma interface visualmente agradável, mas desenvolver uma experiência que permita ao usuário encontrar informações e executar ações com o menor atrito possível.

---

# Visão Técnica

O projeto tem como principais objetivos demonstrar conhecimento em:

<p align="center">
  Front-end
  Next.js
  TypeScript
  Componetização
  Arquitetura
  UX/UI
  Boas Práticas
</p>

Mais do que simplesmente construir telas, o projeto busca demonstrar a capacidade de estruturar e evoluir uma aplicação web de maneira organizada e sustentável.

---

# 🖳 Status do Projeto

> ## Em desenvolvimento

O projeto está em evolução contínua, com novas funcionalidades, melhorias de arquitetura e refinamentos de experiência de usuário sendo adicionados progressivamente.

---

# 📄 Licença

Este projeto possui finalidade educacional e demonstrativa, sendo utilizado para estudos, práticas de desenvolvimento web e demonstração de conhecimentos técnicos.

---

# ⭐ Objetivo Final

> ## Transformar dados e atividades dispersas em uma visão corporativa centralizada, organizada e acionável.

Adgestio - Gestão inteligente em um único painel.

--
