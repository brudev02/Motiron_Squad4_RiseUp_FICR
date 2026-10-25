import { Cabecalho } from "@/components/landing/Cabecalho";
import { Hero } from "@/components/landing/Hero";
import { Recursos } from "@/components/landing/Recursos";
import { Rodape } from "@/components/landing/Rodape";

// Landing page da Adgestion. Os botões "Entrar" e "Começar agora"
// levam para /login e /cadastro (ver Cabecalho.tsx e Hero.tsx).
export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <Hero />
        <Recursos />
      </main>
      <Rodape />
    </>
  );
}
