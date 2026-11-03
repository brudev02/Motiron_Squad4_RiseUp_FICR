import { DashboardReports } from "@/components/dashboard/DashboardReports";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { carregarResumo } from "@/lib/dashboard/resumo";
import { STATUS_TAREFA, type StatusTarefa } from "@/lib/dashboard/tipos";
import { exigirUsuario } from "@/lib/sessao";

export default async function RelatoriosPage() {
  const usuario = await exigirUsuario();
  const [resumo, tarefas] = await Promise.all([
    carregarResumo(usuario.id),
    listarTarefas(usuario.id),
  ]);

  const tarefasPorStatus = Object.fromEntries(
    STATUS_TAREFA.map((status) => [status, tarefas.filter((t) => t.status === status).length])
  ) as Record<StatusTarefa, number>;

  return (
    <DashboardReports
      totais={resumo.totais}
      distribuicaoDocumentos={resumo.distribuicao}
      tarefasPorStatus={tarefasPorStatus}
    />
  );
}
