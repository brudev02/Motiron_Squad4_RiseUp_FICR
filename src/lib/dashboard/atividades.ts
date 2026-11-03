import { prisma } from "@/lib/prisma";
import { tempoRelativo } from "./datas";
import type { AtividadeDTO, TipoAtividade } from "./tipos";

/** Grava uma linha no histórico exibido em "Atividade recente". */
export async function registrarAtividade(
  usuarioId: string,
  tipo: TipoAtividade,
  descricao: string
) {
  await prisma.atividade.create({ data: { usuarioId, tipo, descricao } });
}

export async function listarAtividadesRecentes(
  usuarioId: string,
  limite = 8
): Promise<AtividadeDTO[]> {
  const agora = new Date();

  const linhas = await prisma.atividade.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
    take: limite,
  });

  return linhas.map((linha) => ({
    id: linha.id,
    tipo: linha.tipo as TipoAtividade,
    descricao: linha.descricao,
    quando: tempoRelativo(linha.criadoEm, agora),
  }));
}
