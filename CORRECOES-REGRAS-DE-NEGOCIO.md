# Correções das regras de negócio — Adgestion

Branch proposta: `fix/regras-negocio-obrigatorias`.
Base: main com as alterações de Lukas (ZIP main(6)). Preservadas a paginação de oito unidades, a pesquisa de tarefas por unidade, o componente DetalheUnidade, a consulta buscarUnidade e os vínculos dos dados de exemplo. Escopo: sete regras solicitadas; sem refatoração geral, proxy ou tema escuro.

## Alterações

1. **Documentos em unidades inativas:** `src/lib/dashboard/unidade-regras.ts` valida a existência, titularidade e situação da unidade. `documentos.ts` usa a regra ao criar/editar. A interface exclui opções inativas do seletor. A API retorna erro 409 quando a unidade está inativa.
2. **Tarefas em unidades inativas:** `prisma/schema.prisma` completa a relação Unidade–Tarefa que faltava no schema da main, embora já fosse utilizada no código de Lukas. `tarefas.ts`, `tipos.ts`, `validacao/dashboard.ts` e a tela de tarefas passam a receber a unidade. Preservado o vínculo opcional da main; quando uma unidade é selecionada, ela deve estar ativa. Tarefas sem unidade continuam editáveis e podem ser concluídas com confirmação.
3. **Vencimento:** `JANELA_VENCIMENTO_DIAS` passa de 30 para 15. Data anterior a hoje = Vencido; hoje até 15 dias inclusive = A vencer; acima de 15 dias = Vigente. Documentos antigos sem data mantêm o comportamento anterior (Vigente).
4. **Status:** `situacaoDocumento()` calcula exclusivamente a partir da data. O campo existente `emAnalise` é preservado como metadado de renovação, sem interferir na validade. Filtros, gráficos e selos usam os três estados calculados.
5. **Confirmação:** tanto o atalho de conclusão quanto o formulário solicitam confirmação. A API exige `confirmarConclusao` na transição para Concluída, inclusive na criação. O cancelamento não envia a alteração.
6. **Indicadores:** `resumo.ts` soma documentos a vencer/vencidos e tarefas pendentes/em andamento. `DashboardStats.tsx` apresenta o total e sua composição. As rotas CRUD invalidam o layout do dashboard com `revalidatePath`, e as telas mantêm `router.refresh()` após alterações, sem F5. Isso é atualização após mutações na aplicação, não sincronização instantânea entre vários navegadores.
7. **Somente leitura:** registros vinculados a unidades inativas não podem ser editados, excluídos ou concluídos pelas telas e APIs. Upload e remoção de PDF também são bloqueados; leitura/download continuam disponíveis. A exclusão de unidade inativa com registros vinculados é bloqueada. A página `/dashboard/unidades/[id]` lista documentos e tarefas da unidade, com aviso e sem ações de gestão quando inativa. Unidades ativas têm links para as telas de gestão. Dados de exemplo são carregados como registros históricos antes da desativação simulada.

## Banco de dados

Faça backup do SQLite antes da atualização. Execute `npm install`, `npm run db:push` e `npm run db:generate`. A nova coluna de relacionamento é opcional no banco para preservar tarefas antigas. Não use `--force-reset` ou `--accept-data-loss` sem avaliar os efeitos. Se não tiver `.env`, copie `.env.example` e configure JWT_SECRET.

## Verificação realizada e limites

- Análise sintática de 108 arquivos TS/TSX em src: sem erros de parsing.
- Teste isolado de nove casos de datas/status: passou novamente na versão integrada usando TypeScript disponível no ambiente.
- A instalação offline (npm ci) falhou por dependência zod-validation-error ausente do cache. Prisma generate, lint, build e testes de integração não foram executados nesta versão integrada. Não considerar validado para merge antes desses testes.
- A validação de situação é realizada antes da escrita; concorrência simultânea entre desativação e mutação ainda merece teste específico e eventual reforço transacional.

## Roteiro de teste manual (antes do merge)

1. Execute `npm run lint`, `npm run build`, `node tests/regras-negocio.cjs` e `npm run dev`.
2. Entre, carregue dados de exemplo e abra Unidades. Clique na unidade inativa. Confira documentos/tarefas e aviso de somente leitura.
3. Tente cadastrar documento e tarefa para unidade inativa; opção indisponível. Verifique também POST/PUT via API autenticada: tentativa deve ser recusada com 409. Verifique que unidade de outra conta é rejeitada.
4. Em unidade ativa, crie documento com data de ontem, hoje, +15 e +16 dias. Confira Vencido/A vencer/A vencer/Vigente, inclusive se renovação protocolada estiver marcada.
5. Crie tarefa ligada à unidade ativa. Tente concluir pelo botão e formulário: cancele, verifique que nada mudou; confirme e verifique mudança. API sem confirmação deve rejeitar a transição.
6. Volte à visão geral sem F5 após cada alteração; confira total de pendências (documentos vencidos/a vencer + tarefas abertas). Confira também alertas e gráficos.
7. Desative uma unidade com registros. Verifique bloqueio de edição, exclusão, conclusão e alteração de PDF, mas acesso para leitura. Reative e teste novamente.
8. Confira cadastro, login, relatórios, anexos e dados de exemplo para detectar regressões.
