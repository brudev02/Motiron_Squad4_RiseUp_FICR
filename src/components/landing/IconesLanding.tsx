import type { ReactNode } from "react";

export type NomeIconeLanding =
  | "predio"
  | "documento"
  | "tarefas"
  | "check"
  | "seta"
  | "grid"
  | "equipe"
  | "config"
  | "busca"
  | "sino"
  | "pasta"
  | "escudo";

// Desenhos SVG só com traços, no mesmo estilo de src/components/Icones.tsx
const desenhos: Record<NomeIconeLanding, ReactNode> = {
  predio: <path d="M4 21V5l8-2v18M12 9h8v12M3 21h18M7 9h2M7 13h2M7 17h2" />,
  documento: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  tarefas: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7 9 1.5 1.5L11 8M7 15l1.5 1.5L11 14M14 9h4M14 15h4" />
    </>
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  equipe: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 3-5.5 6-5.5s6 2 6 5.5M15 14.5c3 0 6 1.5 6 5" />
    </>
  ),
  config: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  busca: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </>
  ),
  sino: <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" />,
  pasta: <path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  escudo: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
};

type Props = {
  nome: NomeIconeLanding;
  className?: string;
};

export function IconeLanding({ nome, className = "h-4 w-4" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {desenhos[nome]}
    </svg>
  );
}
