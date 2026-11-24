import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirUsuario } from "@/lib/sessao";
import { listarUnidades } from "@/lib/dashboard/unidades";
import { listarDocumentos } from "@/lib/dashboard/documentos";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { formatarData } from "@/lib/dashboard/datas";
import { BadgeStatus, tomDocumento, tomStatusTarefa, tomUnidade } from "@/components/dashboard/ui/BadgeStatus";
import { CARTAO } from "@/components/dashboard/estilos";

export default async function DetalheUnidade({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await exigirUsuario();
  const { id } = await params;
  const [unidades, documentos, tarefas] = await Promise.all([
    listarUnidades(usuario.id), listarDocumentos(usuario.id), listarTarefas(usuario.id),
  ]);
  const unidade = unidades.find(u => u.id === id);
  if (!unidade) notFound();
  const docs = documentos.filter(d => d.unidadeId === id);
  const atividades = tarefas.filter(t => t.unidadeId === id);
  const inativa = unidade.situacao === "Inativa";
  return (
    <div className="grid gap-6">
      <Link href="/dashboard/unidades" className="text-sm text-painel underline">Voltar para unidades</Link>
      <header className={`${CARTAO} p-5`}>
        <h1 className="text-2xl font-semibold">{unidade.nome}</h1>
        <p className="my-2 text-sm">{unidade.cidade} · Responsável: {unidade.responsavel}</p>
        <BadgeStatus tom={tomUnidade[unidade.situacao]}>{unidade.situacao}</BadgeStatus>
        {inativa && <p role="status" className="mt-3 rounded-lg bg-aviso-fundo p-3 text-aviso text-sm">Unidade inativa: documentos e tarefas disponíveis somente para leitura.</p>}
      </header>
      <section className={`${CARTAO} p-5`}>
        <h2 className="font-semibold">Documentos vinculados ({docs.length})</h2>
        {docs.length === 0 ? <p className="mt-3 text-sm">Nenhum documento vinculado.</p> : <ul className="mt-3 divide-y divide-escuro/10">{docs.map(d => <li key={d.id} className="flex flex-wrap items-center gap-3 py-3 text-sm"><span className="flex-1">{d.nome} · {formatarData(d.vencimento)}</span><BadgeStatus tom={tomDocumento[d.situacao]}>{d.situacao}</BadgeStatus>{d.arquivoChave && <Link href={`/api/documentos/${d.id}/arquivo`} className="underline text-painel">Visualizar PDF</Link>}</li>)}</ul>}
        {!inativa && <Link className="mt-4 inline-block text-sm underline text-painel" href="/dashboard/documentos-nova">Gerenciar documentos</Link>}
      </section>
      <section className={`${CARTAO} p-5`}>
        <h2 className="font-semibold">Tarefas vinculadas ({atividades.length})</h2>
        {atividades.length === 0 ? <p className="mt-3 text-sm">Nenhuma tarefa vinculada.</p> : <ul className="mt-3 divide-y divide-escuro/10">{atividades.map(t => <li key={t.id} className="flex flex-wrap items-center gap-3 py-3 text-sm"><span className="flex-1">{t.titulo} · {t.responsavel} · {formatarData(t.prazo)}</span><BadgeStatus tom={tomStatusTarefa[t.status]}>{t.status}</BadgeStatus></li>)}</ul>}
        {!inativa && <Link className="mt-4 inline-block text-sm underline text-painel" href="/dashboard/tarefas">Gerenciar tarefas</Link>}
      </section>
    </div>
  );
}
