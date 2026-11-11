
import Link from "next/link";
import { Icone, type NomeIcone } from "@/components/ui/Icones";
import { formatarData } from "@/lib/dashboard/datas";
import type {
  AtividadeDTO,
  DocumentoDTO,
  TipoAtividade,
} from "@/lib/dashboard/tipos";
import { CARTAO, TD, TH } from "./estilos";
import { BadgeStatus, tomDocumento } from "./ui/BadgeStatus";
import { EstadoVazio } from "./ui/BlocosSecao";

const iconeAtividade: Record<TipoAtividade, NomeIcone> = {
  unidade: "predio",
  documento: "documento",
  tarefa: "tarefas",
  sistema: "info",
};

// Duas listas da Visão geral: documentos que exigem atenção (vencidos ou a
// vencer) e a atividade recente da conta.
export function DocumentosAtencao({ documentos }: { documentos: DocumentoDTO[] }) {
  return (
    <section className={`${CARTAO} p-5`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Documentos que exigem atenção</h2>
          <p className="mt-1 text-[11px] text-escuro/50">Priorize as próximas renovações</p>
        </div>
        <Link
          href="/dashboard/documentos-nova"
          className="text-[11px] font-semibold text-painel hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {documentos.length === 0 ? (
        <EstadoVazio
          titulo="Nada exige atenção agora"
          texto="Documentos vencidos ou que vencem nos próximos 30 dias aparecem aqui."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-escuro/10">
                <th className={TH}>Documento</th>
                <th className={TH}>Unidade</th>
                <th className={TH}>Vencimento</th>
                <th className={TH}>Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-escuro/5">
              {documentos.map((documento) => (
                <tr key={documento.id}>
                  <td className={`${TD} font-medium`}>{documento.nome}</td>
                  <td className={`${TD} text-escuro/60`}>{documento.unidadeNome ?? "—"}</td>
                  <td className={`${TD} whitespace-nowrap`}>{formatarData(documento.vencimento)}</td>
                  <td className={TD}>
                    <BadgeStatus tom={tomDocumento[documento.situacao]}>
                      {documento.situacao}
                    </BadgeStatus>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function AtividadeRecente({ atividades }: { atividades: AtividadeDTO[] }) {
  return (
    <section className={`${CARTAO} p-5`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Atividade recente</h2>
          <p className="mt-1 text-[11px] text-escuro/50">Últimas movimentações registradas</p>
        </div>
        <Link
          href="/dashboard/tarefas"
          className="text-[11px] font-semibold text-painel hover:underline"
        >
          Ver tarefas
        </Link>
      </div>

      {atividades.length === 0 ? (
        <EstadoVazio
          titulo="Sem movimentações"
          texto="Cadastros, edições e exclusões feitos no painel aparecem aqui."
        />
      ) : (
        <ul className="divide-y divide-escuro/5">
          {atividades.map((atividade) => (
            <li key={atividade.id} className="flex items-start gap-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-campo/40 text-painel">
                <Icone nome={iconeAtividade[atividade.tipo]} className="h-4 w-4" />
              </span>
              <p className="min-w-0 flex-1 text-xs leading-snug">{atividade.descricao}</p>
              <span className="whitespace-nowrap text-[10px] text-escuro/50">
                {atividade.quando}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
