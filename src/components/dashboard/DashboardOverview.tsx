import { horaAtual, FUSO } from "@/lib/dashboard/datas";
import type { Resumo } from "@/lib/dashboard/tipos";
import { AtividadeRecente, DocumentosAtencao } from "./DashboardAttention";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardStats } from "./DashboardStats";
import { NovoRegistroMenu } from "./NovoRegistroMenu";

function saudacao(): string {
  const hora = horaAtual();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function diaDaSemana(): string {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: FUSO }).format(
    new Date()
  );
}

// Visão geral da operação: saudação, indicadores, gráficos, documentos que
// exigem atenção e atividade recente. Server Component: recebe o resumo
// calculado a partir do banco.
export function DashboardOverview({
  resumo,
  primeiroNome,
}: {
  resumo: Resumo;
  primeiroNome: string;
}) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-destaque">
            {diaDaSemana()}, visão executiva
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {saudacao()}, {primeiroNome}!
          </h1>
          <p className="mt-1 text-xs text-escuro/60">
            Acompanhe os principais indicadores da sua operação.
          </p>
        </div>

        <NovoRegistroMenu />
      </div>

      <DashboardStats totais={resumo.totais} />

      <DashboardCharts
        atividade6m={resumo.atividade6m}
        atividadeAno={resumo.atividadeAno}
        distribuicao={resumo.distribuicao}
      />

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <DocumentosAtencao documentos={resumo.atencao} />
        <AtividadeRecente atividades={resumo.recentes} />
      </div>
    </div>
  );
}
