import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ErroApi, erroGeral } from "@/lib/api";
import type { TarefaEntrada } from "@/lib/validacao/dashboard";
import { registrarAtividade } from "./atividades";
import { deDataUTC, hojeISO, paraDataUTC } from "./datas";
import { tarefaAtrasada } from "./situacao";
import type { Prioridade, StatusTarefa, TarefaDTO } from "./tipos";

type LinhaTarefa = {
  id: string;
  titulo: string;
  responsavel: string;
  prazo: Date | null;
  prioridade: string;
  status: string;
  demo: boolean;
  unidadeId: string | null;
  unidade: { nome: string } | null;
};

const incluirUnidade = { unidade: { select: { nome: true } } } as const;

function paraDTO(linha: LinhaTarefa, hoje: string): TarefaDTO {
  const prazo = linha.prazo ? deDataUTC(linha.prazo) : null;
  const status = linha.status as StatusTarefa;

  return {
    id: linha.id,
    titulo: linha.titulo,
    responsavel: linha.responsavel,
    unidadeId: linha.unidadeId,
    unidadeNome: linha.unidade?.nome ?? null,
    prazo,
    prioridade: linha.prioridade as Prioridade,
    status,
    atrasada: tarefaAtrasada(status, prazo, hoje),
    demo: linha.demo,
  };
}

/** Abertas primeiro, depois por prazo (sem prazo no fim). */
function ordenar(a: TarefaDTO, b: TarefaDTO): number {
  const abertaA = a.status !== "Concluída";
  const abertaB = b.status !== "Concluída";
  if (abertaA !== abertaB) return abertaA ? -1 : 1;

  if (a.prazo === b.prazo) return a.titulo.localeCompare(b.titulo, "pt-BR");
  if (a.prazo === null) return 1;
  if (b.prazo === null) return -1;
  return a.prazo < b.prazo ? -1 : 1;
}

export const listarTarefas = cache(
  async (usuarioId: string): Promise<TarefaDTO[]> => {
    const hoje = hojeISO();
    const linhas = await prisma.tarefa.findMany({
      where: { usuarioId },
      include: incluirUnidade,
    });

    return linhas.map((linha) => paraDTO(linha, hoje)).sort(ordenar);
  }
);

/** A unidade escolhida precisa pertencer à mesma conta e estar ativa. */
async function validarUnidade(usuarioId: string, unidadeId: string | null) {
  if (!unidadeId) return;

  const unidade = await prisma.unidade.findFirst({
    where: { id: unidadeId, usuarioId },
    select: { id: true, situacao: true },
  });

  if (!unidade) {
    throw new ErroApi(400, { unidadeId: ["Unidade inválida."] });
  }

  if (unidade.situacao === "Inativa") {
    throw new ErroApi(400, {
      unidadeId: ["Não é possível vincular tarefas a uma unidade inativa."],
    });
  }
}

function dadosParaBanco(dados: TarefaEntrada) {
  return {
    titulo: dados.titulo,
    responsavel: dados.responsavel,
    unidadeId: dados.unidadeId,
    prioridade: dados.prioridade,
    status: dados.status,
    prazo: dados.prazo ? paraDataUTC(dados.prazo) : null,
  };
}

export async function criarTarefa(
  usuarioId: string,
  dados: TarefaEntrada
): Promise<TarefaDTO> {
  await validarUnidade(usuarioId, dados.unidadeId);

  const linha = await prisma.tarefa.create({
    data: { ...dadosParaBanco(dados), usuarioId },
    include: incluirUnidade,
  });

  await registrarAtividade(usuarioId, "tarefa", `Tarefa “${linha.titulo}” criada`);
  return paraDTO(linha, hojeISO());
}

export async function atualizarTarefa(
  usuarioId: string,
  id: string,
  dados: TarefaEntrada
): Promise<TarefaDTO> {
  const existente = await prisma.tarefa.findFirst({
    where: { id, usuarioId },
    select: { status: true, unidadeId: true },
  });
  if (!existente) throw erroGeral(404, "Tarefa não encontrada.");

  // Só valida se a unidade foi trocada: manter o vínculo antigo é permitido.
  if (dados.unidadeId !== existente.unidadeId) {
    await validarUnidade(usuarioId, dados.unidadeId);
  }

  const linha = await prisma.tarefa.update({
    where: { id },
    data: dadosParaBanco(dados),
    include: incluirUnidade,
  });

  const concluiuAgora =
    existente.status !== "Concluída" && linha.status === "Concluída";

  await registrarAtividade(
    usuarioId,
    "tarefa",
    concluiuAgora
      ? `Tarefa “${linha.titulo}” concluída`
      : `Tarefa “${linha.titulo}” atualizada`
  );
  return paraDTO(linha, hojeISO());
}

export async function removerTarefa(usuarioId: string, id: string): Promise<void> {
  const existente = await prisma.tarefa.findFirst({
    where: { id, usuarioId },
    select: { titulo: true },
  });
  if (!existente) throw erroGeral(404, "Tarefa não encontrada.");

  await prisma.tarefa.delete({ where: { id } });
  await registrarAtividade(usuarioId, "tarefa", `Tarefa “${existente.titulo}” excluída`);
}