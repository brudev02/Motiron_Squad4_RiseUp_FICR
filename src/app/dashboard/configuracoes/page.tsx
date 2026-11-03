import { DashboardSettings } from "@/components/dashboard/DashboardSettings";
import { possuiDadosExemplo } from "@/lib/dashboard/demo";
import { exigirUsuario } from "@/lib/sessao";

export default async function ConfiguracoesPage() {
  const usuario = await exigirUsuario();
  const temDadosExemplo = await possuiDadosExemplo(usuario.id);

  return <DashboardSettings usuario={usuario} temDadosExemplo={temDadosExemplo} />;
}
