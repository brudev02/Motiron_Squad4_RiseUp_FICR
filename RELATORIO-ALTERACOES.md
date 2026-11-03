# Relatório de alterações — integração do dashboard ao Adgestion (Next.js)

> **Leia primeiro (item 13):** `npm run lint` e `npm run build` **não puderam ser executados** no ambiente em que este trabalho foi feito (o registro npm estava bloqueado, então `node_modules` não pôde ser instalado). O código foi revisado manualmente e passou por uma checagem de tipos parcial, mas **nada foi compilado nem testado em execução**. Rode os comandos do item 13 antes de considerar a entrega validada.

## 1. Resumo

- O dashboard HTML/CSS e a gestão de unidades (`localStorage`) foram reimplementados como parte nativa do Next.js (App Router), em React + TypeScript + Tailwind, com os tokens do design system do Adgestion.
- Persistência real com Prisma + SQLite: unidades, documentos, tarefas e histórico de atividades, sempre isolados por usuário.
- Login real (`/login` → `/api/login` → cookie `sessao` → `/dashboard`), com validação do JWT no servidor.
- Etapa 3 do fluxo de acesso implementada (`/login`).
- Mockup do Hero refeito para espelhar o dashboard real.
- Componentes duplicados removidos; arquivos antigos da raiz arquivados em `docs/legado/`.

## 2. Problemas encontrados na estrutura original

- `/login` tinha campos soltos (nome, usuário, e-mail, senha) e seleção de perfil sem autenticação; só levava ao cadastro.
- `CardLogin.tsx` chamava `/api/login`, mas não era usado por nenhuma página, e redirecionava para `/` (landing).
- Componentes duplicados: `src/app/components/*` × `src/components/*`; `Campo`, `BotaoPrincipal`, `Etapas`, `PainelIlustracao`, `Icones` e `IconesLanding` (ícones duplicados); `FormCadastro` aninhado em `src/app/cadastro/app/cadastro/`.
- `Etapas.tsx` previa 3 etapas, mas só 1 e 2 eram usadas.
- `/api/login` usava `process.env.JWT_SECRET` sem checagem (sem a variável, o segredo virava a string `"undefined"`), sempre 7 dias, e nada no servidor lia o cookie.
- Dashboard e unidades existiam fora do Next (`index.html`, `style.css`, `unidades`, `unidades css`), com cores azul/roxo; unidades gravava em `localStorage`.
- Prisma só tinha `Usuario`.
- Token CSS `--color-marca` (roxo `#9d8fd0`) sem nenhum uso; `.gitignore` continha linhas de `.env` coladas por engano; README com a marca "Adgestio".
- Nome de arquivo com acento/cedilha (`RecuperaçãoSenha.svg`, `DESCRIÇÃO`) — risco de divergência de normalização Unicode entre sistemas.

## 3. Arquivos criados

- **Dashboard (rotas):** `src/app/dashboard/{layout,page}.tsx` e `{unidades,documentos,tarefas,relatorios,usuarios,configuracoes}/page.tsx`.
- **Dashboard (componentes):** `src/components/dashboard/` — `DashboardShell`, `DashboardSidebar`, `DashboardHeader`, `DashboardOverview`, `DashboardStats`, `DashboardCharts`, `DashboardAttention`, `DashboardUnits`, `DashboardDocuments`, `DashboardTasks`, `DashboardReports`, `DashboardUsers`, `DashboardSettings`, `NovoRegistroMenu`, `navegacao.ts`, `estilos.ts`, hooks `useRecurso`/`useEdicao`/`useSair`, `graficos/{BarrasAtividade,Donut}`, `ui/{AcoesLinha,BadgeStatus,BlocosSecao,Busca,CampoForm,ConfirmarAcao,FormularioRegistro,Modal,Toast}`.
- **Autenticação/UI compartilhada:** `src/components/auth/{Etapas,FormCadastro,FormLogin,FormRedefinirSenha,PainelIlustracao,SeletorPerfil}.tsx`; `src/components/ui/{BotaoPrincipal,Campo,Icones}.tsx`.
- **Servidor:** `src/lib/{sessao,api,http}.ts`; `src/lib/validacao/{auth,dashboard}.ts`; `src/lib/dashboard/{tipos,datas,busca,situacao,atividades,unidades,documentos,tarefas,recursos,crud,resumo,csv,demo}.ts`.
- **APIs:** `/api/unidades`, `/api/unidades/[id]`, `/api/documentos`, `/api/documentos/[id]`, `/api/tarefas`, `/api/tarefas/[id]`, `/api/relatorios/[tipo]`, `/api/conta`, `/api/demo`, `/api/logout`.
- **Outros:** `.env.example`, `docs/legado/*` (com `LEIAME.md`), `RELATORIO-ALTERACOES.md`.

