"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Controla qual registro está aberto no modal: "novo", um registro existente
// (edição) ou nenhum. `abrirNovoInicial` vem de ?novo=1 (atalho "Novo
// registro" da Visão geral); ao fechar, o parâmetro é removido da URL.
export function useEdicao<T>(rota: string, abrirNovoInicial = false) {
  const router = useRouter();
  const [alvo, setAlvo] = useState<T | "novo" | null>(abrirNovoInicial ? "novo" : null);

  return {
    alvo,
    novo: () => setAlvo("novo"),
    editar: (registro: T) => setAlvo(registro),
    fechar: () => {
      setAlvo(null);
      if (abrirNovoInicial) router.replace(rota);
    },
  };
}
