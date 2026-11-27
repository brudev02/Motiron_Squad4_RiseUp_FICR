# Adgestion - Plataforma de Gestão Corporativa

> **Gestão centralize. Informações organizadas. Decisões mais eficientes.**

A **Adgestion** é uma plataforma web de gestão corporativa desenvolvida para centralizar o acompanhamento de unidades, documentos, tarefas e indicadores em um único painel.

O projeto busca simular uma aplicação SaaS voltada para diferentes empresas, aplicando boas práticas de desenvolvimento Front-End, Arquitetura de Software e Experiência do usuário(UX/IU).

---

# 🎯 Objetivos

- Centralizar informações de diferentes unidades empresarias.
- Facilitar o acompanhamento de documentos e suas respectivas validades.
- Organizar tarefas, prazos e estados de execução.
- Apresentar indicadores gerais em um dashboard.
- Garantir uma interface intuitiva, responsiva e consistente.
- Aplicar boas práticas de desenvolvimento Front-End e Arquitetura de Software.

# 👥 Público-Alvo

A plataforma foi concebida para atender **diferentes empresas**, independentemente de um segmento empresarial específico, que necessitam centralizar informações e acompanhar suas unidades, documentos e tarefas.

---

# 🧩 Funcionalidades

- **Login:** Autenticação e validação de formularios.
- **Dashboard:** Visão geral de unidades, documentos e tarefas pendentes.
- **Gestão de Unidades:** Listagem, pesquisa, filtros e detalhamento de uniades.
- **Documentos:** Acompanhamento de validade e identificação de vencimentos.
- **Tarefas:** Controle de atividades, prazos e status.
- **Indicadores Dinâmicos:** Atualização das informações realizadas no sistema.

---

# Estrutura do Projeto

```yaml
Motiron/
├── prisma/       # Configuração do banco de dados
├── public/       # Arquivos estáticos
├── src/          # Código-fonte da aplicação
├── docs/         # Documentação do projeto
├── .env.example  # Exemplo de configuração
└── README.md     # Documentação principal
```

---

# ⌨⚙️ Tecnologias

| Tecnologia |  Utilização        |
|------------|--------------------|
| **Next.js**  |  Desenvolvimento de aplicação web  |
| **React**  |  Construção da interface e componentes  |
| **TypeScript**  |  Tipagem e organização do código  |
| **JavaScript**  |  Implementação de funcionalidades |
| HTML5  |  Estrutura das páginas  |
| CSS3  |  Estelização e responsividade  |

---

# 📜 Bibliotecas Utilizadas

### Usadas na Aplicação:

- Next.js, React e React DOM - **Framework e Interface.**
- Prisma, Prisma Client e @prisma/adapter-better-sqlite3 - **Banco de dados SQLite.**
- bcrypts - **Processamento seguro de senhas.**
- Jose - **Operadores de tokens.**
- Zod - **Validação de dados.**

### Desenvolvimento e estilos:

- Tailwind CSS e @tailwindcss/postcss.
- TypeScript
- ESLint e eslint-config-next

---

# Como Executar

**Pré-requisitos:** Node.js, npm e Git.

#### Clonar o repositório
> git clone https://github.com/brudev02/Motiron_Squad4_RiseUp_FICR.git

#### Acessar a pasta do projeto
> cd Motiron_Squard4_RiseUp_FICR

#### Instalar as dependências
> npm install

#### Configurar o ambiente
> copie `.env.example` para `.env` e defina `JWT_SECRET` (string aleatória com no mínimo 32 caracteres)

#### Criar o banco de dados local (SQLite)
> npm run db:push

#### Iniciar o ambiente de desenvolvimento
> npm run dev

Acesse `http://localhost:3000`, crie uma conta em **Começar agora** e entre pelo **Entrar**. O dashboard fica em `/dashboard` e só abre com sessão válida. Em **Configurações** é possível carregar (e remover) dados de exemplo.

Verificações: `npm run lint` e `npm run build`.

---

# Status do Projeto

## ✅ Concluído

O Adgestion foi desenvolvido em equipe, em parceria com a Motiron e a FICR, como uma solução web voltada à gestão corporativa centralizada.

O projeto representa a aplicação prática de conhecimentos em desenvolvimento web, arquitetura de software, organização de código e boas práticas de engenharia de software, além de proporcionar experiência em colaboração e desenvolvimento de soluções tecnológicas.

## Equipe de desenvolvimento

Conheça os integrantes responsáveis pelo desenvolvimento do projeto:

|  Integrantes  |  GitHub  |
|---------------|----------|
|  Bruna Melo  |  [@brudev02](https://github.com/brudev02)  | 
|  Gabriel Macedo  |  [@GabrielMacedo0974](https://github.com/GabrielMacedo0974)  |
|  Henrique Figueira  |  [@Henriquefigueira1](https://github.com/Henriquefigueira1)  |
|  Lukas Angell  |  [@lukasangell12](https://github.com/lukasangell12)  |
|  José Carlos  |  [@JCcarlos-dev](https://github.com/JCcarlos-dev)  |
|  Kauã César  |  [@DonKaua](https://github.com/DonKaua)  |
|  Raquel vitoria  |  [@Raquelvitoriaa](https://github.com/Raquelvitoriaa)  |
