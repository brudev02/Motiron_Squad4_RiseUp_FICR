import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { carregarAlertas } from "@/lib/dashboard/resumo";
import { exigirUsuario } from "@/lib/sessao";

export const metadata: Metadata = {
  title: "Dashboard | Adgestion",
  // Área autenticada: não deve aparecer em buscadores.
  robots: { index: false, follow: false },
};

// Toda a área /dashboard exige sessão válida. A verificação (JWT assinado +
// conta existente no banco) acontece aqui, no servidor, e é repetida em cada
// página, porque o Next.js não reexecuta o layout a cada navegação interna.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const usuario = await exigirUsuario();
  const alertas = await carregarAlertas(usuario.id);

  return (
    <DashboardShell usuario={usuario} alertas={alertas}>
      {children}
    </DashboardShell>
  );
}
