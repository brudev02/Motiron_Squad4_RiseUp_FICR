"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { Alerta, UsuarioSessao } from "@/lib/dashboard/tipos";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { BuscaProvider } from "./ui/Busca";
import { ToastProvider } from "./ui/Toast";

type Props = {
  usuario: UsuarioSessao;
  alertas: Alerta[];
  children: ReactNode;
};

// Moldura do dashboard: menu lateral + cabeçalho + conteúdo da seção.
// Também fornece os contextos de toast e de busca para as seções.
export function DashboardShell({ usuario, alertas, children }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <ToastProvider>
      <BuscaProvider>
        <div className="flex min-h-screen bg-fundo-claro text-escuro">
          <DashboardSidebar usuario={usuario} aberto={menuAberto} onFechar={fecharMenu} />

          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader
              usuario={usuario}
              alertas={alertas}
              onAbrirMenu={() => setMenuAberto(true)}
            />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
              {children}
            </main>
          </div>
        </div>
      </BuscaProvider>
    </ToastProvider>
  );
}
