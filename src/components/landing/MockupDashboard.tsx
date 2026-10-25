import { IconeLanding, type NomeIconeLanding } from "./IconesLanding";

// Prévia ilustrativa do painel (dados fictícios, apenas para a landing page)
// Vai ser alterado com a alteração do codigo no futuro(Quando criarem kkkk)

const menu: { nome: string; icone: NomeIconeLanding; ativo?: boolean }[] = [
  { nome: "Visão geral", icone: "grid", ativo: true },
  { nome: "Unidades", icone: "predio" },
  { nome: "Documentos", icone: "documento" },
  { nome: "Tarefas", icone: "tarefas" },
  { nome: "Equipe", icone: "equipe" },
];

const indicadores: { titulo: string; valor: string; nota: string; icone: NomeIconeLanding }[] = [
  { titulo: "Unidades ativas", valor: "12", nota: "Todas conectadas", icone: "predio" },
  { titulo: "Documentos organizados", valor: "248", nota: "+18 neste mês", icone: "documento" },
  { titulo: "Tarefas concluídas", valor: "86%", nota: "24 de 28 tarefas", icone: "check" },
];

const unidades = [
  { nome: "Matriz · São Paulo", info: "32 colaboradores" },
  { nome: "Filial · Curitiba", info: "14 colaboradores" },
  { nome: "Filial · Belo Horizonte", info: "11 colaboradores" },
];

const prioridades = [
  { titulo: "Revisar limpeza da operação", tag: "Hoje", cor: "bg-amber-100 text-amber-700" },
  { titulo: "Revisar contratos de fornecedores", tag: "Amanhã", cor: "bg-emerald-100 text-emerald-700" },
  { titulo: "Atualizar documentos da unidade", tag: "28 out", cor: "bg-slate-100 text-slate-600" },
];

export function MockupDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* barra do navegador */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </div>
        <div className="mx-auto rounded bg-white px-8 py-0.5 text-[9px] text-slate-400">
          app.adgestion.com.br
        </div>
      </div>

      <div className="flex text-left text-slate-800">
        {/* menu lateral */}
        <aside className="hidden w-44 shrink-0 flex-col gap-1 bg-escuro p-3 text-white sm:flex">
          <p className="px-2 pb-3 pt-1 text-sm font-semibold text-campo">Adgestion</p>
          <div className="mb-2 flex items-center gap-2 rounded-md bg-white/10 p-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-destaque text-[9px] font-bold">
              GA
            </span>
            <span className="text-[10px] leading-tight">
              Grupo Aurora
              <br />
              <span className="text-white/50">Administrador</span>
            </span>
          </div>
          {menu.map((item) => (
            <span
              key={item.nome}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                item.ativo ? "bg-destaque text-white" : "text-white/70"
              }`}
            >
              <IconeLanding nome={item.icone} className="h-3 w-3" />
              {item.nome}
            </span>
          ))}
          <span className="mt-auto flex items-center gap-2 px-2 pt-10 text-[10px] text-white/60">
            <IconeLanding nome="config" className="h-3 w-3" />
            Configurações
          </span>
        </aside>

        {/* conteúdo */}
        <div className="min-w-0 flex-1 bg-fundo-claro p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Sua empresa, por inteiro.</h3>
              <p className="text-[9px] text-slate-500">Olá, Marina. Veja o que acontece hoje.</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] text-slate-400">
                <IconeLanding nome="busca" className="h-3 w-3" />
                Buscar na plataforma
              </span>
              <IconeLanding nome="sino" className="h-3.5 w-3.5 text-slate-400" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-painel text-[8px] font-bold text-white">
                MS
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {indicadores.map((i) => (
              <div key={i.titulo} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between text-[9px] text-slate-500">
                  {i.titulo}
                  <IconeLanding nome={i.icone} className="h-3.5 w-3.5 text-destaque" />
                </div>
                <p className="mt-1 text-xl font-semibold">{i.valor}</p>
                <p className="text-[9px] text-destaque">{i.nota}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-semibold">Suas unidades</p>
              <ul className="mt-2 space-y-2">
                {unidades.map((u) => (
                  <li key={u.nome} className="flex items-center gap-2 text-[10px]">
                    <IconeLanding nome="predio" className="h-3.5 w-3.5 text-painel" />
                    <span className="flex-1">
                      {u.nome}
                      <br />
                      <span className="text-[8px] text-slate-400">{u.info}</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] text-emerald-700">
                      Regular
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2 rounded-md border border-slate-200 p-2 text-[9px]">
                <IconeLanding nome="pasta" className="h-3.5 w-3.5 text-painel" />
                Alvará de funcionamento.pdf
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-semibold">Prioridades da equipe</p>
              <ul className="mt-2 space-y-2">
                {prioridades.map((p) => (
                  <li key={p.titulo} className="text-[10px]">
                    {p.titulo}
                    <br />
                    <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[8px] ${p.cor}`}>
                      {p.tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
