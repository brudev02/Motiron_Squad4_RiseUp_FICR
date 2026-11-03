import { exigirUsuarioApi, erroGeral, responderErro } from "@/lib/api";
import { gerarCsv } from "@/lib/dashboard/csv";
import { formatarData } from "@/lib/dashboard/datas";
import { listarDocumentos } from "@/lib/dashboard/documentos";
import { listarTarefas } from "@/lib/dashboard/tarefas";
import { listarUnidades } from "@/lib/dashboard/unidades";

// Exportação em CSV dos registros da conta logada:
//   /api/relatorios/unidades | documentos | tarefas

async function montar(tipo: string, usuarioId: string) {
  switch (tipo) {
    case "unidades": {
      const itens = await listarUnidades(usuarioId);
      return gerarCsv(
        ["Unidade", "Responsável", "Cidade", "Situação", "Documentos"],
        itens.map((u) => [u.nome, u.responsavel, u.cidade, u.situacao, u.qtdDocumentos])
      );
    }
    case "documentos": {
      const itens = await listarDocumentos(usuarioId);
      return gerarCsv(
        ["Documento", "Unidade", "Responsável", "Vencimento", "Situação"],
        itens.map((d) => [
          d.nome,
          d.unidadeNome ?? "",
          d.responsavel,
          formatarData(d.vencimento),
          d.situacao,
        ])
      );
    }
    case "tarefas": {
      const itens = await listarTarefas(usuarioId);
      return gerarCsv(
        ["Tarefa", "Responsável", "Prazo", "Prioridade", "Status", "Atrasada"],
        itens.map((t) => [
          t.titulo,
          t.responsavel,
          formatarData(t.prazo),
          t.prioridade,
          t.status,
          t.atrasada ? "Sim" : "Não",
        ])
      );
    }
    default:
      return null;
  }
}

export async function GET(
  _req: Request,
  contexto: { params: Promise<{ tipo: string }> }
) {
  try {
    const usuario = await exigirUsuarioApi();
    const { tipo } = await contexto.params;
    const csv = await montar(tipo, usuario.id);

    if (csv === null) throw erroGeral(404, "Relatório não encontrado.");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="adgestion-${tipo}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (erro) {
    return responderErro(erro);
  }
}
