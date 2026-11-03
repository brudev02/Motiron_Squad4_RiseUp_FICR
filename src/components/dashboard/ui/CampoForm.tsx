import type { ReactNode } from "react";

type Props = {
  rotulo: string;
  erro?: string;
  /** Texto de ajuda abaixo do campo. */
  dica?: string;
  className?: string;
  children: ReactNode;
};

// Rótulo + controle + mensagem de erro dos formulários em modal.
// O controle (input/select) vem como filho e usa a classe CONTROLE.
export function CampoForm({ rotulo, erro, dica, className = "", children }: Props) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs font-medium text-escuro/70 ${className}`}>
      {rotulo}
      {children}
      {dica && !erro && <span className="text-[11px] font-normal text-escuro/50">{dica}</span>}
      {erro && (
        <span role="alert" className="text-[11px] font-medium text-perigo">
          {erro}
        </span>
      )}
    </label>
  );
}
