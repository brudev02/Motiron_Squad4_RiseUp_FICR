"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviarJson } from "@/lib/http";
import { useToast } from "./ui/Toast";

// Encerra a sessão (apaga o cookie no servidor) e volta para /login.
export function useSair() {
  const router = useRouter();
  const { notificar } = useToast();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    if (saindo) return;
    setSaindo(true);

    const resposta = await enviarJson("/api/logout", "POST");

    if (!resposta.ok) {
      setSaindo(false);
      notificar("Não foi possível encerrar a sessão. Tente novamente.", "erro");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return { sair, saindo };
}
