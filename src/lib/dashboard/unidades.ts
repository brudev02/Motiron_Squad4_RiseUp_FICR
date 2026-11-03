import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { erroGeral } from "@/lib/api";
import type { UnidadeEntrada } from "@/lib/validacao/dashboard";
import { registrarAtividade } from "./atividades";
import type { UnidadeDTO } from "./tipos";

// Todas as consultas filtram por usuarioId: uma conta nunca acessa
// unidades de outra.

type LinhaUnidade = {
  id: string;
  nome: string;
  responsavel: string;
  cidade: string;
  situacao: string;
  demo: boolean;
  _count: { documentos: number };
};

const contarDocumentos = { _count: { select: { documentos: true } } } as const;

function paraDTO(linha: LinhaUnidade): UnidadeDTO {
  return {
    id: linha.id,
    nome: linha.nome,
    responsavel: linha.responsavel,
    cidade: linha.cidade,
    situacao: linha.situacao === "Inativa" ? "Inativa" : "Ativa",
    qtdDocumentos: linha._count.documentos,
    demo: linha.demo,
  };
}

export const listarUnidades = cache(
  async (usuarioId: string): Promise<UnidadeDTO[]> => {
    const linhas = await prisma.unidade.findMany({
      where: { usuarioId },
      orderBy: { nome: "asc" },
      include: contarDocumentos,
    });

    return linhas.map(paraDTO);
  }
);

export async function criarUnidade(
  usuarioId: string,
  dados: UnidadeEntrada
): Promise<UnidadeDTO> {
  const linha = await prisma.unidade.create({
    data: { ...dados, usuarioId },
    include: contarDocumentos,
  });

  await registrarAtividade(usuarioId, "unidade", `Unidade “${linha.nome}” cadastrada`);
  return paraDTO(linha);
}

export async function atualizarUnidade(
  usuarioId: string,
  id: string,
  dados: UnidadeEntrada
): Promise<UnidadeDTO> {
  const existente = await prisma.unidade.findFirst({
    where: { id, usuarioId },
    select: { id: true },
  });
  if (!existente) throw erroGeral(404, "Unidade não encontrada.");

  const linha = await prisma.unidade.update({
    where: { id },
    data: dados,
    include: contarDocumentos,
  });

  await registrarAtividade(usuarioId, "unidade", `Unidade “${linha.nome}” atualizada`);
  return paraDTO(linha);
}

export async function removerUnidade(usuarioId: string, id: string): Promise<void> {
  const existente = await prisma.unidade.findFirst({
    where: { id, usuarioId },
    select: { nome: true },
  });
  if (!existente) throw erroGeral(404, "Unidade não encontrada.");

  // Documentos vinculados continuam existindo, apenas sem unidade
  // (onDelete: SetNull no schema).
  await prisma.unidade.delete({ where: { id } });
  await registrarAtividade(usuarioId, "unidade", `Unidade “${existente.nome}” excluída`);
}
