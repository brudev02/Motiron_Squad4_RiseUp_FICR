"use client";

import { useMemo, useState } from "react";
import { Icone } from "@/components/ui/Icones";
import { correspondeBusca, valorDoCampo } from "@/lib/dashboard/busca";
import { formatarData } from "@/lib/dashboard/datas";
import {
  PRIORIDADES,
  STATUS_TAREFA,
  type StatusTarefa,
  type TarefaDTO,
} from "@/lib/dashboard/tipos";
import { tarefaSchema } from "@/lib/validacao/dashboard";
import { BOTAO_ICONE, BOTAO_PRIMARIO, CARTAO, CONTROLE, TD, TH } from "./estilos";
import { useEdicao } from "./useEdicao";
import { useRecurso } from "./useRecurso";
import { AcoesLinha } from "./ui/AcoesLinha";
import { BadgeStatus, tomPrioridade, tomStatusTarefa } from "./ui/BadgeStatus";
import { CabecalhoSecao, CartaoIndicador, EstadoVazio, SeloExemplo } from "./ui/BlocosSecao";
import { CampoBusca, useBusca } from "./ui/Busca";
import { CampoForm } from "./ui/CampoForm";
import { ConfirmarAcao } from "./ui/ConfirmarAcao";
import { FormularioRegistro } from "./ui/FormularioRegistro";
import { Modal } from "./ui/Modal";

type Props = {
  tarefas: TarefaDTO[];
  abrirNovo: boolean;
};

