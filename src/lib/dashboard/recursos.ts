import {
  documentoSchema,
  tarefaSchema,
  unidadeSchema,
  type DocumentoEntrada,
  type TarefaEntrada,
  type UnidadeEntrada,
} from "@/lib/validacao/dashboard";
import type { Recurso } from "./crud";
import {
  atualizarDocumento,
  criarDocumento,
  listarDocumentos,
  removerDocumento,
} from "./documentos";
import {
  atualizarTarefa,
  criarTarefa,
  listarTarefas,
  removerTarefa,
} from "./tarefas";
import {
  atualizarUnidade,
  criarUnidade,
  listarUnidades,
  removerUnidade,
} from "./unidades";
import type { DocumentoDTO, TarefaDTO, UnidadeDTO } from "./tipos";

// Liga cada schema às suas funções de banco, no formato esperado por crud.ts.

export const recursoUnidades: Recurso<UnidadeEntrada, UnidadeDTO> = {
  schema: unidadeSchema,
  listar: listarUnidades,
  criar: criarUnidade,
  atualizar: atualizarUnidade,
  remover: removerUnidade,
};

export const recursoDocumentos: Recurso<DocumentoEntrada, DocumentoDTO> = {
  schema: documentoSchema,
  listar: listarDocumentos,
  criar: criarDocumento,
  atualizar: atualizarDocumento,
  remover: removerDocumento,
};

export const recursoTarefas: Recurso<TarefaEntrada, TarefaDTO> = {
  schema: tarefaSchema,
  listar: listarTarefas,
  criar: criarTarefa,
  atualizar: atualizarTarefa,
  remover: removerTarefa,
};
