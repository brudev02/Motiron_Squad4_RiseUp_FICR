"use client";

import { BOTAO_PERIGO, BOTAO_PRIMARIO, BOTAO_SECUNDARIO } from "../estilos";
import { Modal } from "./Modal";

type Props = {
  aberto: boolean;
  titulo: string;
  descricao: string;
  rotuloConfirmar: string;
  /** "perigo" para ações destrutivas (excluir). */
  tom?: "perigo" | "primario";
  pendente?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

// Confirmação em modal (substitui o window.confirm do navegador).
export function ConfirmarAcao({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar,
  tom = "perigo",
  pendente = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
      <p className="text-sm text-escuro/70">{descricao}</p>

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancelar} className={BOTAO_SECUNDARIO}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={pendente}
          className={tom === "perigo" ? BOTAO_PERIGO : BOTAO_PRIMARIO}
        >
          {pendente ? "Aguarde..." : rotuloConfirmar}
        </button>
      </div>
    </Modal>
  );
}
