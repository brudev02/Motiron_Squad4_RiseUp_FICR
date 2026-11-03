import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigirUsuarioApi, lerEValidar, responderErro } from "@/lib/api";
import { contaSchema } from "@/lib/validacao/auth";

// Atualiza os dados da própria conta (hoje, só o nome de exibição).
export async function PATCH(req: Request) {
  try {
    const usuario = await exigirUsuarioApi();
    const { nome } = await lerEValidar(req, contaSchema);

    await prisma.usuario.update({ where: { id: usuario.id }, data: { nome } });

    return NextResponse.json({ ok: true });
  } catch (erro) {
    return responderErro(erro);
  }
}
