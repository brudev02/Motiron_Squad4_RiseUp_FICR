"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Icone, type NomeIcone } from "./Icones";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /** Texto acima do campo (usado nos formulários de cadastro e senha). */
  rotulo?: string;
  icone?: NomeIcone;
  divisor?: boolean;
  /** Campo de senha, com botão de mostrar/ocultar. */
  senha?: boolean;
  olho?: boolean;
};

// Campo de formulário das telas de acesso (login, cadastro, redefinição).
export function Campo({
  rotulo,
  icone,
  divisor = false,
  senha = false,
  olho = true,
  className = "",
  id,
  ...resto
}: Props) {
  const [visivel, setVisivel] = useState(false);
  const idGerado = useId();
  const idCampo = id ?? idGerado;

  const tipo = senha
    ? visivel
      ? "text"
      : "password"
    : (resto.type ?? "text");

  // Sem rótulo, o próprio campo é um <label> (clicar no ícone foca o input).
  const Envoltorio = rotulo ? "div" : "label";

  const controle = (
    <Envoltorio
      className={`flex h-10 items-center overflow-hidden rounded-xl bg-campo text-escuro shadow-[0_4px_6px_rgba(0,0,0,0.35)] focus-within:ring-2 focus-within:ring-white ${className}`}
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
        id={idCampo}
        type={tipo}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-escuro/60"
      />

      {senha && olho && (
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Esconder senha" : "Mostrar senha"}
          className="px-3 text-escuro/70 hover:text-escuro"
        >
          <Icone nome={visivel ? "olhoFechado" : "olho"} />
        </button>
      )}
    </Envoltorio>
  );

  if (!rotulo) return controle;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={idCampo} className="text-xs text-white">
        {rotulo}
      </label>
      {controle}
    </div>
  );
}
