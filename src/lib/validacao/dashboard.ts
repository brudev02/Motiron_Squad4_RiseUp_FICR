import { z } from "zod";
import { dataValida } from "@/lib/dashboard/datas";
import {
  PRIORIDADES,
  SITUACOES_UNIDADE,
  STATUS_TAREFA,
} from "@/lib/dashboard/tipos";

// Schemas das três entidades do dashboard. Usados nas APIs (validação
// definitiva) e nos formulários (mensagens imediatas, mesmas regras).

function texto(rotulo: string, max = 100) {
  return z
    .string()
    .trim()
    .min(2, `${rotulo}: informe ao menos 2 caracteres.`)
    .max(max, `${rotulo}: no máximo ${max} caracteres.`);
}

// Data opcional no formato AAAA-MM-DD. Vazio vira null.
const dataOpcional = z
  .string()
  .trim()
  .refine((v) => v === "" || dataValida(v), "Informe uma data válida.")
  .transform((v) => (v === "" ? null : v));

export const unidadeSchema = z.object({
  nome: texto("Nome da unidade"),
  responsavel: texto("Responsável"),
  cidade: texto("Cidade"),
  situacao: z.enum(SITUACOES_UNIDADE, { message: "Escolha uma situação válida." }),
});

export const documentoSchema = z.object({
  nome: texto("Nome do documento", 150),
  responsavel: texto("Responsável"),
  // "" = sem unidade vinculada
  unidadeId: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v)),
  vencimento: dataOpcional,
  emAnalise: z.boolean(),
});

export const tarefaSchema = z.object({
  titulo: texto("Título da tarefa", 150),
  responsavel: texto("Responsável"),
  prazo: dataOpcional,
  prioridade: z.enum(PRIORIDADES, { message: "Escolha uma prioridade válida." }),
  status: z.enum(STATUS_TAREFA, { message: "Escolha um status válido." }),
});

export type UnidadeEntrada = z.output<typeof unidadeSchema>;
export type DocumentoEntrada = z.output<typeof documentoSchema>;
export type TarefaEntrada = z.output<typeof tarefaSchema>;

// Resultado mínimo que precisamos de um schema (compatível com o safeParse do zod).
export type ResultadoParse<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: { issues: { path: PropertyKey[]; message: string }[] };
    };

export type Validador<T> = { safeParse: (valor: unknown) => ResultadoParse<T> };

/** Converte os problemas do zod em { campo: [mensagens] }. */
export function errosPorCampo(
  issues: { path: PropertyKey[]; message: string }[]
): Record<string, string[]> {
  const erros: Record<string, string[]> = {};

  for (const issue of issues) {
    const campo = issue.path.length > 0 ? String(issue.path[0]) : "geral";
    (erros[campo] ??= []).push(issue.message);
  }

  return erros;
}