// Gestão de tarefas: prazo, prioridade e status, com destaque para as
// atrasadas, pesquisa, filtro por status e atalho para concluir.
export function DashboardTasks({ tarefas, abrirNovo }: Props) {
  const { busca } = useBusca();
  const edicao = useEdicao<TarefaDTO>("/dashboard/tarefas", abrirNovo);
  const { salvar, excluir, ocupado } = useRecurso("/api/tarefas", {
    criado: "Tarefa criada com sucesso.",
    atualizado: "Tarefa atualizada com sucesso.",
    excluido: "Tarefa excluída.",
  });

  const [status, setStatus] = useState<"" | StatusTarefa>("");
  const [paraExcluir, setParaExcluir] = useState<TarefaDTO | null>(null);

  const contar = (s: StatusTarefa) => tarefas.filter((t) => t.status === s).length;
  const atrasadas = tarefas.filter((t) => t.atrasada).length;

  const visiveis = useMemo(
    () =>
      tarefas.filter(
        (t) =>
          (!status || t.status === status) &&
          correspondeBusca([t.titulo, t.responsavel], busca)
      ),
    [tarefas, status, busca]
  );

  const editando = edicao.alvo && edicao.alvo !== "novo" ? edicao.alvo : null;

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    await excluir(paraExcluir.id);
    setParaExcluir(null);
  }

  function concluir(tarefa: TarefaDTO) {
    return salvar(tarefa.id, {
      titulo: tarefa.titulo,
      responsavel: tarefa.responsavel,
      prazo: tarefa.prazo ?? "",
      prioridade: tarefa.prioridade,
      status: "Concluída",
    });
  }

  return (
    <>
      <CabecalhoSecao
        titulo="Tarefas"
        descricao="Organize atividades, responsáveis e prazos."
        acao={
          <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
            <Icone nome="mais" /> Nova tarefa
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoIndicador titulo="Pendentes" valor={contar("Pendente")} nota="Ainda não iniciadas" icone="tarefas" />
        <CartaoIndicador titulo="Em andamento" valor={contar("Em andamento")} nota="Sendo executadas" icone="relogio" tom="aviso" />
        <CartaoIndicador titulo="Concluídas" valor={contar("Concluída")} nota="Finalizadas" icone="checkCirculo" tom="ok" />
        <CartaoIndicador titulo="Atrasadas" valor={atrasadas} nota="Prazo vencido e em aberto" icone="alerta" tom={atrasadas > 0 ? "perigo" : "destaque"} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <CampoBusca placeholder="Buscar por tarefa ou responsável…" className="flex-1 md:hidden" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | StatusTarefa)}
          aria-label="Filtrar por status"
          className={`${CONTROLE} sm:w-56`}
        >
          <option value="">Todos os status</option>
          {STATUS_TAREFA.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <section className={`${CARTAO} overflow-x-auto`}>
        {tarefas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma tarefa cadastrada"
            texto="Crie tarefas com responsável e prazo para acompanhar a rotina da equipe."
            acao={
              <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
                <Icone nome="mais" /> Nova tarefa
              </button>
            }
          />
        ) : visiveis.length === 0 ? (
          <EstadoVazio titulo="Nada encontrado" texto="Nenhuma tarefa corresponde à pesquisa ou ao filtro escolhido." />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-escuro/10">
                <th className={TH}>Tarefa</th>
                <th className={TH}>Responsável</th>
                <th className={TH}>Prazo</th>
                <th className={TH}>Prioridade</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-escuro/5">
              {visiveis.map((t) => (
                <tr key={t.id}>
                  <td className={`${TD} font-medium`}>
                    {t.titulo}
                    {t.demo && <SeloExemplo />}
                  </td>
                  <td className={TD}>{t.responsavel}</td>
                  <td className={`${TD} whitespace-nowrap ${t.atrasada ? "font-semibold text-perigo" : ""}`}>
                    {formatarData(t.prazo)}
                    {t.atrasada && <span className="ml-1 text-[10px]">(atrasada)</span>}
                  </td>
                  <td className={TD}>
                    <BadgeStatus tom={tomPrioridade[t.prioridade]}>{t.prioridade}</BadgeStatus>
                  </td>
                  <td className={TD}>
                    <BadgeStatus tom={tomStatusTarefa[t.status]}>{t.status}</BadgeStatus>
                  </td>
                  <td className={TD}>
                    <AcoesLinha
                      nome={t.titulo}
                      onEditar={() => edicao.editar(t)}
                      onExcluir={() => setParaExcluir(t)}
                      extra={
                        t.status !== "Concluída" && (
                          <button
                            type="button"
                            onClick={() => concluir(t)}
                            disabled={ocupado}
                            aria-label={`Concluir ${t.titulo}`}
                            title="Marcar como concluída"
                            className={`${BOTAO_ICONE} hover:bg-ok-fundo hover:text-ok`}
                          >
                            <Icone nome="check" className="h-4 w-4" />
                          </button>
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Modal
        aberto={edicao.alvo !== null}
        titulo={editando ? "Editar tarefa" : "Nova tarefa"}
        descricao="Defina o responsável, o prazo e a prioridade."
        onFechar={edicao.fechar}
      >
        <FormularioRegistro
          schema={tarefaSchema}
          ler={(d) => ({
            titulo: valorDoCampo(d, "titulo"),
            responsavel: valorDoCampo(d, "responsavel"),
            prazo: valorDoCampo(d, "prazo"),
            prioridade: valorDoCampo(d, "prioridade"),
            status: valorDoCampo(d, "status"),
          })}
          onSalvar={async (dados) => {
            const resposta = await salvar(editando?.id ?? null, dados);
            if (resposta.ok) edicao.fechar();
            return resposta;
          }}
          rotuloSalvar={editando ? "Salvar alterações" : "Criar tarefa"}
          onCancelar={edicao.fechar}
        >
          {(erros) => (
            <>
              <CampoForm rotulo="Título da tarefa" erro={erros.titulo}>
                <input name="titulo" defaultValue={editando?.titulo} className={CONTROLE} autoFocus />
              </CampoForm>
              <CampoForm rotulo="Responsável" erro={erros.responsavel}>
                <input name="responsavel" defaultValue={editando?.responsavel} className={CONTROLE} />
              </CampoForm>
              <CampoForm rotulo="Prazo" erro={erros.prazo}>
                <input type="date" name="prazo" defaultValue={editando?.prazo ?? ""} className={CONTROLE} />
              </CampoForm>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoForm rotulo="Prioridade" erro={erros.prioridade}>
                  <select name="prioridade" defaultValue={editando?.prioridade ?? "Média"} className={CONTROLE}>
                    {PRIORIDADES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </CampoForm>
                <CampoForm rotulo="Status" erro={erros.status}>
                  <select name="status" defaultValue={editando?.status ?? "Pendente"} className={CONTROLE}>
                    {STATUS_TAREFA.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </CampoForm>
              </div>
            </>
          )}
        </FormularioRegistro>
      </Modal>

      <ConfirmarAcao
        aberto={paraExcluir !== null}
        titulo="Excluir tarefa"
        descricao={`Tem certeza que deseja excluir “${paraExcluir?.titulo ?? ""}”? Esta ação não pode ser desfeita.`}
        rotuloConfirmar="Excluir"
        pendente={ocupado}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  );
}
