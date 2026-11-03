import { DashboardTasks } from "@/components/dashboard/DashboardTasks";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { exigirUsuario } from "@/lib/sessao";

export default async function TarefasPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const usuario = await exigirUsuario();
  const [tarefas, { novo }] = await Promise.all([
    listarTarefas(usuario.id),
    searchParams,
  ]);

  return <DashboardTasks tarefas={tarefas} abrirNovo={novo === "1"} />;
}
