
type Props = {
  atual: 1 | 2 | 3;
};

export function Etapas({ atual }: Props) {
  return (
    <div
      className="flex items-center justify-center"
      aria-label={`Etapa ${atual} de 3`}
    >
      {[1, 2, 3].map((numero, posicao) => (
        <div key={numero} className="flex items-center">
          {posicao > 0 && <span className="h-px w-10 bg-white/60" />}

          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${numero === atual ? "bg-destaque" : "bg-black"}`}
          >
            {numero}
          </span>
        </div>
      ))}
    </div>
  );
}
