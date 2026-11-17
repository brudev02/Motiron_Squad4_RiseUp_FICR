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
import { createHash } from "node:crypto";

const MAX_TENTATIVAS = 5;
const JANELA_TENTATIVAS = 15 * 60 * 1000;
const DURACAO_BLOQUEIO = 15 * 60 * 1000;

function criarChaveTentativa(email: string, req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return createHash("sha256")
    .update(`${email.toLowerCase()}|${ip}`)
    .digest("hex");
}

async function registrarFalhaLogin(chave: string): Promise<boolean> {
  const agora = new Date();

  return prisma.$transaction(async (tx) => {
    const registro = await tx.tentativaLogin.findUnique({
      where: { chave },
    });

    const reiniciarJanela =
      !registro ||
      agora.getTime() - registro.inicioJanela.getTime() >=
        JANELA_TENTATIVAS ||
      (registro.bloqueadoAte !== null &&
        registro.bloqueadoAte.getTime() <= agora.getTime());

    const tentativas = registro && !reiniciarJanela ? registro.tentativas + 1 : 1;
    const inicioJanela = registro && !reiniciarJanela ? registro.inicioJanela : agora;
    const bloqueadoAte =
      tentativas >= MAX_TENTATIVAS
        ? new Date(agora.getTime() + DURACAO_BLOQUEIO)
        : null;

    await tx.tentativaLogin.upsert({
      where: { chave },
      create: { chave, tentativas, inicioJanela, bloqueadoAte },
      update: { tentativas, inicioJanela, bloqueadoAte },
    });

    return bloqueadoAte !== null;
  });
}

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
    const emailNormalizado = email.toLowerCase();
    const chaveTentativa = criarChaveTentativa(emailNormalizado, req);
    const tentativa = await prisma.tentativaLogin.findUnique({
      where: { chave: chaveTentativa },
    });

    if (
      tentativa?.bloqueadoAte &&
      tentativa.bloqueadoAte.getTime() > Date.now()
    ) {
      return NextResponse.json(
        {
          erro:
            "E-mail ou senha incorretos. Aguarde antes de tentar novamente.",
        },
        { status: 429 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
      select: { id: true, senhaHash: true },
    });

    const senhaOk = await bcrypt.compare(
      senha,
      usuario?.senhaHash ?? (await obterHashDescartavel())
    );

    if (!usuario || !senhaOk) {
      const bloqueou = await registrarFalhaLogin(chaveTentativa);

      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: bloqueou ? 429 : 401 }
      );
    }

    await prisma.tentativaLogin.deleteMany({
      where: { chave: chaveTentativa },
    });

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
