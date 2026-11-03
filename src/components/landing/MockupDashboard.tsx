import { Icone, type NomeIcone } from "@/components/ui/Icones";
import { GRUPOS_MENU, ITENS_MENU } from "@/components/dashboard/navegacao";
import { BarrasAtividade } from "@/components/dashboard/graficos/BarrasAtividade";
import { COR_SITUACAO, Donut } from "@/components/dashboard/graficos/Donut";
import { BadgeStatus, tomDocumento } from "@/components/dashboard/ui/BadgeStatus";
import { hojeISO, rotuloMes, ultimosMeses } from "@/lib/dashboard/datas";
import type {
  FatiaDistribuicao,
  PontoAtividade,
  SituacaoDocumento,
} from "@/lib/dashboard/tipos";

// Prévia VISUAL e estática do dashboard real (src/app/dashboard). Reaproveita
// a navegação, os gráficos e os selos do próprio dashboard, para que quem vê
// o Hero reconheça o mesmo produto depois do login. Os números abaixo são
// ilustrativos (iguais aos "dados de exemplo" de Configurações); nenhuma
// informação de conta real é exibida aqui.

const indicadores: {
  titulo: string;
  valor: number;
  nota: string;
  icone: NomeIcone;
  tom: string;
}[] = [
  { titulo: "Unidades cadastradas", valor: 4, nota: "3 ativas", icone: "predio", tom: "bg-campo/40 text-painel" },
  { titulo: "Documentos ativos", valor: 6, nota: "8 monitorados no total", icone: "documento", tom: "bg-ok-fundo text-ok" },
  { titulo: "Próximos vencimentos", valor: 2, nota: "2 já vencidos · próximos 30 dias", icone: "relogio", tom: "bg-aviso-fundo text-aviso" },
  { titulo: "Tarefas pendentes", valor: 5, nota: "1 atrasada", icone: "tarefas", tom: "bg-perigo-fundo text-perigo" },
];

const concluidas = [1, 1, 2, 1, 2, 1];
const emAberto = [0, 0, 0, 0, 1, 4];

const pontos: PontoAtividade[] = ultimosMeses(6, hojeISO()).map((mes, i) => ({
  rotulo: rotuloMes(mes),
  concluidas: concluidas[i],
  emAberto: emAberto[i],
}));

const distribuicao: FatiaDistribuicao[] = [
  { rotulo: "Vigente", valor: 3 },
  { rotulo: "Em análise", valor: 1 },
  { rotulo: "A vencer", valor: 2 },
  { rotulo: "Vencido", valor: 2 },
];

const atencao: {
  nome: string;
  unidade: string;
  prazo: string;
  situacao: SituacaoDocumento;
}[] = [
  { nome: "Certificado do Corpo de Bombeiros", unidade: "Unidade Recife", prazo: "Venceu há 8 dias", situacao: "Vencido" },
  { nome: "Seguro patrimonial", unidade: "Unidade Jaboatão", prazo: "Venceu há 2 dias", situacao: "Vencido" },
  { nome: "Alvará de funcionamento", unidade: "Unidade Recife", prazo: "Vence em 12 dias", situacao: "A vencer" },
  { nome: "Licença sanitária", unidade: "Unidade Olinda", prazo: "Vence em 24 dias", situacao: "A vencer" },
];

const recentes: { texto: string; quando: string; icone: NomeIcone }[] = [
  { texto: "Tarefa “Protocolar renovação de licença” concluída", quando: "há 2 h", icone: "tarefas" },
  { texto: "Documento “Licença sanitária” atualizado", quando: "há 5 h", icone: "documento" },
  { texto: "Unidade “Unidade Olinda” cadastrada", quando: "há 1 dia", icone: "predio" },
];

const painel = "rounded-lg border border-escuro/10 bg-white shadow-sm";

