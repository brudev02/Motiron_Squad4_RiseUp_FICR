"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone } from "@/components/ui/Icones";
import type { UsuarioSessao } from "@/lib/dashboard/tipos";
import { GRUPOS_MENU, ITENS_MENU, iniciais, itemAtivo } from "./navegacao";
import { useSair } from "./useSair";

type Props = {
  usuario: UsuarioSessao;
  /** Gaveta aberta (só existe em telas pequenas). */
  aberto: boolean;
  onFechar: () => void;
};

const nomePerfil = { empresa: "Empresa", funcionario: "Funcionário" } as const;

// Menu lateral. Fixo em telas grandes; em telas pequenas vira uma gaveta
// aberta pelo botão de menu do cabeçalho.
export function DashboardSidebar({ usuario, aberto, onFechar }: Props) {
  const caminho = usePathname();
  const ativo = itemAtivo(caminho);
  const { sair, saindo } = useSair();

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") onFechar();
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  return (
    <>
      {aberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onFechar}
          className="fixed inset-0 z-30 bg-escuro/60 lg:hidden"
        />
      )}

      <aside
        aria-label="Menu principal"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-7 bg-escuro px-4 py-6 text-white transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:visible ${
          aberto ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <Link
          href="/dashboard"
          onClick={onFechar}
          className="flex items-center gap-3 px-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-campo text-lg font-bold text-escuro">
            A
          </span>
          <span>
            <strong className="block text-lg font-semibold leading-tight text-campo">
              Adgestion
            </strong>
            <small className="text-[10px] uppercase tracking-wider text-white/50">
              Gestão corporativa
            </small>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
          {GRUPOS_MENU.map((grupo) => (
            <div key={grupo.id}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {grupo.titulo}
              </p>
              <ul className="flex flex-col gap-1">
                {ITENS_MENU.filter((item) => item.grupo === grupo.id).map((item) => {
                  const selecionado = item.href === ativo.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onFechar}
                        aria-current={selecionado ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-campo ${
                          selecionado
                            ? "bg-destaque text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icone nome={item.icone} className="h-[18px] w-[18px]" />
                        {item.nome}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destaque text-xs font-semibold">
              {iniciais(usuario.nome)}
            </span>
            <span className="min-w-0 flex-1 text-xs leading-tight">
              <strong className="block truncate font-medium">{usuario.nome}</strong>
              <span className="text-white/50">{nomePerfil[usuario.perfil]}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={sair}
            disabled={saindo}
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            <Icone nome="sair" className="h-[18px] w-[18px]" />
            {saindo ? "Saindo..." : "Sair"}
          </button>
        </div>
      </aside>
    </>
  );
}
