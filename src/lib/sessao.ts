import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import type { Perfil, UsuarioSessao } from "@/lib/dashboard/tipos";

// Sessão da Adgestion: um JWT (HS256) assinado com JWT_SECRET, guardado no
// cookie httpOnly "sessao". A validação acontece SEMPRE no servidor:
// layouts/páginas do dashboard e todas as APIs chamam obterUsuarioAtual().

export const COOKIE_SESSAO = "sessao";

const DURACAO_LEMBRAR_SEGUNDOS = 60 * 60 * 24 * 7; // 7 dias
const SEGREDO_DE_EXEMPLO = "troque-por-uma-string-longa-e-aleatoria";

export class ErroConfiguracao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroConfiguracao";
  }
}

/**
 * Lê o segredo do JWT. Nunca usa um valor padrão: sem JWT_SECRET (ou com um
 * segredo fraco em produção) a autenticação simplesmente não funciona.
 */
function obterSegredo(): Uint8Array {
  const segredo = process.env.JWT_SECRET?.trim();

  if (!segredo) {
    throw new ErroConfiguracao(
      "JWT_SECRET não está definida. Crie o arquivo .env a partir de .env.example."
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    (segredo.length < 32 || segredo === SEGREDO_DE_EXEMPLO)
  ) {
    throw new ErroConfiguracao(
      "JWT_SECRET insegura para produção: use uma string aleatória com no mínimo 32 caracteres."
    );
  }

  return new TextEncoder().encode(segredo);
}

/** Gera o token de sessão. "Lembrar de mim" = 7 dias; senão, 12 horas. */
export async function criarToken(
  usuarioId: string,
  lembrar: boolean
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(usuarioId)
    .setIssuedAt()
    .setExpirationTime(lembrar ? "7d" : "12h")
    .sign(obterSegredo());
}

/**
 * Opções do cookie de sessão. Sem "lembrar" o cookie não tem maxAge e some
 * quando o navegador é fechado.
 */
export function opcoesCookieSessao(lembrar: boolean) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(lembrar ? { maxAge: DURACAO_LEMBRAR_SEGUNDOS } : {}),
  };
}

/** Verifica assinatura e validade do token. Devolve o id do usuário ou null. */
export async function verificarToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, obterSegredo(), {
      algorithms: ["HS256"],
    });

    return typeof payload.sub === "string" ? payload.sub : null;
  } catch (erro) {
    // Falha fechada: configuração ausente ou token inválido = sem sessão.
    if (erro instanceof ErroConfiguracao) {
      console.error(`[sessao] ${erro.message}`);
    }
    return null;
  }
}

/**
 * Usuário da sessão atual (ou null). Confere o token no servidor e também
 * se a conta ainda existe no banco. `cache` evita repetir a consulta na
 * mesma requisição (layout + página).
 */
export const obterUsuarioAtual = cache(
  async (): Promise<UsuarioSessao | null> => {
    const token = (await cookies()).get(COOKIE_SESSAO)?.value;
    if (!token) return null;

    const usuarioId = await verificarToken(token);
    if (!usuarioId) return null;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true, email: true, perfil: true, criadoEm: true },
    });

    if (!usuario) return null;

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil === "funcionario" ? ("funcionario" as Perfil) : "empresa",
      criadoEm: usuario.criadoEm.toISOString(),
    };
  }
);

/** Para layouts e páginas protegidos: sem sessão válida, vai para /login. */
export async function exigirUsuario(): Promise<UsuarioSessao> {
  const usuario = await obterUsuarioAtual();
  if (!usuario) redirect("/login");
  return usuario;
}
