import Link from "next/link";
import { IconeLanding } from "./IconesLanding";
import { MockupDashboard } from "./MockupDashboard";

const garantias = ["Tudo centralizado", "Sua equipe conectada", "Mais controle sobre o fluxo"];

export function Hero() {
  return (
    <section id="plataforma" className="scroll-mt-16 bg-escuro px-6 pb-20 pt-14">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-destaque/40 bg-destaque/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-campo">
          <span className="h-1.5 w-1.5 rounded-full bg-destaque" />
          Gestão conectada, rotina simplificada
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
          Toda a gestão da sua empresa
          <br />
          <span className="text-campo">em um só lugar</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
          Conecte unidades, organize documentos e acompanhe tarefas em uma única
          plataforma. Menos processos dispersos, mais clareza para sua equipe.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-destaque px-6 text-sm font-medium text-white transition hover:brightness-110"
          >
            Começar agora
            <IconeLanding nome="seta" />
          </Link>
          <a
            href="#funcionalidades"
            className="inline-flex h-10 items-center rounded-md border border-white/30 px-6 text-sm font-medium transition hover:bg-white/10"
          >
            Conhecer a plataforma
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          {garantias.map((g) => (
            <li key={g} className="flex items-center gap-1.5">
              <IconeLanding nome="check" className="h-3.5 w-3.5 text-destaque" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-14 max-w-5xl">
        <MockupDashboard />
        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/50">
          <IconeLanding nome="escudo" className="h-3.5 w-3.5" />
          Uma visão integrada. Todas as frentes da operação.
        </p>
      </div>
    </section>
  );
}
