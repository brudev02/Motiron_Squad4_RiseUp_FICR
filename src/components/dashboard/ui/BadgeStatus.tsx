import type { ReactNode } from "react";
import type {
  Prioridade,
  SituacaoDocumento,
  SituacaoUnidade,
  StatusTarefa,
} from "@/lib/dashboard/tipos";

export type TomStatus = "ok" | "aviso" | "perigo" | "neutro" | "info";

const classes: Record<TomStatus, string> = {
  ok: "bg-ok-fundo text-ok",
  aviso: "bg-aviso-fundo text-aviso",
  perigo: "bg-perigo-fundo text-perigo",
  neutro: "bg-escuro/5 text-escuro/60",
  info: "bg-campo/40 text-painel",
};

export const tomDocumento: Record<SituacaoDocumento, TomStatus> = {
  Vigente: "ok",
  "Em análise": "info",
  "A vencer": "aviso",
  Vencido: "perigo",
};

export const tomUnidade: Record<SituacaoUnidade, TomStatus> = {
  Ativa: "ok",
  Inativa: "neutro",
};

export const tomStatusTarefa: Record<StatusTarefa, TomStatus> = {
  Pendente: "neutro",
  "Em andamento": "info",
  Concluída: "ok",
};

export const tomPrioridade: Record<Prioridade, TomStatus> = {
  Baixa: "neutro",
  Média: "aviso",
  Alta: "perigo",
};

type Props = {
  tom: TomStatus;
  children: ReactNode;
  className?: string;
};

// Selo de status. Sem estado nem eventos: também é usado na landing page.
export function BadgeStatus({ tom, children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes[tom]} ${className}`}
    >
      {children}
    </span>
  );
}
