import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function senhaEmUsoPorOutraConta(
  senha: string,
  usuarioId?: string
) {
  const contas = await prisma.usuario.findMany({
    where: usuarioId ? { id: { not: usuarioId } } : undefined,
    select: { senhaHash: true },
  });

  for (const conta of contas) {
    if (await bcrypt.compare(senha, conta.senhaHash)) {
      return true;
    }
  }

  return false;
}
