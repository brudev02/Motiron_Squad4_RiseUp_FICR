import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  COOKIE_SESSAO,
  ErroConfiguracao,
  criarToken,
  opcoesCookieSessao,
} from "@/lib/sessao";
import { loginSchema } from "@/lib/validacao/auth";

// Quando o e-mail não existe, a senha é comparada com um hash descartável:
// o tempo de resposta não revela quais e-mails possuem conta. Gerado uma
// única vez, sob demanda.
let hashDescartavel: Promise<string> | undefined;

function obterHashDescartavel() {
  hashDescartavel ??= bcrypt.hash("adgestion-sem-conta", 12);
  return hashDescartavel;
}

export async function POST(req: Request) {
  try {
    const corpo: unknown = await req.json().catch(() => null);
    const validacao = loginSchema.safeParse(corpo);

    if (!validacao.success) {
      return NextResponse.json(
        { erro: validacao.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    const { email, senha, lembrar } = validacao.data;

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, senhaHash: true },
    });

    const senhaOk = await bcrypt.compare(senha, usuario?.senhaHash ?? (await obterHashDescartavel()));

    if (!usuario || !senhaOk) {
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const token = await criarToken(usuario.id, lembrar);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_SESSAO, token, opcoesCookieSessao(lembrar));
    return res;
  } catch (erro) {
    if (erro instanceof ErroConfiguracao) {
      // Falha de configuração do servidor (JWT_SECRET): nunca emite sessão.
      console.error("Erro de configuração no login:", erro.message);
      return NextResponse.json(
        {
          erro: "O servidor não está configurado para autenticação. Avise o administrador do sistema.",
        },
        { status: 500 }
      );
    }

    console.error("Erro no login:", erro);
    return NextResponse.json(
      { erro: "Erro interno ao autenticar usuário." },
      { status: 500 }
    );
  }
}
