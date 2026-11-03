"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BotaoPrincipal } from "@/components/ui/BotaoPrincipal";
import type { Perfil } from "@/lib/dashboard/tipos";

const perfis: { id: Perfil; nome: string; imagem: string }[] = [
  { id: "empresa", nome: "Empresa", imagem: "/ilustracoes/empresa.svg" },
  { id: "funcionario", nome: "Funcionário", imagem: "/ilustracoes/funcionario.svg" },
];

// Etapa 1 do cadastro: escolha do perfil. "Próximo" leva ao formulário
// (etapa 2) do perfil escolhido.
export function SeletorPerfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="text-lg">Escolha uma opção de perfil</h2>

      <div className="flex gap-4" role="group" aria-label="Perfil">
        {perfis.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPerfil(p.id)}
            aria-pressed={perfil === p.id}
            className={`relative h-24 w-24 overflow-hidden rounded-xl bg-campo shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              perfil === p.id ? "ring-2 ring-white" : "opacity-90 hover:opacity-100"
            }`}
          >
            <Image src={p.imagem} alt="" fill className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-white/70 py-0.5 text-center text-xs font-bold text-escuro">
              {p.nome}
            </span>
          </button>
        ))}
      </div>

      <BotaoPrincipal
        desabilitado={!perfil}
        onClick={() => perfil && router.push(`/cadastro/${perfil}`)}
      >
        Próximo
      </BotaoPrincipal>
    </div>
  );
}
