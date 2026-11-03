import type { ReactNode } from "react";
import { Icone, type NomeIcone } from "@/components/ui/Icones";
import { CARTAO } from "../estilos";

// Pequenos blocos de layout repetidos em todas as seções do dashboard.
// Sem estado nem eventos: servem Server e Client Components.

export function CabecalhoSecao({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{titulo}</h1>
        <p className="mt-1 text-xs text-escuro/60">{descricao}</p>
      </div>
      {acao}
    </div>
  );
}

const tonsIcone = {
  destaque: "bg-campo/40 text-painel",
  ok: "bg-ok-fundo text-ok",
  aviso: "bg-aviso-fundo text-aviso",
  perigo: "bg-perigo-fundo text-perigo",
} as const;

export type TomIndicador = keyof typeof tonsIcone;

export function CartaoIndicador({
  titulo,
  valor,
  nota,
  icone,
  tom = "destaque",
}: {
  titulo: string;
  valor: string | number;
  nota: string;
  icone: NomeIcone;
  tom?: TomIndicador;
}) {
  return (
    <article className={`${CARTAO} p-5`}>
      <div className="flex items-start justify-between gap-3 text-xs text-escuro/60">
        {titulo}
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tonsIcone[tom]}`}
        >
          <Icone nome={icone} className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{valor}</p>
      <p className="mt-1 text-[11px] text-escuro/50">{nota}</p>
    </article>
  );
}

export function EstadoVazio({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <p className="text-sm font-semibold">{titulo}</p>
      <p className="max-w-sm text-xs text-escuro/60">{texto}</p>
      {acao && <div className="mt-3">{acao}</div>}
    </div>
  );
}

export function SeloExemplo() {
  return (
    <span
      title="Registro criado pelos dados de exemplo (Configurações)"
      className="ml-2 rounded bg-escuro/5 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-escuro/50"
    >
      Exemplo
    </span>
  );
}
