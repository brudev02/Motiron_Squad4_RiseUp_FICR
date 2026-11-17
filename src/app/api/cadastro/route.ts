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
    const perfilFinal = perfil ?? "empresa";
    const cpfNormalizado = perfilFinal === "funcionario"  ? cpf ??  null  : null;
    const cnpjNormalizado = perfilFinal === "empresa" ? cnpj ?? null : null;
    const emailNormalizado = email.toLowerCase();
    const existe = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (cpfNormalizado) {
      const cpfExistente  = await prisma.usuario.findUnique({
        where: {cpf: cpfNormalizado },
      });
    
    if (cpfExistente) { 
      return NextResponse.json(
        { erros: { cpf: ["CPF já cadastrado"]}},
        { status : 409 }
      );
    }
    }

    if (cnpjNormalizado) {
      const cnpjExistente = await prisma.usuario.findUnique({
        where: { cnpj: cnpjNormalizado },
      });

      if (cnpjExistente) {
        return NextResponse.json(
          { erros: { cnpj: ["CNPJ já cadastrado"] } },
          { status: 409 }
        );
      }
    }

    if (existe) {
      return NextResponse.json(
        { erros: { email: ["E-mail já cadastrado"] } },
        { status: 409 }
      );
    }

    if (await senhaEmUsoPorOutraConta(senha)) {
      return NextResponse.json(
        {
          erros: {
            senha: [
              "Senha Indisponivel.",
            ],
          },
        },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await prisma.usuario.create({
      data: { nome, email: emailNormalizado, senhaHash, perfil: perfilFinal, cpf: cpfNormalizado, cnpj: cnpjNormalizado,},
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
