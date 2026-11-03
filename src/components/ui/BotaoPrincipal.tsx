import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Ocupa toda a largura (usado dentro de formulários). */
  largura?: "total";
  /** Mostra o texto de carregamento e bloqueia novos cliques. */
  carregando?: boolean;
  desabilitado?: boolean;
};

// Botão principal (verde "destaque") das telas de acesso.
export function BotaoPrincipal({
  children,
  href,
  onClick,
  type = "button",
  largura,
  carregando = false,
  desabilitado = false,
}: Props) {
  const estilo = `inline-flex h-9 items-center justify-center rounded-full bg-destaque px-10 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-70 ${
    largura === "total" ? "h-10 w-full" : "min-w-40"
  }`;

  if (href) {
    return (
      <Link href={href} className={estilo}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={carregando || desabilitado}
      aria-busy={carregando}
      className={estilo}
    >
      {children}
    </button>
  );
}
