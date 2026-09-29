# Adgestio - Plataforma de Gestão Corporativa

> Centralize. Organize. Monitore. Decida.

Uma plataforma de web de **Gestão Corporativa Centralizada**, desenvolvida para simular um produto SaaS de nível profissional capaz de reunir **documentos, tarefas e indicadores de desempenho** em um único ambiente.

O projeto foi concebido com foco em **boas práticas de Engenharia de Software, arquitetura organizada, reutilização de componentes, tipagem estrita e experiência de usuário (UX/UI).**

A proposta é representar uma aplicação próxima de um cenário real de mercado, onde diferentes informações corporativas podem ser acompanhadas de forma clara, estruturada e centralizada.

---

# Sobre o Projeto

Em ambientes corporativos, informações importantes costumam ficar distribuídas entre diferentes ferramentas, planilhas e sistemas.

O **Adgestio** propõe uma abordagem diferente:

> **Um único painel para visualizar informações importantes da organização e acompanhar suas principais atividades.**

A plataforma possui um dashboard centralizado onde o usuário pode acompanhar indicadores, gerenciar tarefas e consultar o status de documentos.

# Objetivos

- Centralizar informações corporativas;
- Facilitar o acompanhamento de atividades;
- Melhorar a visualização de indicadores;
- Organizar documentos e seus respectivos status;
- Criar uma experiência de uso simples e intuitiva
- Aplicar conceito de arquitetura e desenvolvimento utilizados no mercado.

---

# Principais Funcionalidades

## Dashboard de Indicadores

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
 
### Status


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

### Exemplos de Status


| Status      |      Significado              |
|-------------|-------------------------------|
| 🟢 Ativo    | Documento válido e em acompanhamento |
| 🟡 Pendente | Necessita alguma ação |
| 🔵 Em análise| Documento sendo avaliado |
| 🔴 Expirado | Documento fora de validade |
| ⚪ Arquivado| Documento não está mais ativo |

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
  
## Componentização

Elementos recorrentes da interface devem ser transformados em componentes reutilizáveis.

**Exemplos:**

- Button;
- Card;
- Modal;
- Sidebar;
- Header;
- Table;
- StatusBadge;
- MetricCard;
- TaskCard;
- DocumentCard.

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

# Roadmap

O projeto foi pensado para evoluir progressivamente de uma aplicação demonstrativa para uma arquitetura cada vez mais próxima de um produto SaaS real.

**Fase 1 - Interface**

**Fase 2 - Funcionalidades**

**Fase 3 - Backend e Dados**

**Fase 4 - Segurança e Autenticação**

**Fase 5 - Evolução Tecnológica**

---

# UX/UI

--
