import type { ReactNode } from "react";
import { Icone } from "@/components/ui/Icones";
import { BOTAO_ICONE } from "../estilos";

type Props = {
  /** Nome do registro, usado nos rótulos de acessibilidade. */
  nome: string;
  onEditar: () => void;
  onExcluir: () => void;
  /** Ações extras exibidas antes de editar/excluir (ex.: concluir tarefa). */
  extra?: ReactNode;
};

// Botões de ação de uma linha de tabela: editar e excluir.
export function AcoesLinha({ nome, onEditar, onExcluir, extra }: Props) {
  return (
    <div className="flex items-center justify-end gap-1">
      {extra}
      <button
        type="button"
        onClick={onEditar}
        aria-label={`Editar ${nome}`}
        title="Editar"
        className={BOTAO_ICONE}
      >
        <Icone nome="lapis" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onExcluir}
        aria-label={`Excluir ${nome}`}
        title="Excluir"
        className={`${BOTAO_ICONE} hover:bg-perigo-fundo hover:text-perigo`}
      >
        <Icone nome="lixeira" className="h-4 w-4" />
      </button>
    </div>
  );
}
