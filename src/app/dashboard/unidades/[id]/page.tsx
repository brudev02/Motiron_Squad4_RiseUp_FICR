import { notFound } from "next/navigation";
import { DetalheUnidade } from "@/components/dashboard/DetalheUnidade";
import { listarDocumentos } from "@/lib/dashboard/documentos";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { buscarUnidade } from "@/lib/dashboard/unidades";
import { exigirUsuario } from "@/lib/sessao";

export default async function UnidadeDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usuario = await exigirUsuario();
  const { id } = await params;

  const unidade = await buscarUnidade(usuario.id, id);
  if (!unidade) notFound();

  const [todosDocumentos, todasTarefas] = await Promise.all([
    listarDocumentos(usuario.id),
    listarTarefas(usuario.id),
  ]);

  const documentos = todosDocumentos.filter((d) => d.unidadeId === unidade.id);
  const tarefas = todasTarefas.filter((t) => t.unidadeId === unidade.id);

  return (
    <DetalheUnidade unidade={unidade} documentos={documentos} tarefas={tarefas} />
  );
}