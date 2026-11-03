import type { PontoAtividade } from "@/lib/dashboard/tipos";

type Props = {
  pontos: PontoAtividade[];
  /** Classes de altura da área das barras, ex.: "h-48". */
  className?: string;
  /** Rótulos dos meses menores (usado na prévia da landing page). */
  compacto?: boolean;
};

function altura(valor: number, maximo: number): string {
  if (valor === 0) return "0%";
  // Mínimo de 6% para que valores pequenos continuem visíveis.
  return `${Math.max(6, (valor / maximo) * 100)}%`;
}

// Barras de atividades por mês (concluídas x em aberto). Componente de
// servidor, sem estado: recebe os números prontos.
export function BarrasAtividade({ pontos, className = "h-48", compacto = false }: Props) {
  const maximo = Math.max(1, ...pontos.flatMap((p) => [p.concluidas, p.emAberto]));
  const totalConcluidas = pontos.reduce((s, p) => s + p.concluidas, 0);
  const totalEmAberto = pontos.reduce((s, p) => s + p.emAberto, 0);

  return (
    <div
      role="img"
      aria-label={`Atividades por mês: ${totalConcluidas} concluídas e ${totalEmAberto} em aberto no período`}
      className={`flex gap-1.5 border-b border-escuro/10 ${className}`}
    >
      {pontos.map((ponto) => (
        <div
          key={ponto.rotulo}
          className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
        >
          <div className="relative w-full flex-1">
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center gap-0.5">
              <div
                className="w-2/5 max-w-5 rounded-t bg-painel"
                style={{ height: altura(ponto.concluidas, maximo) }}
                title={`${ponto.rotulo}: ${ponto.concluidas} concluídas`}
              />
              <div
                className="w-2/5 max-w-5 rounded-t bg-campo"
                style={{ height: altura(ponto.emAberto, maximo) }}
                title={`${ponto.rotulo}: ${ponto.emAberto} em aberto`}
              />
            </div>
          </div>
          <span
            className={`pb-1 text-escuro/50 ${compacto ? "text-[7px]" : "text-[10px]"}`}
          >
            {ponto.rotulo}
          </span>
        </div>
      ))}
    </div>
  );
}
