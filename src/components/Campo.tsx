"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Icone, type NomeIcone } from "./Icones";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icone?: NomeIcone;
  divisor?: boolean;
  senha?: boolean;
  olho?: boolean;
};

export function Campo({
    icone,
    divisor = false,
    senha = false,
    olho = true,
    className = "",
    ...resto
}: Props) {
    const [visivel, setVisivel] = useState(false);

    const tipo = senha
      ? visivel
        ? "text"
        : "password"
      : (resto.type ?? "text");

    return (
      <label
        className={`flex h-10 items-center overflow-hidden rounded-xl bg-campo text-escuro shadow-[0_4px_6px_rgba(0,0,0,0.35)] ${className}`}
      >
        {icone && (
          <span
            className={`flex h-full w-12 shrink-0 items-center justify-center text-escuro/70 ${divisor ? "border-r border-escuro/20" : ""}`}
          >
            <Icone nome={icone} />
          </span>
        )}

        <input
          {...resto}
          type={tipo}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-escuro/60"
        />

        {senha && olho && (
          <button
            type="button"
            onClick={() => setVisivel((v) => !v)}
            aria-label={visivel ? "Esconder senha" : "Mostrar senha"}
            className="px-3 text-escuro/70"
          >
            <Icone nome={visivel ? "olhoFechado" : "olho"} />
          </button>
        )}
      </label>
    );
}