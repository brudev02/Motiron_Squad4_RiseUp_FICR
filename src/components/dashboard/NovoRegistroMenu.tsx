
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icone, type NomeIcone } from "@/components/ui/Icones";
import { BOTAO_PRIMARIO } from "./estilos";

const opcoes: { href: string; nome: string; icone: NomeIcone }[] = [
  { href: "/dashboard/unidades?novo=1", nome: "Nova unidade", icone: "predio" },
  { href: "/dashboard/documentos-nova?novo=1", nome: "Novo documento", icone: "documento" },
  { href: "/dashboard/tarefas?novo=1", nome: "Nova tarefa", icone: "tarefas" },
];

// Atalho "Novo registro" da Visão geral: leva à seção escolhida já com o
// formulário de cadastro aberto (?novo=1).
export function NovoRegistroMenu() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        className={BOTAO_PRIMARIO}
      >
        <Icone nome="mais" /> Novo registro
      </button>

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            role="menu"
            className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-escuro/10 bg-white py-1 shadow-xl"
          >
            {opcoes.map((opcao) => (
              <li key={opcao.href} role="none">
                <Link
                  href={opcao.href}
                  role="menuitem"
                  onClick={() => setAberto(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-escuro/5"
                >
                  <Icone nome={opcao.icone} className="h-4 w-4 text-painel" />
                  {opcao.nome}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
