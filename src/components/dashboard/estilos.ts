// Classes reutilizadas pelo dashboard. Usam apenas os tokens do design system
// (globals.css): escuro, painel, campo, destaque, fundo-claro e os estados
// ok / aviso / perigo.

export const CARTAO = "rounded-2xl border border-escuro/10 bg-white shadow-sm";

const BOTAO_BASE =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque disabled:cursor-not-allowed disabled:opacity-60";

export const BOTAO_PRIMARIO = `${BOTAO_BASE} bg-painel text-white hover:bg-escuro`;
export const BOTAO_SECUNDARIO = `${BOTAO_BASE} border border-escuro/15 bg-white text-escuro hover:bg-escuro/5`;
export const BOTAO_PERIGO = `${BOTAO_BASE} bg-perigo text-white hover:brightness-110`;

export const BOTAO_ICONE =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-escuro/60 transition hover:bg-escuro/5 hover:text-escuro focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-destaque disabled:opacity-50";

export const CONTROLE =
  "h-10 w-full rounded-lg border border-escuro/15 bg-white px-3 text-sm text-escuro outline-none transition placeholder:text-escuro/40 focus:border-destaque focus:ring-2 focus:ring-destaque/30";

export const TH =
  "whitespace-nowrap px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-escuro/50";
export const TD = "px-3 py-3.5 align-middle";
