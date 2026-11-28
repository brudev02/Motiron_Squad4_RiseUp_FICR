import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { senhaEmUsoPorOutraConta } from "@/lib/password";
import { cadastroSchema } from "@/lib/validacao/auth";
import { errosPorCampo } from "@/lib/validacao/dashboard";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = cadastroSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { erros: errosPorCampo(parsed.error.issues) },
        { status: 400 }
      );
    }

    const { nome, email, senha, perfil, cpf, cnpj } = parsed.data;
    const cpfNormalizado = perfil === "funcionario" ? cpf ?? null : null;
    const cnpjNormalizado = perfil === "empresa" ? cnpj ?? null : null;
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

    if (cpfNormalizado && await prisma.usuario.findUnique({ where: { cpf: cpfNormalizado } })) {
      return NextResponse.json({ erros: { cpf: ["CPF já cadastrado"] } }, { status: 409 });
    }
    if (cnpjNormalizado && await prisma.usuario.findUnique({ where: { cnpj: cnpjNormalizado } })) {
      return NextResponse.json({ erros: { cnpj: ["CNPJ já cadastrado"] } }, { status: 409 });
    }

    if (await senhaEmUsoPorOutraConta(senha)) {
      return NextResponse.json(
        {
          erros: {
            senha: [
              "Esta senha já está em uso por outra conta. Escolha outra senha.",
            ],
          },
        },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await prisma.usuario.create({
      data: { nome, email: emailNormalizado, senhaHash, perfil, cpf: cpfNormalizado, cnpj: cnpjNormalizado },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (erro) {
    // A restrição única também cobre cadastros concorrentes.
    if (typeof erro === "object" && erro !== null && "code" in erro && erro.code === "P2002") {
      return NextResponse.json({ erros: { geral: ["E-mail ou documento já cadastrado."] } }, { status: 409 });
    }
    console.error("Erro no cadastro:", erro);
    return NextResponse.json(
      { erros: { geral: ["Erro interno ao criar a conta."] } },
      { status: 500 }
    );
  }
}
