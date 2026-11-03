import { listarAtividadesRecentes } from "./atividades";
import {
  formatarData,
  hojeISO,
  mesesDoAno,
  rotuloMes,
  ultimosMeses,
} from "./datas";
import { listarDocumentos } from "./documentos";
import { listarTarefas } from "./tarefas";
import { listarUnidades } from "./unidades";
import {
  SITUACOES_DOCUMENTO,
  type Alerta,
  type DocumentoDTO,
  type PontoAtividade,
  type Resumo,
  type TarefaDTO,
} from "./tipos";

/**
 * Série do gráfico de atividades: tarefas por mês, separadas em concluídas
 * e em aberto. O mês de uma tarefa é o do prazo (ou o da criação, se não
 * houver prazo).
 */
export function atividadePorMes(
  tarefas: (TarefaDTO & { mesBase: string })[],
  meses: string[]
): PontoAtividade[] {
  return meses.map((mes) => {
    const doMes = tarefas.filter((t) => t.mesBase === mes);

    return {
      rotulo: rotuloMes(mes),
      concluidas: doMes.filter((t) => t.status === "Concluída").length,
      emAberto: doMes.filter((t) => t.status !== "Concluída").length,
    };
  });
}

export function distribuirDocumentos(documentos: DocumentoDTO[]) {
  return SITUACOES_DOCUMENTO.map((rotulo) => ({
    rotulo,
    valor: documentos.filter((d) => d.situacao === rotulo).length,
  }));
}

/** Dados da Visão geral. Tudo calculado a partir dos registros reais da conta. */
export async function carregarResumo(usuarioId: string): Promise<Resumo> {
  const [unidades, documentos, tarefas, recentes] = await Promise.all([
    listarUnidades(usuarioId),
    listarDocumentos(usuarioId),
    listarTarefas(usuarioId),
    listarAtividadesRecentes(usuarioId),
  ]);

  const hoje = hojeISO();
  const tarefasComMes = tarefas.map((t) => ({
    ...t,
    mesBase: (t.prazo ?? hoje).slice(0, 7),
  }));

  const aVencer = documentos.filter((d) => d.situacao === "A vencer").length;
  const vencidos = documentos.filter((d) => d.situacao === "Vencido").length;

  return {
    totais: {
      unidades: unidades.length,
      unidadesAtivas: unidades.filter((u) => u.situacao === "Ativa").length,
      documentos: documentos.length,
      documentosAtivos: documentos.length - vencidos,
      aVencer,
      vencidos,
      tarefasPendentes: tarefas.filter((t) => t.status !== "Concluída").length,
      tarefasAtrasadas: tarefas.filter((t) => t.atrasada).length,
    },
    atividade6m: atividadePorMes(tarefasComMes, ultimosMeses(6, hoje)),
    atividadeAno: atividadePorMes(tarefasComMes, mesesDoAno(hoje)),
    distribuicao: distribuirDocumentos(documentos),
    atencao: documentos
      .filter((d) => d.situacao === "Vencido" || d.situacao === "A vencer")
      .slice(0, 6),
    recentes,
  };
}

/** Itens do sino de notificações: documentos vencidos/a vencer e tarefas atrasadas. */
export async function carregarAlertas(usuarioId: string): Promise<Alerta[]> {
  const [documentos, tarefas] = await Promise.all([
    listarDocumentos(usuarioId),
    listarTarefas(usuarioId),
  ]);

  const deDocumentos: Alerta[] = documentos
    .filter((d) => d.situacao === "Vencido" || d.situacao === "A vencer")
    .map((d) => ({
      id: `doc-${d.id}`,
      tipo: "documento",
      titulo: d.nome,
      detalhe:
        d.situacao === "Vencido"
          ? `Venceu em ${formatarData(d.vencimento)}`
          : `Vence em ${formatarData(d.vencimento)}`,
      gravidade: d.situacao === "Vencido" ? "perigo" : "aviso",
      href: "/dashboard/documentos",
    }));

  const deTarefas: Alerta[] = tarefas
    .filter((t) => t.atrasada)
    .map((t) => ({
      id: `tarefa-${t.id}`,
      tipo: "tarefa",
      titulo: t.titulo,
      detalhe: `Prazo em ${formatarData(t.prazo)} · ${t.responsavel}`,
      gravidade: "perigo",
      href: "/dashboard/tarefas",
    }));

  // Críticos primeiro, depois os avisos.
  return [...deDocumentos, ...deTarefas].sort((a, b) =>
    a.gravidade === b.gravidade ? 0 : a.gravidade === "perigo" ? -1 : 1
  );
}