## 4. Arquivos modificados

`prisma/schema.prisma`, `prisma.config.ts`, `package.json` (apenas scripts), `.gitignore`, `README.md`, `src/app/globals.css`, `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/cadastro/[perfil]/page.tsx`, `src/app/redefinir-senha/page.tsx`, `src/app/api/login/route.ts`, `src/app/api/cadastro/route.ts`, `src/components/landing/{Hero,Recursos,MockupDashboard}.tsx`.

## 5. Arquivos removidos ou arquivados

| Arquivo | Destino / justificativa |
|---|---|
| `index.html`, `style.css` | Arquivados em `docs/legado/dashboard-antigo.*` (cópias idênticas, verificadas com `cmp`). Todas as seções e funções foram incorporadas ao Next. Nada os referencia. |
| `unidades`, `unidades css` | Arquivados em `docs/legado/unidades.{tsx,css}.txt`. CRUD, busca, filtro e indicadores migrados para `DashboardUnits`. |
| `src/app/components/{CardLogin,InputSenha,InputTexto,BotaoExtendido}.tsx` | Substituídos por `components/auth/FormLogin` e `components/ui/{Campo,BotaoPrincipal}`. `CardLogin` não era usado. |
| `src/components/{BotaoPrincipal,Campo,Etapas,Icones,PainelIlustracao}.tsx` | Duplicados; versões únicas em `components/ui` e `components/auth`. |
| `src/components/landing/IconesLanding.tsx` | Ícones duplicados; landing usa `components/ui/Icones`. |
| `src/app/cadastro/app/cadastro/FormCadastro.tsx` | Substituído por `components/auth/FormCadastro` (agora com perfil). |
| `public/ilustracoes/RecuperaçãoSenha.svg` | Renomeado para `RecuperacaoSenha.svg` (nome sem acento) e referência atualizada. |
| `DESCRIÇÃO` | Arquivo vazio mantido (só o nome foi preservado). |

## 6. Como o dashboard foi integrado

- `src/app/dashboard/layout.tsx` (Server Component) exige sessão e monta `DashboardShell` (sidebar, cabeçalho, toast e busca). Cada página repete a verificação, pois o Next não reexecuta o layout a cada navegação interna.
- Rotas: `/dashboard`, `/unidades`, `/documentos`, `/tarefas`, `/relatorios`, `/usuarios`, `/configuracoes`. Itens do menu vêm de `navegacao.ts`, que também alimenta o mockup da landing.
- Páginas são Server Components que leem do banco via Prisma; só as partes interativas (tabelas com filtro, modais, gráficos com seletor, menu) são Client Components. Após criar/editar/excluir, `router.refresh()` recarrega os dados reais.
- Todas as seções do pedido foram contempladas: sidebar, cabeçalho, navegação, visão geral, indicadores, gráficos (atividades e distribuição de documentos), documentos que exigem atenção, atividade recente, unidades, documentos, tarefas, relatórios, usuários, configurações, modais, filtros/busca, toast e responsividade (sidebar vira gaveta; busca também aparece na seção em telas pequenas).

## 7. Login e autenticação

1. "Entrar" na landing → `/login`. Quem já tem sessão válida é enviado direto a `/dashboard`.
2. `FormLogin` valida e-mail/senha (zod, mesmo schema da API), mostra "Entrando..." e trata credenciais incorretas, validação, falha de rede e erro 5xx.
3. `/api/login` confere a senha com **bcryptjs** (com comparação de custo constante mesmo se o e-mail não existir) e emite um JWT **jose** HS256 no cookie `sessao` (httpOnly, sameSite=lax, secure em produção). "Lembrar de mim" = 7 dias; sem marcar = 12 h e cookie de sessão.
4. Sucesso → `/dashboard`.
5. `lib/sessao.ts` valida o JWT **no servidor** (assinatura, validade, conta ainda existente no banco). Sem sessão → `redirect("/login")`. Todas as APIs do dashboard respondem 401 sem sessão.
6. `JWT_SECRET`: nunca há valor padrão. Se estiver ausente, a sessão não é emitida/validada (falha fechada) e o login devolve mensagem clara; em produção exige ≥ 32 caracteres e rejeita o valor de exemplo.
7. `POST /api/logout` apaga o cookie (botão "Sair").

## 8. Terceira etapa

`Etapas`: 1 = Criação de Conta (`/cadastro`, escolha do perfil) → 2 = Cadastro (`/cadastro/[perfil]`) → 3 = Entrada no sistema (`/login`). A etapa 3 só fica ativa em `/login`; as anteriores aparecem em tom suave quando já percorridas. O cadastro termina em `/login?conta=criada` (mensagem de sucesso), e o login não passa pelo cadastro. O perfil agora é gravado na conta (campo `Usuario.perfil`), e o login deixou de pedir perfil.

