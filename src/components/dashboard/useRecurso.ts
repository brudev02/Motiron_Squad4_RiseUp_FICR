"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enviarJson, errosDeCampo, primeiraMensagem } from "@/lib/http";
import { useToast } from "./ui/Toast";

export type RespostaApi =
  | { ok: true }
  | { ok: false; erros: Record<string, string>; mensagem: string };

type Mensagens = {
  criado: string;
  atualizado: string;
  excluido: string;
};

// Cadastro, edição e exclusão de um recurso (unidades, documentos, tarefas)
// via API. Depois de cada operação mostra o toast e pede ao Next.js para
// recarregar os dados do servidor (router.refresh): a tela sempre mostra o
// que realmente está no banco.
export function useRecurso(base: string, mensagens: Mensagens) {
  const router = useRouter();
  const { notificar } = useToast();
  const [ocupado, setOcupado] = useState(false);
  const [atualizando, iniciarAtualizacao] = useTransition();

  function recarregar() {
    iniciarAtualizacao(() => router.refresh());
  }

  async function executar(
    metodo: "POST" | "PUT" | "DELETE",
    url: string,
    corpo?: unknown
  ): Promise<RespostaApi> {
    setOcupado(true);
    const resposta = await enviarJson(url, metodo, corpo);
    setOcupado(false);

    if (resposta.ok) return { ok: true };

    if (resposta.status === 401) {
      // Sessão expirou: o servidor manda de volta para o login.
      router.replace("/login");
      return { ok: false, erros: {}, mensagem: "Sessão expirada." };
    }

    const mensagem = resposta.falhaDeRede
      ? "Não foi possível conectar ao servidor. Tente novamente."
      : primeiraMensagem(resposta.json, "Não foi possível concluir a operação.");

    const erros = errosDeCampo(resposta.json);
    if (Object.keys(erros).length === 0 || erros.geral) erros.geral = mensagem;

    return { ok: false, erros, mensagem };
  }

  /** Cria (id = null) ou atualiza um registro. */
  async function salvar(id: string | null, dados: unknown): Promise<RespostaApi> {
    const resposta = id
      ? await executar("PUT", `${base}/${id}`, dados)
      : await executar("POST", base, dados);

    if (resposta.ok) {
      notificar(id ? mensagens.atualizado : mensagens.criado);
      recarregar();
    }

    return resposta;
  }

  /** Exclui um registro. Devolve true se deu certo. */
  async function excluir(id: string): Promise<boolean> {
    const resposta = await executar("DELETE", `${base}/${id}`);

    if (resposta.ok) {
      notificar(mensagens.excluido);
      recarregar();
      return true;
    }

    notificar(resposta.mensagem, "erro");
    return false;
  }

  return { salvar, excluir, ocupado: ocupado || atualizando };
}
