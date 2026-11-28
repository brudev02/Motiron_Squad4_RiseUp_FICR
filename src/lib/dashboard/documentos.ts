import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { erroGeral } from "@/lib/api";
import { validarUnidadeAtiva, exigirRegistroEditavel } from "./unidade-regras";
import type { DocumentoEntrada } from "@/lib/validacao/dashboard";
import { registrarAtividade } from "./atividades";
import { deDataUTC, hojeISO, paraDataUTC } from "./datas";
import { situacaoDocumento } from "./situacao";
import type { DocumentoDTO } from "./tipos";
import { excluirArquivoDocumento } from "@/lib/arquivos-documentos";

type LinhaDocumento = {
  id: string;
  nome: string;
  responsavel: string;
  vencimento: Date | null;
  emAnalise: boolean;
  demo: boolean;
  unidadeId: string | null;
  unidade: { nome: string; situacao: string } | null;

  // Informações do PDF anexado.
  arquivoNome: string | null;
  arquivoChave: string | null;
  arquivoTipo: string | null;
};

const incluirUnidade = { unidade: { select: { nome: true, situacao: true } } } as const;

function paraDTO(linha: LinhaDocumento, hoje: string): DocumentoDTO {
  const vencimento = linha.vencimento ? deDataUTC(linha.vencimento) : null;

  return {
    id: linha.id,
    nome: linha.nome,
    responsavel: linha.responsavel,
    unidadeId: linha.unidadeId,
    unidadeNome: linha.unidade?.nome ?? null,
    somenteLeitura: linha.unidade?.situacao === "Inativa",
    vencimento,
    emAnalise: linha.emAnalise,
    situacao: situacaoDocumento(vencimento, hoje),
    demo: linha.demo,
    arquivoNome: linha.arquivoNome,
    arquivoChave: linha.arquivoChave,
    arquivoTipo: linha.arquivoTipo,
  };
}

/** Mais urgentes primeiro; documentos sem validade vão para o fim. */
function porVencimento(a: DocumentoDTO, b: DocumentoDTO): number {
  if (a.vencimento === b.vencimento) return a.nome.localeCompare(b.nome, "pt-BR");
  if (a.vencimento === null) return 1;
  if (b.vencimento === null) return -1;
  return a.vencimento < b.vencimento ? -1 : 1;
}

export const listarDocumentos = cache(
  async (usuarioId: string): Promise<DocumentoDTO[]> => {
    const hoje = hojeISO();

    const linhas = await prisma.documento.findMany({
      where: { usuarioId },
      include: incluirUnidade,
    });

    return linhas.map((linha) => paraDTO(linha, hoje)).sort(porVencimento);
  }
);

function dadosParaBanco(dados: DocumentoEntrada) {
  return {
    nome: dados.nome,
    responsavel: dados.responsavel,
    unidadeId: dados.unidadeId,
    emAnalise: dados.emAnalise,
    vencimento: dados.vencimento ? paraDataUTC(dados.vencimento) : null,
  };
}

export async function criarDocumento(
  usuarioId: string,
  dados: DocumentoEntrada
): Promise<DocumentoDTO> {
  await validarUnidadeAtiva(usuarioId, dados.unidadeId);

  const linha = await prisma.documento.create({
    data: { ...dadosParaBanco(dados), usuarioId },
    include: incluirUnidade,
  });

  await registrarAtividade(usuarioId, "documento", `Documento “${linha.nome}” cadastrado`);
  return paraDTO(linha, hojeISO());
}

export async function atualizarDocumento(
  usuarioId: string,
  id: string,
  dados: DocumentoEntrada
): Promise<DocumentoDTO> {
  const existente = await prisma.documento.findFirst({
    where: { id, usuarioId },
    select: { id: true, unidade: { select: { situacao: true } } },
  });
  if (!existente) throw erroGeral(404, "Documento não encontrado.");
  exigirRegistroEditavel(existente.unidade);

  await validarUnidadeAtiva(usuarioId, dados.unidadeId);

  const linha = await prisma.documento.update({
    where: { id },
    data: dadosParaBanco(dados),
    include: incluirUnidade,
  });

  await registrarAtividade(usuarioId, "documento", `Documento “${linha.nome}” atualizado`);
  return paraDTO(linha, hojeISO());
}

export async function removerDocumento(usuarioId: string, id: string): Promise<void> {
  // Busca o documento e a chave do PDF, garantindo que pertence ao usuário.
  const existente = await prisma.documento.findFirst({
    where: { id, usuarioId },
    select: {
      nome: true,
      arquivoChave: true,
      unidade: { select: { situacao: true } },
    },
  });

  if (!existente) throw erroGeral(404, "Documento não encontrado.");
  exigirRegistroEditavel(existente.unidade);

  // Exclui o cadastro do banco de dados.
  await prisma.documento.delete({ where: { id } });

  // Exclui também o PDF associado, caso exista.
  await excluirArquivoDocumento(existente.arquivoChave);

  await registrarAtividade(
    usuarioId,
    "documento",
    `Documento “${existente.nome}” excluído`
  );
}