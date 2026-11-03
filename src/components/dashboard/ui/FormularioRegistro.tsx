"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { errosPorCampo, type Validador } from "@/lib/validacao/dashboard";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO } from "../estilos";
import type { RespostaApi } from "../useRecurso";

type Props<T> = {
  /** Mesmo schema usado pela API: as regras são idênticas nos dois lados. */
  schema: Validador<T>;
  /** Lê os campos do formulário e devolve o objeto a validar. */
  ler: (dados: FormData) => unknown;
  /** Envia para a API. Quem chama fecha o modal quando der certo. */
  onSalvar: (dados: T) => Promise<RespostaApi>;
  rotuloSalvar: string;
  onCancelar: () => void;
  /** Recebe os erros por campo e devolve os campos do formulário. */
  children: (erros: Record<string, string>) => ReactNode;
};

// Estrutura comum dos formulários de unidade, documento e tarefa:
// validação com mensagens por campo, estado de "salvando" e erro geral.
export function FormularioRegistro<T>({
  schema,
  ler,
  onSalvar,
  rotuloSalvar,
  onCancelar,
  children,
}: Props<T>) {
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando) return;

    const resultado = schema.safeParse(ler(new FormData(evento.currentTarget)));

    if (!resultado.success) {
      const porCampo = errosPorCampo(resultado.error.issues);
      setErros(
        Object.fromEntries(Object.entries(porCampo).map(([campo, lista]) => [campo, lista[0]]))
      );
      return;
    }

    setErros({});
    setSalvando(true);
    const resposta = await onSalvar(resultado.data);
    setSalvando(false);

    if (!resposta.ok) setErros(resposta.erros);
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      {children(erros)}

      {erros.geral && (
        <p role="alert" className="rounded-lg bg-perigo-fundo px-3 py-2 text-xs text-perigo">
          {erros.geral}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancelar} className={BOTAO_SECUNDARIO}>
          Cancelar
        </button>
        <button type="submit" disabled={salvando} className={BOTAO_PRIMARIO}>
          {salvando ? "Salvando..." : rotuloSalvar}
        </button>
      </div>
    </form>
  );
}
