import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    const senhaOk =
      usuario && (await bcrypt.compare(parsed.data.senha, usuario.senhaHash));

    if (!usuario || !senhaOk) {
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ sub: usuario.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("sessao", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (erro) {
    console.error("Erro no login:", erro);
    return NextResponse.json(
      { erro: "Erro interno ao autenticar usuário." },
      { status: 500 }
    );
  }
}
