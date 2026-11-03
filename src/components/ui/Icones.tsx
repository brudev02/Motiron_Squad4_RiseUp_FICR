import type { ReactNode } from "react";

// Conjunto único de ícones da Adgestion (landing, telas de acesso e
// dashboard). Cada ícone é um desenho SVG simples, só de traços.

export type NomeIcone =
  // acesso e formulários
  | "usuario"
  | "cadeado"
  | "email"
  | "arroba"
  | "olho"
  | "olhoFechado"
  | "info"
  | "checkCirculo"
  | "telefone"
  | "grafico"
  // navegação e produto
  | "grid"
  | "predio"
  | "documento"
  | "tarefas"
  | "equipe"
  | "config"
  | "busca"
  | "sino"
  | "pasta"
  | "escudo"
  | "check"
  | "seta"
  // ações do dashboard
  | "mais"
  | "lapis"
  | "lixeira"
  | "fechar"
  | "menu"
  | "sair"
  | "relogio"
  | "alerta"
  | "baixar";

const desenhos: Record<NomeIcone, ReactNode> = {
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  cadeado: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  arroba: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </>
  ),
  olho: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  olhoFechado: (
    <path d="M3 3l18 18M10 6.2A9.8 9.8 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.5 7.5C3.7 9.3 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  checkCirculo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  telefone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  grafico: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />,

  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
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
  pasta: (
    <path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  escudo: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,

  mais: <path d="M12 5v14M5 12h14" />,
  lapis: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4" />,
  lixeira: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sair: <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9" />,
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  baixar: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
};

export function Icone({
  nome,
  className = "h-4 w-4",
}: {
  nome: NomeIcone;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {desenhos[nome]}
    </svg>
  );
}
