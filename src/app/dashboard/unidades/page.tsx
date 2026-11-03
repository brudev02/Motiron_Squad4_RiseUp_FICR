import { DashboardUnits } from "@/components/dashboard/DashboardUnits";
import { listarUnidades } from "@/lib/dashboard/unidades";
import { exigirUsuario } from "@/lib/sessao";

export default async function UnidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const usuario = await exigirUsuario();
  const [unidades, { novo }] = await Promise.all([
    listarUnidades(usuario.id),
    searchParams,
  ]);

  return <DashboardUnits unidades={unidades} abrirNovo={novo === "1"} />;
}
