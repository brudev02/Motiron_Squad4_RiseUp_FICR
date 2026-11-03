import { DashboardUsers } from "@/components/dashboard/DashboardUsers";
import { exigirUsuario } from "@/lib/sessao";

export default async function UsuariosPage() {
  const usuario = await exigirUsuario();
  return <DashboardUsers usuario={usuario} />;
}
