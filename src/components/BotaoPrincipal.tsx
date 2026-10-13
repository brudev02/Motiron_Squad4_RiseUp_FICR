
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function BotaoPrincipal({
  children,
  href,
  onClick,
  type = "button",
}: Props) {
  const estilo =
    "inline-flex h-9 min-w-40 items-center justify-center rounded-full bg-destaque px-10 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition hover:brightness-110";

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
      className={estilo}>
      {children}
    </button>
  );
}
