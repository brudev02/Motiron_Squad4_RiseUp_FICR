import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { senhaEmUsoPorOutraConta } from "@/lib/password";

const schema = z
  .object({
    email: z.string().trim().email("Informe um e-mail válido.").toLowerCase(),
    novaSenha: z.string().min(8, "A senha deve ter ao menos 8 caracteres."),
    confirmarNovaSenha: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarNovaSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarNovaSenha"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const resultado = schema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        { erro: resultado.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: resultado.data.email },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { erro: "Não foi possível redefinir a senha com os dados informados." },
        { status: 400 }
      );
    }

    if (await senhaEmUsoPorOutraConta(resultado.data.novaSenha, usuario.id)) {
      return NextResponse.json(
        {
          erro: "Esta senha já está em uso por outra conta. Escolha outra senha.",
        },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(resultado.data.novaSenha, 12);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senhaHash },
    });

    return NextResponse.json({ ok: true });
  } catch (erro) {
    console.error("Erro ao redefinir senha:", erro);
    return NextResponse.json(
      { erro: "Erro interno ao redefinir a senha." },
      { status: 500 }
    );
  }
}
