"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icone } from "@/components/ui/Icones";
import { BOTAO_ICONE } from "../estilos";

type Props = {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  onFechar: () => void;
  children: ReactNode;
};

// Modal baseado no elemento nativo <dialog>: o navegador cuida do foco
// preso dentro do modal, da tecla Esc e do fundo escurecido.
// O conteúdo só é montado enquanto está aberto, então os formulários
// começam sempre limpos.
export function Modal({ aberto, titulo, descricao, onFechar, children }: Props) {
  const referencia = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = referencia.current;
    if (!dialogo) return;

    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={referencia}
      aria-labelledby={idTitulo}
      onClose={onFechar}
      onClick={(evento) => {
        // Clique no fundo escurecido (o próprio <dialog>) fecha o modal.
        if (evento.target === evento.currentTarget) onFechar();
      }}
      className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-2xl bg-white p-0 text-escuro shadow-2xl backdrop:bg-escuro/60"
    >
      {aberto && (
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id={idTitulo} className="text-lg font-semibold">
                {titulo}
              </h2>
              {descricao && <p className="mt-1 text-xs text-escuro/60">{descricao}</p>}
            </div>
            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar"
              className={BOTAO_ICONE}
            >
              <Icone nome="fechar" />
            </button>
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
