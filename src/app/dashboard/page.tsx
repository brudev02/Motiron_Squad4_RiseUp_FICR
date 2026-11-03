import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { carregarResumo } from "@/lib/dashboard/resumo";
import { exigirUsuario } from "@/lib/sessao";

export default async function VisaoGeralPage() {
  const usuario = await exigirUsuario();
  const resumo = await carregarResumo(usuario.id);

  return (
    <DashboardOverview
      resumo={resumo}
      primeiroNome={usuario.nome.trim().split(/\s+/)[0] ?? usuario.nome}
    />
  );
}
