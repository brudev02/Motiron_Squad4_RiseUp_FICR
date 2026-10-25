import { IconeLanding, type NomeIconeLanding } from "./IconesLanding";

const recursos: {
  titulo: string;
  texto: string;
  icone: NomeIconeLanding;
  itens: string[];
}[] = [
  {
    titulo: "Gestão de Unidades",
    texto: "Uma visão completa de cada unidade, sem perder o contexto da empresa.",
    icone: "predio",
    itens: ["Informações e equipes centralizadas", "Acompanhamento por unidade"],
  },
  {
    titulo: "Controle de Documentos",
    texto: "Documentos organizados e fáceis de encontrar. Mais controle sobre o que importa.",
    icone: "documento",
    itens: ["Arquivos vinculados às unidades", "Validades e versões sob controle"],
  },
  {
    titulo: "Gerenciamento de Tarefas",
    texto: "Transforme prioridades em entregas, com clareza sobre prazos e responsáveis.",
    icone: "tarefas",
    itens: ["Responsabilidades bem definidas", "Andamento visível para a equipe"],
  },
];

export function Recursos() {
  return (
    <section
      id="funcionalidades"
      className="scroll-mt-16 bg-fundo-claro px-6 py-20 text-escuro"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-destaque">
              Menos complexidade, mais gestão
            </p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
              O essencial para sua operação fluir.
            </h2>
          </div>
          <p className="max-w-xs text-xs text-escuro/60">
            Três frentes conectadas para organizar o dia a dia da sua empresa com simplicidade.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {recursos.map((r) => (
            <article
              key={r.titulo}
              className="rounded-xl border border-escuro/10 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-campo/40 text-painel">
                <IconeLanding nome={r.icone} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{r.titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-escuro/60">{r.texto}</p>
              <ul className="mt-5 space-y-2 border-t border-escuro/10 pt-4 text-xs text-escuro/80">
                {r.itens.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <IconeLanding nome="check" className="h-3.5 w-3.5 text-destaque" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
