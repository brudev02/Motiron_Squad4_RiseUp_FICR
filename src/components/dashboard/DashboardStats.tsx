import type { Resumo } from "@/lib/dashboard/tipos";
import { CartaoIndicador } from "./ui/BlocosSecao";

// Os quatro indicadores da Visão geral. Valores calculados no servidor a
// partir dos registros reais da conta.
export function DashboardStats({ totais }: { totais: Resumo["totais"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CartaoIndicador
        titulo="Unidades cadastradas"
        valor={totais.unidades}
        nota={
          totais.unidades === 0
            ? "Nenhuma unidade ainda"
            : `${totais.unidadesAtivas} ativa${totais.unidadesAtivas === 1 ? "" : "s"}`
        }
        icone="predio"
      />
      <CartaoIndicador
        titulo="Documentos ativos"
        valor={totais.documentosAtivos}
        nota={`${totais.documentos} monitorado${totais.documentos === 1 ? "" : "s"} no total`}
        icone="documento"
        tom="ok"
      />
      <CartaoIndicador
        titulo="Próximos vencimentos"
        valor={totais.aVencer}
        nota={
          totais.vencidos > 0
            ? `${totais.vencidos} já vencido${totais.vencidos === 1 ? "" : "s"} · próximos 30 dias`
            : "Nos próximos 30 dias"
        }
        icone="relogio"
        tom={totais.aVencer + totais.vencidos > 0 ? "aviso" : "destaque"}
      />
      <CartaoIndicador
        titulo="Tarefas pendentes"
        valor={totais.tarefasPendentes}
        nota={
          totais.tarefasAtrasadas > 0
            ? `${totais.tarefasAtrasadas} atrasada${totais.tarefasAtrasadas === 1 ? "" : "s"}`
            : "Nenhuma atrasada"
        }
        icone="tarefas"
        tom={totais.tarefasAtrasadas > 0 ? "perigo" : "destaque"}
      />
    </div>
  );
}
