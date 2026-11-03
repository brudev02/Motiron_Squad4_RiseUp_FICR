"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Icone } from "@/components/ui/Icones";
import { CONTROLE } from "../estilos";

type ContextoBusca = {
  busca: string;
  setBusca: (termo: string) => void;
};

const Contexto = createContext<ContextoBusca | null>(null);

// O termo digitado no cabeçalho e o campo de busca da seção são o MESMO
// estado. Ele é guardado junto com a rota: ao trocar de seção, volta a vazio
// sem precisar de efeitos.
export function BuscaProvider({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const [estado, setEstado] = useState({ caminho, termo: "" });

  const busca = estado.caminho === caminho ? estado.termo : "";
  const setBusca = useCallback(
    (termo: string) => setEstado({ caminho, termo }),
    [caminho]
  );

  const valor = useMemo(() => ({ busca, setBusca }), [busca, setBusca]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useBusca(): ContextoBusca {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useBusca precisa estar dentro de <BuscaProvider>.");
  return contexto;
}

type CampoBuscaProps = {
  placeholder: string;
  className?: string;
};

// Campo de pesquisa (lupa + texto) ligado ao termo compartilhado.
export function CampoBusca({ placeholder, className = "" }: CampoBuscaProps) {
  const { busca, setBusca } = useBusca();

  return (
    <div className={`relative ${className}`}>
      <Icone
        nome="busca"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-escuro/40"
      />
      <input
        type="search"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${CONTROLE} pl-9`}
      />
    </div>
  );
}
