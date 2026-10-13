
import Image from "next/image";
import type { ReactNode } from "react";
import { Etapas } from "./Etapas";

type Props = {
  imagem: string; 
  alt: string;
  etapa: 1 | 2 | 3;
  legenda: ReactNode; 
  acao: ReactNode; 
  topo?: ReactNode; 
  className?: string; 
};


export function PainelIlustracao({
  imagem,
  alt,
  etapa,
  legenda,
  acao,
  topo,
  className = "",
}: Props) {
  return (
    <aside
      className={`flex flex-col items-center justify-between gap-6 bg-escuro px-6 py-8 ${className}`}>
      {topo}

      <Image
        src={imagem}
        alt={alt}
        width={480}
        height={400}
        priority
        className="h-auto w-full max-w-md"/>

      <div className="flex flex-col items-center gap-3 text-center">
        <Etapas atual={etapa} />
        <p className="text-lg leading-snug">{legenda}</p>
        {acao}
      </div>
    </aside>
  );
}
