"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone } from "@/components/ui/Icones";
import type { Alerta, UsuarioSessao } from "@/lib/dashboard/tipos";
import { BOTAO_ICONE } from "./estilos";
import { iniciais, itemAtivo } from "./navegacao";
import { CampoBusca } from "./ui/Busca";

type Props = {
  usuario: UsuarioSessao;
  alertas: Alerta[];
  onAbrirMenu: () => void;
};

const MAXIMO_EXIBIDO = 8;

// Cabeçalho superior: menu (mobile), "Workspace / Seção", busca da seção,
// notificações (documentos e tarefas que pedem atenção) e atalho da conta.
export function DashboardHeader({ usuario, alertas, onAbrirMenu }: Props) {
  const caminho = usePathname();
  const secao = itemAtivo(caminho);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-escuro/10 bg-white px-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className={`${BOTAO_ICONE} border border-escuro/15 lg:hidden`}
        >
          <Icone nome="menu" />
        </button>

        <p className="truncate text-xs text-escuro/50">
          Workspace <span className="mx-1">/</span>
          <b className="font-semibold text-escuro">{secao.nome}</b>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {secao.busca && (
          <CampoBusca
            placeholder="Buscar nesta página..."
            className="hidden w-60 md:block"
          />
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setAberto((valor) => !valor)}
            aria-label={
              alertas.length > 0
                ? `Notificações: ${alertas.length} itens pedem atenção`
                : "Notificações"
            }
            aria-expanded={aberto}
            className={`${BOTAO_ICONE} relative h-10 w-10 border border-escuro/15`}
          >
            <Icone nome="sino" className="h-[18px] w-[18px]" />
            {alertas.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-perigo px-1 text-[9px] font-bold text-white">
                {alertas.length > 9 ? "9+" : alertas.length}
              </span>
            )}
          </button>

          {aberto && (
            <>
              <button
                type="button"
                aria-label="Fechar notificações"
                onClick={() => setAberto(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
              <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-escuro/10 bg-white shadow-xl">
                <p className="border-b border-escuro/10 px-4 py-3 text-xs font-semibold">
                  Notificações
                </p>

                {alertas.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-escuro/60">
                    Nada pendente por aqui. Documentos a vencer e tarefas
                    atrasadas aparecem neste painel.
                  </p>
                ) : (
                  <ul className="max-h-80 divide-y divide-escuro/5 overflow-y-auto">
                    {alertas.slice(0, MAXIMO_EXIBIDO).map((alerta) => (
                      <li key={alerta.id}>
                        <Link
                          href={alerta.href}
                          onClick={() => setAberto(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-escuro/5"
                        >
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              alerta.gravidade === "perigo"
                                ? "bg-perigo-fundo text-perigo"
                                : "bg-aviso-fundo text-aviso"
                            }`}
                          >
                            <Icone
                              nome={alerta.tipo === "documento" ? "documento" : "relogio"}
                              className="h-3.5 w-3.5"
                            />
                          </span>
                          <span className="min-w-0 text-xs">
                            <strong className="block truncate font-medium">
                              {alerta.titulo}
                            </strong>
                            <span className="text-escuro/60">{alerta.detalhe}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {alertas.length > MAXIMO_EXIBIDO && (
                  <p className="border-t border-escuro/10 px-4 py-2 text-center text-[11px] text-escuro/50">
                    e mais {alertas.length - MAXIMO_EXIBIDO} item(ns)
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <Link
          href="/dashboard/configuracoes"
          aria-label="Minha conta e configurações"
          title={usuario.nome}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-painel text-xs font-semibold text-white transition hover:bg-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque"
        >
          {iniciais(usuario.nome)}
        </Link>
      </div>
    </header>
  );
}
