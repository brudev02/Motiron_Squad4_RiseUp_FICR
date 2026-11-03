"use client";

import { useMemo, useState } from "react";
import { Icone } from "@/components/ui/Icones";
import { correspondeBusca, valorDoCampo } from "@/lib/dashboard/busca";
import { formatarData } from "@/lib/dashboard/datas";
import {
  SITUACOES_DOCUMENTO,
  type DocumentoDTO,
  type SituacaoDocumento,
  type UnidadeDTO,
} from "@/lib/dashboard/tipos";
import { documentoSchema } from "@/lib/validacao/dashboard";
import { BOTAO_PRIMARIO, CARTAO, CONTROLE, TD, TH } from "./estilos";
import { useEdicao } from "./useEdicao";
import { useRecurso } from "./useRecurso";
import { AcoesLinha } from "./ui/AcoesLinha";
import { BadgeStatus, tomDocumento } from "./ui/BadgeStatus";
import { CabecalhoSecao, CartaoIndicador, EstadoVazio, SeloExemplo } from "./ui/BlocosSecao";
import { CampoBusca, useBusca } from "./ui/Busca";
import { CampoForm } from "./ui/CampoForm";
import { ConfirmarAcao } from "./ui/ConfirmarAcao";
import { FormularioRegistro } from "./ui/FormularioRegistro";
import { Modal } from "./ui/Modal";

type Props = {
  documentos: DocumentoDTO[];
  /** Unidades da conta, para vincular o documento. */
  unidades: Pick<UnidadeDTO, "id" | "nome">[];
  abrirNovo: boolean;
};

