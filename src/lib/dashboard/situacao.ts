import { diasEntre } from "./datas";
import {
  JANELA_VENCIMENTO_DIAS,
  type SituacaoDocumento,
  type StatusTarefa,
} from "./tipos";

/**
 * Situação de um documento.
 * - "Em análise" é uma escolha manual e tem prioridade.
 * - Sem validade informada o documento é considerado "Vigente".
 * - Com validade: vencido (data passada), a vencer (até 30 dias) ou vigente.
 */
export function situacaoDocumento(
  emAnalise: boolean,
  vencimento: string | null,
  hoje: string
): SituacaoDocumento {
  if (emAnalise) return "Em análise";
  if (!vencimento) return "Vigente";

  const dias = diasEntre(hoje, vencimento);

  if (dias < 0) return "Vencido";
  if (dias <= JANELA_VENCIMENTO_DIAS) return "A vencer";
  return "Vigente";
}

/** Tarefa atrasada: não concluída e com prazo anterior a hoje. */
export function tarefaAtrasada(
  status: StatusTarefa,
  prazo: string | null,
  hoje: string
): boolean {
  return status !== "Concluída" && prazo !== null && prazo < hoje;
}