export function MockupDashboard() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      role="img"
      aria-label="Prévia do dashboard da Adgestion com visão geral, indicadores, gráficos e documentos que exigem atenção"
    >
      {/* barra do navegador */}
      <div className="flex items-center gap-3 border-b border-escuro/10 bg-fundo-claro px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-escuro/20" />
          <span className="h-2 w-2 rounded-full bg-escuro/20" />
          <span className="h-2 w-2 rounded-full bg-escuro/20" />
        </div>
        <div className="mx-auto rounded bg-white px-8 py-0.5 text-[9px] text-escuro/40">
          app.adgestion.com.br/dashboard
        </div>
      </div>

      <div aria-hidden="true" className="flex text-left text-escuro">
        {/* menu lateral (mesmos itens e grupos do dashboard) */}
        <aside className="hidden w-44 shrink-0 flex-col gap-4 bg-escuro p-3 text-white sm:flex">
          <div className="flex items-center gap-2 px-1 pt-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-campo text-[10px] font-bold text-escuro">
              A
            </span>
            <span className="text-sm font-semibold text-campo">Adgestion</span>
          </div>

          {GRUPOS_MENU.map((grupo) => (
            <div key={grupo.id}>
              <p className="mb-1 px-2 text-[7px] font-semibold uppercase tracking-widest text-white/40">
                {grupo.titulo}
              </p>
              {ITENS_MENU.filter((item) => item.grupo === grupo.id).map((item) => (
                <span
                  key={item.href}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                    item.href === "/dashboard" ? "bg-destaque text-white" : "text-white/70"
                  }`}
                >
                  <Icone nome={item.icone} className="h-3 w-3" />
                  {item.nome}
                </span>
              ))}
            </div>
          ))}

          <div className="mt-auto flex items-center gap-2 border-t border-white/10 px-1 pt-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destaque text-[8px] font-semibold">
              EX
            </span>
            <span className="text-[9px] leading-tight">
              Empresa Exemplo
              <br />
              <span className="text-white/50">Empresa</span>
            </span>
          </div>
        </aside>

        {/* conteúdo */}
        <div className="min-w-0 flex-1 bg-fundo-claro">
          {/* cabeçalho superior */}
          <div className="flex h-10 items-center justify-between gap-3 border-b border-escuro/10 bg-white px-4">
            <p className="text-[9px] text-escuro/50">
              Workspace <span className="mx-1">/</span>
              <b className="font-semibold text-escuro">Visão geral</b>
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1 rounded-md border border-escuro/15 px-2 py-1 text-[8px] text-escuro/40 sm:flex">
                <Icone nome="busca" className="h-2.5 w-2.5" />
                Buscar nesta página...
              </span>
              <Icone nome="sino" className="h-3.5 w-3.5 text-escuro/50" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-painel text-[7px] font-semibold text-white">
                EX
              </span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-[7px] font-semibold uppercase tracking-widest text-destaque">
              Visão executiva
            </p>
            <h3 className="mt-1 text-base font-semibold tracking-tight">Bom dia, Empresa!</h3>
            <p className="text-[9px] text-escuro/60">
              Acompanhe os principais indicadores da sua operação.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {indicadores.map((i) => (
                <div key={i.titulo} className={`${painel} p-2.5`}>
                  <div className="flex items-start justify-between gap-1 text-[8px] text-escuro/60">
                    {i.titulo}
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${i.tom}`}>
                      <Icone nome={i.icone} className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-semibold leading-none tracking-tight">{i.valor}</p>
                  <p className="mt-1 text-[7px] text-escuro/50">{i.nota}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 grid gap-2 md:grid-cols-[1.45fr_1fr]">
              <div className={`${painel} p-3`}>
                <p className="text-[10px] font-semibold">Visão de atividades</p>
                <p className="mb-2 text-[7px] text-escuro/50">Tarefas por mês (pelo prazo)</p>
                <BarrasAtividade pontos={pontos} className="h-20" compacto />
                <div className="mt-2 flex gap-3 text-[7px] text-escuro/60">
                  <span className="flex items-center gap-1">
                    <i className="h-1.5 w-1.5 rounded-sm bg-painel" /> Concluídas
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="h-1.5 w-1.5 rounded-sm bg-campo" /> Em aberto
                  </span>
                </div>
              </div>

              <div className={`${painel} p-3`}>
                <p className="text-[10px] font-semibold">Status dos documentos</p>
                <p className="mb-2 text-[7px] text-escuro/50">Distribuição por situação</p>
                <div className="flex items-center justify-center gap-3">
                  <Donut fatias={distribuicao} className="h-16 w-16" rotuloCentral={false} />
                  <ul className="grid gap-1">
                    {distribuicao.map((f) => (
                      <li key={f.rotulo} className="flex items-center gap-1.5 text-[8px] text-escuro/60">
                        <i className={`h-1.5 w-1.5 rounded-sm ${COR_SITUACAO[f.rotulo].ponto}`} />
                        {f.rotulo}
                        <b className="ml-auto pl-2 text-escuro">{f.valor}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-2 grid gap-2 md:grid-cols-[1.35fr_1fr]">
              <div className={`${painel} p-3`}>
                <p className="text-[10px] font-semibold">Documentos que exigem atenção</p>
                <ul className="mt-2 divide-y divide-escuro/5">
                  {atencao.map((d) => (
                    <li key={d.nome} className="flex items-center gap-2 py-1.5 text-[8px]">
                      <span className="min-w-0 flex-1">
                        <b className="block truncate font-medium">{d.nome}</b>
                        <span className="text-escuro/50">
                          {d.unidade} · {d.prazo}
                        </span>
                      </span>
                      <BadgeStatus tom={tomDocumento[d.situacao]} className="px-1.5! py-0.5! text-[7px]!">
                        {d.situacao}
                      </BadgeStatus>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${painel} hidden p-3 md:block`}>
                <p className="text-[10px] font-semibold">Atividade recente</p>
                <ul className="mt-2 divide-y divide-escuro/5">
                  {recentes.map((a) => (
                    <li key={a.texto} className="flex items-start gap-2 py-1.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-campo/40 text-painel">
                        <Icone nome={a.icone} className="h-2.5 w-2.5" />
                      </span>
                      <span className="flex-1 text-[8px] leading-snug">{a.texto}</span>
                      <span className="whitespace-nowrap text-[7px] text-escuro/50">{a.quando}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
