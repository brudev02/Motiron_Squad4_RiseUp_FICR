import { NextResponse } from "next/server";
import { obterUsuarioAtual } from "@/lib/sessao";
import {
  errosPorCampo,
  type Validador,
} from "@/lib/validacao/dashboard";
import type { UsuarioSessao } from "@/lib/dashboard/tipos";

// Utilitários das rotas de API do dashboard.

/** Erro "esperado" (validação, sessão, registro inexistente...). */
export class ErroApi extends Error {
  constructor(
    public status: number,
    public erros: Record<string, string[]>
  ) {
    super(Object.values(erros).flat()[0] ?? "Erro na requisição.");
    this.name = "ErroApi";
  }
}

export function erroGeral(status: number, mensagem: string) {
  return new ErroApi(status, { geral: [mensagem] });
}

/** Garante que existe sessão válida; senão responde 401. */
export async function exigirUsuarioApi(): Promise<UsuarioSessao> {
  const usuario = await obterUsuarioAtual();
  if (!usuario) {
    throw erroGeral(401, "Sessão inválida ou expirada. Entre novamente.");
  }
  return usuario;
}

/** Valida o corpo da requisição com o schema; lança 400 com erros por campo. */
export async function lerEValidar<T>(
  req: Request,
  schema: Validador<T>
): Promise<T> {
  const corpo: unknown = await req.json().catch(() => null);
  const resultado = schema.safeParse(corpo);

  if (!resultado.success) {
    throw new ErroApi(400, errosPorCampo(resultado.error.issues));
  }

  return resultado.data;
}

/** Transforma qualquer erro em uma resposta JSON padronizada. */
export function responderErro(erro: unknown): NextResponse {
  if (erro instanceof ErroApi) {
    return NextResponse.json(
      { erro: erro.message, erros: erro.erros },
      { status: erro.status }
    );
  }

  console.error("Erro inesperado na API:", erro);
  return NextResponse.json(
    { erro: "Erro interno do servidor.", erros: { geral: ["Erro interno do servidor."] } },
    { status: 500 }
  );
}
