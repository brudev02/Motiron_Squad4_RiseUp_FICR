import { prisma } from "@/lib/prisma";
import { ErroApi, erroGeral } from "@/lib/api";

// A API valida a unidade independentemente das restrições da interface.
export async function validarUnidadeAtiva(usuarioId: string, unidadeId: string | null) {
  if (!unidadeId) return;
  const unidade = await prisma.unidade.findFirst({ where: { id: unidadeId, usuarioId }, select: { situacao: true } });
  if (!unidade) throw new ErroApi(400, { unidadeId: ["Unidade inválida."] });
  if (unidade.situacao === "Inativa") throw new ErroApi(409, { unidadeId: ["Unidades inativas não podem receber novos registros."] });
}

export function exigirRegistroEditavel(unidade: { situacao: string } | null) {
  if (unidade?.situacao === "Inativa") throw erroGeral(409, "Unidade inativa: registro disponível somente para leitura.");
}