## 9. Hero

`MockupDashboard` foi refeito reutilizando a navegação (`ITENS_MENU`), `BarrasAtividade`, `Donut` e `BadgeStatus` do dashboard real: sidebar com os mesmos grupos, cabeçalho "Workspace / Visão geral", 4 indicadores, gráfico de atividades, rosca de documentos, "Documentos que exigem atenção" e "Atividade recente". É estático e usa números do conjunto de dados de exemplo (nenhum dado de conta real).

## 10. Identidade visual

Tokens únicos em `globals.css` (`escuro`, `painel`, `campo`, `destaque`, `fundo-claro`) + estados `ok`, `aviso`, `ambar`, `perigo` (e fundos). Removido o roxo `--color-marca` (não usado). Poppins mantida. Sem CSS global novo: tudo em classes Tailwind; marca grafada "Adgestion" em todo o código e no README.

## 11. Funcionalidades implementadas (por código; ver item 13 sobre testes)

Login/logout/proteção de rotas; CRUD de unidades, documentos e tarefas com validação (client e server) e toast; pesquisa (unidades: nome/responsável/cidade) e filtros por situação/status; indicadores calculados dos registros; situação do documento calculada pela validade (Vigente / Em análise / A vencer ≤ 30 dias / Vencido); tarefa atrasada; atalho "Concluir" tarefa; notificações (sino) com documentos vencidos/a vencer e tarefas atrasadas; exportação CSV (`;`, UTF-8 com BOM, proteção contra injeção de fórmulas); edição do nome da conta; carregar/remover dados de exemplo.

## 12. Dados reais × demonstrativos

- **Persistidos (SQLite):** usuários, unidades, documentos, tarefas, atividades. Cada consulta filtra por `usuarioId`; editar/excluir/vincular unidade de outra conta devolve 404/400.
- **Demonstrativos:** (a) mockup da landing (estático, ilustrativo); (b) "dados de exemplo" — **só** são criados quando a pessoa clica em Configurações, com `demo=true` e selo "Exemplo", e removíveis sem tocar nos registros próprios. Uma conta nova começa **vazia**, com estados vazios explicativos.
- **Não implementado (de propósito):** convite de usuários/permissões (não há modelo de empresa/equipe; a tela Usuários mostra só a conta logada e diz isso) e upload de arquivos de documentos.

## 13. Lint, build e testes

- **`npm run lint` — NÃO executado.** **`npm run build` — NÃO executado.** **Login, CRUD e telas — NÃO testados em execução.**
- Motivo: `npm install` falhou no ambiente (acesso a `registry.npmjs.org` bloqueado pelo proxy, HTTP 403), logo não havia Next, Prisma, Tailwind nem ESLint.
- O que foi feito no lugar: leitura integral dos arquivos; checagem de imports; checagem de tipos com TypeScript 6 + zod v4 e *stubs* para React/Next/Prisma/jose/bcryptjs — sem erros no código novo (restaram apenas erros de `any` implícito causados pelos próprios stubs). Isso **não** substitui `build`/`lint`.
- **Rode, nesta ordem:**
  ```bash
  npm install
  cp .env.example .env      # defina JWT_SECRET (>= 32 caracteres)
  npm run db:push           # cria o banco SQLite com as novas tabelas
  npm run lint
  npm run build
  npm run dev
  ```
- Roteiro manual sugerido: cadastrar conta → entrar → ver `/dashboard` vazio → Configurações → carregar dados de exemplo → criar/editar/excluir em cada seção → exportar CSV → sair → abrir `/dashboard` sem sessão (deve ir a `/login`) → ver a landing.

## 14. Pendências e melhorias

- Executar e corrigir o que o lint/build apontarem (item 13). Possíveis pontos de atenção: regras novas do `react-hooks` no ESLint e a compatibilidade do `prisma-client-js` com o Prisma 7 (o schema/uso seguem o que o projeto já tinha).
- `prisma db push` não gera migrações; para produção, usar `prisma migrate`.
- Já existente e mantido: o cadastro/redefinição **recusam senha igual à de outra conta** (`senhaEmUsoPorOutraConta`). Isso revela informação sobre outras contas e deveria ser revisto.
- Redefinição de senha só pede e-mail + nova senha (sem confirmação por e-mail): qualquer pessoa pode trocar a senha de uma conta. Precisa de token por e-mail antes de ir para produção.
- Sem limite de tentativas no login (rate limiting).
- Convites/permissões de usuários e anexos de documentos.
- Bloquear exclusão de unidade com documentos/tarefas em aberto (item do roadmap do README).
