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
            <label htmlFor={nome} className="text-sm text-white">
            {label}
            </label>

            <div className="flex">
                <input
                id={nome}
                name={nome}
                type={mostrarSenha ? "text" : "password"}
                placeholder={placeholder}
                required
                className="min-w-0 flex-1 rounded-l-xl border border-indigo-300/20 bg-indigo-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-400"/>

                <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="rounded-r-xl border border-l-0 border-indigo-300/20 px-4 text-white">
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
            </div>
        </div>
    );
}