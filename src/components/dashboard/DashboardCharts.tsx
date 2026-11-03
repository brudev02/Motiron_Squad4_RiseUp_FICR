"use client";

import { useState } from "react";
import Link from "next/link";
import type { FatiaDistribuicao, PontoAtividade } from "@/lib/dashboard/tipos";
import { CARTAO } from "./estilos";
import { BarrasAtividade } from "./graficos/BarrasAtividade";
import { COR_SITUACAO, Donut } from "./graficos/Donut";

type Props = {
  atividade6m: PontoAtividade[];
  atividadeAno: PontoAtividade[];
  distribuicao: FatiaDistribuicao[];
};

type Periodo = "6m" | "ano";

// Gráficos da Visão geral. Client Component só por causa do seletor de
// período; os desenhos em si (BarrasAtividade e Donut) são componentes puros.
export function DashboardCharts({ atividade6m, atividadeAno, distribuicao }: Props) {
  const [periodo, setPeriodo] = useState<Periodo>("6m");

  const pontos = periodo === "6m" ? atividade6m : atividadeAno;
  const semTarefas = pontos.every((p) => p.concluidas === 0 && p.emAberto === 0);
  const totalDocumentos = distribuicao.reduce((soma, f) => soma + f.valor, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
      <section className={`${CARTAO} p-5`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Visão de atividades</h2>
            <p className="mt-1 text-[11px] text-escuro/50">
              Tarefas por mês (pelo prazo)
            </p>
          </div>
          <select
            value={periodo}
            onChange={(evento) => setPeriodo(evento.target.value as Periodo)}
            aria-label="Período do gráfico"
            className="h-9 rounded-lg border border-escuro/15 bg-white px-2 text-xs text-escuro outline-none focus:border-destaque focus:ring-2 focus:ring-destaque/30"
          >
            <option value="6m">Últimos 6 meses</option>
            <option value="ano">Este ano</option>
          </select>
        </div>

        {semTarefas ? (
          <p className="flex h-48 items-center justify-center rounded-xl bg-escuro/[0.03] px-6 text-center text-xs text-escuro/60">
            Ainda não há tarefas neste período. Cadastre tarefas com prazo para
            acompanhar a evolução aqui.
          </p>
        ) : (
          <BarrasAtividade pontos={pontos} />
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-escuro/60">
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-painel" /> Concluídas
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-campo" /> Em aberto
          </span>
        </div>
      </section>

      <section className={`${CARTAO} p-5`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Status dos documentos</h2>
            <p className="mt-1 text-[11px] text-escuro/50">Distribuição por situação</p>
          </div>
          <Link
            href="/dashboard/documentos"
            className="text-[11px] font-semibold text-painel hover:underline"
          >
            Ver documentos
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 py-2">
          <Donut fatias={distribuicao} />

          <ul className="grid min-w-36 gap-3">
            {distribuicao.map((fatia) => (
              <li key={fatia.rotulo} className="flex items-center gap-2 text-xs text-escuro/60">
                <i className={`h-2.5 w-2.5 rounded-sm ${COR_SITUACAO[fatia.rotulo].ponto}`} />
                {fatia.rotulo}
                <b className="ml-auto pl-4 text-escuro">{fatia.valor}</b>
              </li>
            ))}
          </ul>
        </div>

        {totalDocumentos === 0 && (
          <p className="mt-3 text-center text-[11px] text-escuro/50">
            Nenhum documento cadastrado ainda.
          </p>
        )}
      </section>
    </div>
  );
}
