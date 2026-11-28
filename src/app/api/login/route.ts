import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  COOKIE_SESSAO,
  ErroConfiguracao,
  criarToken,
  opcoesCookieSessao,
} from "@/lib/sessao";
import { loginSchema } from "@/lib/validacao/auth";

const MAX_TENTATIVAS = 5;
const JANELA_TENTATIVAS = 15 * 60 * 1000;
const DURACAO_BLOQUEIO = 15 * 60 * 1000;

// Limite por e-mail normalizado, sem confiar em cabeçalhos de IP enviados pelo cliente.
// Em produção, combinar com limitação por IP confiável no proxy para reduzir abuso.
function criarChaveTentativa(email: string): string {
  return createHash("sha256").update(email.toLowerCase()).digest("hex");
}

async function registrarFalhaLogin(chave: string): Promise<Date | null> {
  return prisma.$transaction(async (tx) => {
    const agora = new Date();
    const registro = await tx.tentativaLogin.findUnique({ where: { chave } });
    if (registro?.bloqueadoAte && registro.bloqueadoAte > agora) return registro.bloqueadoAte;
    const reiniciar = !registro ||
      agora.getTime() - registro.inicioJanela.getTime() >= JANELA_TENTATIVAS ||
      registro.bloqueadoAte !== null;
    const tentativas = registro && !reiniciar ? registro.tentativas + 1 : 1;
    const inicioJanela = registro && !reiniciar ? registro.inicioJanela : agora;
    const bloqueadoAte = tentativas >= MAX_TENTATIVAS
      ? new Date(agora.getTime() + DURACAO_BLOQUEIO) : null;
    await tx.tentativaLogin.upsert({
      where: { chave },
      create: { chave, tentativas, inicioJanela, bloqueadoAte },
      update: { tentativas, inicioJanela, bloqueadoAte },
    });
    return bloqueadoAte;
  });
}

function respostaBloqueio(ate: Date) {
  const segundos = Math.max(1, Math.ceil((ate.getTime() - Date.now()) / 1000));
  return NextResponse.json(
    { erro: "E-mail ou senha incorretos. Aguarde antes de tentar novamente." },
    { status: 429, headers: { "Retry-After": String(segundos) } }
  );
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
    const chave = criarChaveTentativa(emailNormalizado);
    const tentativa = await prisma.tentativaLogin.findUnique({ where: { chave } });
    if (tentativa?.bloqueadoAte && tentativa.bloqueadoAte.getTime() > Date.now()) {
      return respostaBloqueio(tentativa.bloqueadoAte);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
      select: { id: true, senhaHash: true },
    });

    const senhaOk = await bcrypt.compare(senha, usuario?.senhaHash ?? (await obterHashDescartavel()));

    if (!usuario || !senhaOk) {
      const bloqueadoAte = await registrarFalhaLogin(chave);
      if (bloqueadoAte) return respostaBloqueio(bloqueadoAte);
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const token = await criarToken(usuario.id, lembrar);
    await prisma.tentativaLogin.deleteMany({ where: { chave } });

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
