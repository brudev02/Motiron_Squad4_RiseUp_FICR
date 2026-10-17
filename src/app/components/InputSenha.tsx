"use client";

import { useState } from "react";

interface InputSenhaProps {
  label: string;
  nome: string;
  placeholder: string;
}

export default function InputSenha({
    label,
    nome,
    placeholder,
}: InputSenhaProps) {
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={nome} className="text-xs text-white">
        {label}
      </label>

      <div className="flex h-10 overflow-hidden rounded-xl bg-campo shadow-[0_4px_6px_rgba(0,0,0,0.35)]">
        <input
          id={nome}
          name={nome}
          type={mostrarSenha ? "text" : "password"}
          placeholder={placeholder}
          required
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-escuro placeholder:text-escuro/60 outline-none focus-visible:ring-2 focus-visible:ring-destaque"
        />

        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          className="px-3 text-xs text-escuro/70"
        >
          {mostrarSenha ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}