import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z
  .object({
    nome: z.string().min(3, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { erros: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nome, email, senha } = parsed.data;
    const emailNormalizado = email.toLowerCase();

    const existe = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (existe) {
      return NextResponse.json(
        { erros: { email: ["E-mail já cadastrado"] } },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await prisma.usuario.create({
      data: { nome, email: emailNormalizado, senhaHash },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);
    return NextResponse.json(
      { erros: { geral: ["Erro interno ao criar a conta."] } },
      { status: 500 }
    );
  }
}
