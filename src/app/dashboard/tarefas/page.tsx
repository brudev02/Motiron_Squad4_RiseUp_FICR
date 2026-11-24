import { DashboardTasks } from "@/components/dashboard/DashboardTasks";
import { listarUnidades } from "@/lib/dashboard/unidades";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { exigirUsuario } from "@/lib/sessao";

export default async function TarefasPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const usuario = await exigirUsuario();
  const [tarefas, unidades, { novo }]  = await Promise.all([
    listarTarefas(usuario.id),
    listarUnidades(usuario.id),
    searchParams,
  ]);

  return <DashboardTasks tarefas={tarefas} unidades={unidades} abrirNovo={novo === "1"} />;
}
