// Helper de requisições JSON para componentes de cliente. Nunca lança erro:
// falhas de rede e respostas sem JSON viram um resultado normal.

export type RespostaHttp = {
  ok: boolean;
  status: number;
  /** Corpo JSON (ou null se vazio/inválido). */
  json: Record<string, unknown> | null;
  /** true quando nem chegou ao servidor (offline, servidor desligado...). */
  falhaDeRede: boolean;
};

export async function enviarJson(
  url: string,
  metodo: "POST" | "PUT" | "PATCH" | "DELETE",
  corpo?: unknown
): Promise<RespostaHttp> {
  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });

    const texto = (await resposta.text()).trim();
    let json: Record<string, unknown> | null = null;

    if (texto) {
      try {
        const lido: unknown = JSON.parse(texto);
        json = typeof lido === "object" && lido !== null ? (lido as Record<string, unknown>) : null;
      } catch {
        json = null;
      }
    }

    return { ok: resposta.ok, status: resposta.status, json, falhaDeRede: false };
  } catch {
    return { ok: false, status: 0, json: null, falhaDeRede: true };
  }
}

/** Primeira mensagem de erro de uma resposta ({ erro } ou { erros: {...} }). */
export function primeiraMensagem(
  json: Record<string, unknown> | null,
  padrao: string
): string {
  if (!json) return padrao;

  if (typeof json.erro === "string" && json.erro) return json.erro;

  if (typeof json.erros === "object" && json.erros !== null) {
    const primeira = Object.values(json.erros as Record<string, unknown>)
      .flat()
      .find((valor): valor is string => typeof valor === "string");
    if (primeira) return primeira;
  }

  return padrao;
}

/** Erros por campo ({ nome: "mensagem" }) de uma resposta { erros: {...} }. */
export function errosDeCampo(
  json: Record<string, unknown> | null
): Record<string, string> {
  const resultado: Record<string, string> = {};

  if (json && typeof json.erros === "object" && json.erros !== null) {
    for (const [campo, mensagens] of Object.entries(json.erros)) {
      const primeira = Array.isArray(mensagens) ? mensagens[0] : undefined;
      if (typeof primeira === "string") resultado[campo] = primeira;
    }
  }

  return resultado;
}
