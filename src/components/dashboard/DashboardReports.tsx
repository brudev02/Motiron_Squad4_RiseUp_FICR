import { Icone } from "@/components/ui/Icones";
import {
  SITUACOES_DOCUMENTO,
  STATUS_TAREFA,
  type Resumo,
  type StatusTarefa,
} from "@/lib/dashboard/tipos";
import { BOTAO_SECUNDARIO, CARTAO } from "./estilos";
import { CabecalhoSecao, CartaoIndicador } from "./ui/BlocosSecao";

type Props = {
  totais: Resumo["totais"];
  distribuicaoDocumentos: Resumo["distribuicao"];
  tarefasPorStatus: Record<StatusTarefa, number>;
};

const exportacoes = [
  { tipo: "unidades", titulo: "Unidades", texto: "Nome, responsável, cidade, situação e documentos." },
  { tipo: "documentos", titulo: "Documentos", texto: "Unidade, responsável, vencimento e situação." },
  { tipo: "tarefas", titulo: "Tarefas", texto: "Responsável, prazo, prioridade, status e atraso." },
] as const;

function Linhas({ itens }: { itens: { rotulo: string; valor: number }[] }) {
  return (
    <ul className="divide-y divide-escuro/5 text-xs">
      {itens.map((item) => (
        <li key={item.rotulo} className="flex items-center justify-between py-2.5">
          <span className="text-escuro/70">{item.rotulo}</span>
          <b>{item.valor}</b>
        </li>
      ))}
    </ul>
  );
}

// Relatórios: resumo gerencial calculado a partir dos registros da conta e
// exportação em CSV (/api/relatorios/[tipo]). Server Component.
export function DashboardReports({ totais, distribuicaoDocumentos, tarefasPorStatus }: Props) {
  return (
    <>
      <CabecalhoSecao
        titulo="Relatórios"
        descricao="Resumo dos registros cadastrados na sua conta."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoIndicador titulo="Unidades" valor={totais.unidades} nota={`${totais.unidadesAtivas} ativas`} icone="predio" />
        <CartaoIndicador titulo="Documentos" valor={totais.documentos} nota="Cadastrados" icone="documento" tom="ok" />
        <CartaoIndicador titulo="Tarefas abertas" valor={totais.tarefasPendentes} nota="Pendentes ou em andamento" icone="tarefas" />
        <CartaoIndicador titulo="Vencidos" valor={totais.vencidos} nota="Exigem atenção" icone="alerta" tom={totais.vencidos > 0 ? "perigo" : "destaque"} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className={`${CARTAO} p-5`}>
          <h2 className="mb-2 text-sm font-semibold">Documentos por situação</h2>
          <Linhas
            itens={SITUACOES_DOCUMENTO.map((rotulo) => ({
              rotulo,
              valor: distribuicaoDocumentos.find((f) => f.rotulo === rotulo)?.valor ?? 0,
            }))}
          />
        </section>

        <section className={`${CARTAO} p-5`}>
          <h2 className="mb-2 text-sm font-semibold">Tarefas por status</h2>
          <Linhas
            itens={[
              ...STATUS_TAREFA.map((rotulo) => ({ rotulo, valor: tarefasPorStatus[rotulo] })),
              { rotulo: "Atrasadas (em aberto)", valor: totais.tarefasAtrasadas },
            ]}
          />
        </section>
      </div>

      <section className={`${CARTAO} p-5`}>
        <h2 className="text-sm font-semibold">Exportar dados</h2>
        <p className="mt-1 text-[11px] text-escuro/50">
          Arquivos CSV (separador “;”) que abrem direto no Excel.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {exportacoes.map((item) => (
            <div key={item.tipo} className="flex flex-col gap-3 rounded-xl border border-escuro/10 p-4">
              <div>
                <p className="text-sm font-semibold">{item.titulo}</p>
                <p className="mt-1 text-[11px] text-escuro/60">{item.texto}</p>
              </div>
              <a href={`/api/relatorios/${item.tipo}`} download className={`${BOTAO_SECUNDARIO} mt-auto`}>
                <Icone nome="baixar" /> Exportar CSV
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