// Gestão de documentos: validade, situação calculada (vigente, em análise,
// a vencer, vencido), pesquisa e filtro por situação.
export function DashboardDocuments({ documentos, unidades, abrirNovo }: Props) {
  const { busca } = useBusca();
  const edicao = useEdicao<DocumentoDTO>("/dashboard/documentos", abrirNovo);
  const { salvar, excluir, ocupado } = useRecurso("/api/documentos", {
    criado: "Documento cadastrado com sucesso.",
    atualizado: "Documento atualizado com sucesso.",
    excluido: "Documento excluído.",
  });

  const [situacao, setSituacao] = useState<"" | SituacaoDocumento>("");
  const [paraExcluir, setParaExcluir] = useState<DocumentoDTO | null>(null);

  const contar = (s: SituacaoDocumento) => documentos.filter((d) => d.situacao === s).length;

  const visiveis = useMemo(
    () =>
      documentos.filter(
        (d) =>
          (!situacao || d.situacao === situacao) &&
          correspondeBusca([d.nome, d.unidadeNome, d.responsavel], busca)
      ),
    [documentos, situacao, busca]
  );

  const editando = edicao.alvo && edicao.alvo !== "novo" ? edicao.alvo : null;

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    await excluir(paraExcluir.id);
    setParaExcluir(null);
  }

  return (
    <>
      <CabecalhoSecao
        titulo="Documentos"
        descricao="Centralize licenças, contratos e datas de vencimento."
        acao={
          <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
            <Icone nome="mais" /> Novo documento
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoIndicador titulo="Documentos" valor={documentos.length} nota="Monitorados na conta" icone="documento" />
        <CartaoIndicador titulo="Vigentes" valor={contar("Vigente")} nota="Dentro da validade" icone="checkCirculo" tom="ok" />
        <CartaoIndicador titulo="A vencer" valor={contar("A vencer")} nota="Nos próximos 30 dias" icone="relogio" tom="aviso" />
        <CartaoIndicador titulo="Vencidos" valor={contar("Vencido")} nota="Exigem renovação" icone="alerta" tom="perigo" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <CampoBusca placeholder="Buscar por documento, unidade ou responsável…" className="flex-1 md:hidden" />
        <select
          value={situacao}
          onChange={(e) => setSituacao(e.target.value as "" | SituacaoDocumento)}
          aria-label="Filtrar por situação"
          className={`${CONTROLE} sm:w-56`}
        >
          <option value="">Todas as situações</option>
          {SITUACOES_DOCUMENTO.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <section className={`${CARTAO} overflow-x-auto`}>
        {documentos.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum documento cadastrado"
            texto="Cadastre licenças, alvarás e contratos com a data de validade para acompanhar os vencimentos."
            acao={
              <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
                <Icone nome="mais" /> Novo documento
              </button>
            }
          />
        ) : visiveis.length === 0 ? (
          <EstadoVazio titulo="Nada encontrado" texto="Nenhum documento corresponde à pesquisa ou ao filtro escolhido." />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-escuro/10">
                <th className={TH}>Documento</th>
                <th className={TH}>Unidade</th>
                <th className={TH}>Responsável</th>
                <th className={TH}>Vencimento</th>
                <th className={TH}>Situação</th>
                <th className={`${TH} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-escuro/5">
              {visiveis.map((d) => (
                <tr key={d.id}>
                  <td className={`${TD} font-medium`}>
                    {d.nome}
                    {d.demo && <SeloExemplo />}
                  </td>
                  <td className={`${TD} text-escuro/60`}>{d.unidadeNome ?? "—"}</td>
                  <td className={TD}>{d.responsavel}</td>
                  <td className={`${TD} whitespace-nowrap`}>{formatarData(d.vencimento)}</td>
                  <td className={TD}>
                    <BadgeStatus tom={tomDocumento[d.situacao]}>{d.situacao}</BadgeStatus>
                  </td>
                  <td className={TD}>
                    <AcoesLinha nome={d.nome} onEditar={() => edicao.editar(d)} onExcluir={() => setParaExcluir(d)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Modal
        aberto={edicao.alvo !== null}
        titulo={editando ? "Editar documento" : "Novo documento"}
        descricao="Sem data de validade, o documento é considerado vigente."
        onFechar={edicao.fechar}
      >
        <FormularioRegistro
          schema={documentoSchema}
          ler={(d) => ({
            nome: valorDoCampo(d, "nome"),
            responsavel: valorDoCampo(d, "responsavel"),
            unidadeId: valorDoCampo(d, "unidadeId"),
            vencimento: valorDoCampo(d, "vencimento"),
            emAnalise: d.get("emAnalise") === "on",
          })}
          onSalvar={async (dados) => {
            const resposta = await salvar(editando?.id ?? null, dados);
            if (resposta.ok) edicao.fechar();
            return resposta;
          }}
          rotuloSalvar={editando ? "Salvar alterações" : "Cadastrar documento"}
          onCancelar={edicao.fechar}
        >
          {(erros) => (
            <>
              <CampoForm rotulo="Nome do documento" erro={erros.nome}>
                <input name="nome" defaultValue={editando?.nome} className={CONTROLE} autoFocus />
              </CampoForm>
              <CampoForm rotulo="Responsável" erro={erros.responsavel}>
                <input name="responsavel" defaultValue={editando?.responsavel} className={CONTROLE} />
              </CampoForm>
              <CampoForm rotulo="Unidade" erro={erros.unidadeId}>
                <select name="unidadeId" defaultValue={editando?.unidadeId ?? ""} className={CONTROLE}>
                  <option value="">Sem unidade vinculada</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
              </CampoForm>
              <CampoForm rotulo="Vencimento" erro={erros.vencimento}>
                <input type="date" name="vencimento" defaultValue={editando?.vencimento ?? ""} className={CONTROLE} />
              </CampoForm>
              <label className="flex items-center gap-2 text-xs text-escuro/70">
                <input type="checkbox" name="emAnalise" defaultChecked={editando?.emAnalise ?? false} className="accent-painel" />
                Documento em análise (renovação protocolada)
              </label>
            </>
          )}
        </FormularioRegistro>
      </Modal>

      <ConfirmarAcao
        aberto={paraExcluir !== null}
        titulo="Excluir documento"
        descricao={`Tem certeza que deseja excluir “${paraExcluir?.nome ?? ""}”? Esta ação não pode ser desfeita.`}
        rotuloConfirmar="Excluir"
        pendente={ocupado}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  );
}
