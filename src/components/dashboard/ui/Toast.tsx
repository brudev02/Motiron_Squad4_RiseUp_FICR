"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icone, type NomeIcone } from "@/components/ui/Icones";

type TipoToast = "sucesso" | "erro" | "info";

type ItemToast = { id: number; mensagem: string; tipo: TipoToast };

type ContextoToast = {
  notificar: (mensagem: string, tipo?: TipoToast) => void;
};

const Contexto = createContext<ContextoToast | null>(null);

const DURACAO_MS = 4000;

const aparencia: Record<TipoToast, { classes: string; icone: NomeIcone }> = {
  sucesso: { classes: "bg-painel text-white", icone: "checkCirculo" },
  erro: { classes: "bg-perigo text-white", icone: "alerta" },
  info: { classes: "bg-escuro text-white", icone: "info" },
};

// Notificações visuais (toast) do dashboard. Fica no topo da árvore do
// dashboard; qualquer componente chama useToast().notificar("mensagem").
export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemToast[]>([]);
  const proximoId = useRef(0);

  const remover = useCallback((id: number) => {
    setItens((lista) => lista.filter((item) => item.id !== id));
  }, []);

  const notificar = useCallback(
    (mensagem: string, tipo: TipoToast = "sucesso") => {
      const id = ++proximoId.current;
      setItens((lista) => [...lista, { id, mensagem, tipo }]);
      window.setTimeout(() => remover(id), DURACAO_MS);
    },
    [remover]
  );

  const valor = useMemo(() => ({ notificar }), [notificar]);

  return (
    <Contexto.Provider value={valor}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-6"
      >
        {itens.map((item) => (
          <div
            key={item.id}
            role={item.tipo === "erro" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-xs font-medium shadow-lg ${aparencia[item.tipo].classes}`}
          >
            <Icone nome={aparencia[item.tipo].icone} className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{item.mensagem}</span>
            <button
              type="button"
              onClick={() => remover(item.id)}
              aria-label="Fechar notificação"
              className="opacity-70 hover:opacity-100"
            >
              <Icone nome="fechar" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Contexto.Provider>
  );
}

export function useToast(): ContextoToast {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  return contexto;
}
