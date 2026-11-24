import Link from "next/link";
import type { DocumentoDTO, TarefaDTO, UnidadeDTO } from "@/lib/dashboard/tipos";
import { CARTAO, TD, TH } from "./estilos";
import { BadgeStatus, tomPrioridade, tomStatusTarefa, tomUnidade } from "./ui/BadgeStatus";
import {
  CabecalhoSecao,
  CartaoIndicador,
  EstadoVazio,
  SeloExemplo,
} from "./ui/BlocosSecao";

type Props = {
  unidade: UnidadeDTO;
  documentos: DocumentoDTO[];
  tarefas: TarefaDTO[];
};

/** AAAA-MM-DD -> DD/MM/AAAA */
function formatarData(iso: string | null): string {
  if (!iso) return "Sem validade";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Detalhe de uma unidade: dados, documentos e tarefas vinculados.
export function DetalheUnidade({ unidade, documentos, tarefas }: Props) {
  const inativa = unidade.situacao === "Inativa";
  const pendentes = documentos.filter(
    (d) => d.situacao === "A vencer" || d.situacao === "Vencido"
  ).length;

  return (
    <>
      <p className="mb-3 text-xs">
        <Link href="/dashboard/unidades" className="hover:underline">
          ← Voltar para unidades
        </Link>
      </p>

      <CabecalhoSecao
        titulo={unidade.nome}
        descricao={`Responsável: ${unidade.responsavel} · ${unidade.cidade}`}
        acao={<BadgeStatus tom={tomUnidade[unidade.situacao]}>{unidade.situacao}</BadgeStatus>}
      />

      {unidade.demo && (
        <p className="mb-4">
          <SeloExemplo />
        </p>
      )}

      {inativa && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-escuro/15 px-4 py-3 text-xs"
        >
          Esta unidade está inativa. A página está em modo somente leitura:
          não é possível cadastrar, editar, excluir ou concluir registros vinculados, nem alterar anexos.
        </p>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <CartaoIndicador
          titulo="Documentos"
          valor={documentos.length}
          nota="Vinculados à unidade"
          icone="predio"
        />
        <CartaoIndicador
          titulo="Com atenção"
          valor={pendentes}
          nota="A vencer ou vencidos"
          icone="alerta"
          tom="aviso"
        />
        <CartaoIndicador
          titulo="Situação"
          valor={inativa ? 0 : 1}
          nota={inativa ? "Fora de operação" : "Em operação"}
          icone="checkCirculo"
          tom="ok"
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold">Documentos</h2>
      <section className={`${CARTAO} mb-8 overflow-x-auto`}>
        {documentos.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum documento vinculado"
            texto="Os documentos associados a esta unidade aparecerão aqui."
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-escuro/10">
                <th className={TH}>Documento</th>
                <th className={TH}>Responsável</th>
                <th className={TH}>Vencimento</th>
                <th className={TH}>Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-escuro/5">
              {documentos.map((d) => (
                <tr key={d.id}>
                  <td className={`${TD} font-medium`}>
                    {d.nome}
                    {d.demo && <SeloExemplo />}
                    {d.arquivoChave && <Link className="ml-2 underline text-painel" href={`/api/documentos/${d.id}/arquivo`}>Visualizar PDF</Link>}
                  </td>
                  <td className={TD}>{d.responsavel}</td>
                  <td className={TD}>{formatarData(d.vencimento)}</td>
                  <td className={TD}>{d.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {!inativa && <Link className="mb-4 inline-block text-sm underline text-painel" href="/dashboard/documentos-nova">Gerenciar documentos</Link>}

      <h2 className="mb-3 text-sm font-semibold">Tarefas</h2>
      <section className={`${CARTAO} overflow-x-auto`}>
        {tarefas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma tarefa vinculada"
            texto="As tarefas associadas a esta unidade aparecerão aqui."
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-escuro/10">
                <th className={TH}>Tarefa</th>
                <th className={TH}>Responsável</th>
                <th className={TH}>Prazo</th>
                <th className={TH}>Prioridade</th>
                <th className={TH}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-escuro/5">
              {tarefas.map((t) => (
                <tr key={t.id}>
                  <td className={`${TD} font-medium`}>
                    {t.titulo}
                    {t.demo && <SeloExemplo />}
                  </td>
                  <td className={TD}>{t.responsavel}</td>
                  <td className={TD}>{t.prazo ? formatarData(t.prazo) : "Sem prazo"}</td>
                  <td className={TD}>
                    <BadgeStatus tom={tomPrioridade[t.prioridade]}>{t.prioridade}</BadgeStatus>
                  </td>
                  <td className={TD}>
                    <BadgeStatus tom={tomStatusTarefa[t.status]}>{t.status}</BadgeStatus>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {!inativa && <Link className="mt-4 inline-block text-sm underline text-painel" href="/dashboard/tarefas">Gerenciar tarefas</Link>}
    </>
  );
}