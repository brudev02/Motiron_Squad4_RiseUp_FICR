import type { FatiaDistribuicao, SituacaoDocumento } from "@/lib/dashboard/tipos";

// Cores de cada situação de documento (traço do gráfico e ponto da legenda).
// As classes aparecem por extenso para o Tailwind gerá-las.
export const COR_SITUACAO: Record<SituacaoDocumento, { traco: string; ponto: string }> = {
  Vigente: { traco: "stroke-painel", ponto: "bg-painel" },
  "Em análise": { traco: "stroke-campo", ponto: "bg-campo" },
  "A vencer": { traco: "stroke-ambar", ponto: "bg-ambar" },
  Vencido: { traco: "stroke-perigo", ponto: "bg-perigo" },
};

type Props = {
  fatias: FatiaDistribuicao[];
  /** Classes de tamanho do gráfico, ex.: "h-36 w-36". */
  className?: string;
  /** Mostra o total e a palavra "documentos" no centro. */
  rotuloCentral?: boolean;
};

// Rosca de distribuição dos documentos. Componente de servidor, sem estado:
// recebe os números prontos (reais no dashboard, ilustrativos na landing).
export function Donut({ fatias, className = "h-36 w-36", rotuloCentral = true }: Props) {
  const total = fatias.reduce((soma, f) => soma + f.valor, 0);

  // Cada arco começa onde o anterior termina (em % da circunferência).
  const arcos = fatias
    .filter((fatia) => fatia.valor > 0)
    .reduce<{ fatia: FatiaDistribuicao; inicio: number; percentual: number }[]>(
      (lista, fatia) => {
        const anterior = lista[lista.length - 1];
        const inicio = anterior ? anterior.inicio + anterior.percentual : 0;
        return [...lista, { fatia, inicio, percentual: (fatia.valor / total) * 100 }];
      },
      []
    );

  return (
    <div
      className={`relative shrink-0 ${className}`}
      role="img"
      aria-label={
        total === 0
          ? "Nenhum documento cadastrado"
          : `Distribuição de ${total} documentos: ` +
            fatias.map((f) => `${f.valor} ${f.rotulo.toLowerCase()}`).join(", ")
      }
    >
      <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90" aria-hidden="true">
        {/* trilho de fundo */}
        <circle
          cx="21"
          cy="21"
          r="15.9155"
          fill="none"
          strokeWidth="6"
          className="stroke-escuro/10"
        />

        {arcos.map(({ fatia, inicio, percentual }) => (
          <circle
            key={fatia.rotulo}
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            strokeWidth="6"
            pathLength={100}
            strokeDasharray={`${percentual} ${100 - percentual}`}
            strokeDashoffset={-inicio}
            className={COR_SITUACAO[fatia.rotulo].traco}
          />
        ))}
      </svg>

      {rotuloCentral && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <strong className="text-2xl font-semibold leading-none">{total}</strong>
          <span className="mt-1 text-[10px] text-escuro/50">documentos</span>
        </div>
      )}
    </div>
  );
}
