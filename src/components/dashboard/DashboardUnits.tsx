"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icone } from "@/components/ui/Icones";
import { correspondeBusca, valorDoCampo } from "@/lib/dashboard/busca";
import {
  SITUACOES_UNIDADE,
  type SituacaoUnidade,
  type UnidadeDTO,
} from "@/lib/dashboard/tipos";
import { unidadeSchema } from "@/lib/validacao/dashboard";
import { BOTAO_PRIMARIO, CARTAO, CONTROLE, TD, TH } from "./estilos";
import { useEdicao } from "./useEdicao";
import { useRecurso } from "./useRecurso";
import { AcoesLinha } from "./ui/AcoesLinha";
import { BadgeStatus, tomUnidade } from "./ui/BadgeStatus";
import { CabecalhoSecao, CartaoIndicador, EstadoVazio, SeloExemplo } from "./ui/BlocosSecao";
import { CampoBusca, useBusca } from "./ui/Busca";
import { CampoForm } from "./ui/CampoForm";
import { ConfirmarAcao } from "./ui/ConfirmarAcao";
import { FormularioRegistro } from "./ui/FormularioRegistro";
import { Modal } from "./ui/Modal";

const POR_PAGINA = 8;

type Props = {
  unidades: UnidadeDTO[];
  /** Abre o cadastro ao entrar (atalho ?novo=1 da Visão geral). */
  abrirNovo: boolean;
};

// Gestão de unidades: cadastro, edição, exclusão, pesquisa (nome,
// responsável ou cidade), filtro por situação, paginação e indicadores.
// Os dados vêm do banco (Prisma/SQLite) pelas APIs /api/unidades.
export function DashboardUnits({ unidades, abrirNovo }: Props) {
  const { busca } = useBusca();
  const edicao = useEdicao<UnidadeDTO>("/dashboard/unidades", abrirNovo);
  const { salvar, excluir, ocupado } = useRecurso("/api/unidades", {
    criado: "Unidade cadastrada com sucesso.",
    atualizado: "Unidade atualizada com sucesso.",
    excluido: "Unidade excluída.",
  });

  const [situacao, setSituacao] = useState<"" | SituacaoUnidade>("");
  const [paraExcluir, setParaExcluir] = useState<UnidadeDTO | null>(null);

  const ativas = unidades.filter((u) => u.situacao === "Ativa").length;

  const visiveis = useMemo(
    () =>
      unidades.filter(
        (u) =>
          (!situacao || u.situacao === situacao) &&
          correspondeBusca([u.nome, u.responsavel, u.cidade], busca)
      ),
    [unidades, situacao, busca]
  );

  const [pagina, setPagina] = useState(1);

  // Volta para a página 1 quando a busca ou o filtro mudam.
  const chaveFiltro = `${situacao}|${busca}`;
  const [chaveAnterior, setChaveAnterior] = useState(chaveFiltro);
  if (chaveFiltro !== chaveAnterior) {
    setChaveAnterior(chaveFiltro);
    setPagina(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(visiveis.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas); // evita página vazia após excluir
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const paginaVisivel = visiveis.slice(inicio, inicio + POR_PAGINA);

  const editando = edicao.alvo && edicao.alvo !== "novo" ? edicao.alvo : null;

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    await excluir(paraExcluir.id);
    setParaExcluir(null);
  }

  return (
    <>
      <CabecalhoSecao
        titulo="Unidades"
        descricao="Gerencie as unidades da organização."
        acao={
          <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
            <Icone nome="mais" /> Nova unidade
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <CartaoIndicador titulo="Total de unidades" valor={unidades.length} nota="Cadastradas na conta" icone="predio" />
        <CartaoIndicador titulo="Unidades ativas" valor={ativas} nota="Em operação" icone="checkCirculo" tom="ok" />
        <CartaoIndicador titulo="Unidades inativas" valor={unidades.length - ativas} nota="Fora de operação" icone="alerta" tom="aviso" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <CampoBusca placeholder="Buscar por nome, responsável ou cidade…" className="flex-1 md:hidden" />
        <select
          value={situacao}
          onChange={(e) => setSituacao(e.target.value as "" | SituacaoUnidade)}
          aria-label="Filtrar por situação"
          className={`${CONTROLE} sm:w-56`}
        >
          <option value="">Todas as situações</option>
          {SITUACOES_UNIDADE.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <section className={`${CARTAO} overflow-x-auto`}>
        {unidades.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma unidade cadastrada"
            texto="Cadastre a primeira unidade da sua organização ou carregue dados de exemplo em Configurações."
            acao={
              <button type="button" onClick={edicao.novo} className={BOTAO_PRIMARIO}>
                <Icone nome="mais" /> Nova unidade
              </button>
            }
          />
        ) : visiveis.length === 0 ? (
          <EstadoVazio titulo="Nada encontrado" texto="Nenhuma unidade corresponde à pesquisa ou ao filtro escolhido." />
        ) : (
          <>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-escuro/10">
                  <th className={TH}>Unidade</th>
                  <th className={TH}>Responsável</th>
                  <th className={TH}>Cidade</th>
                  <th className={TH}>Documentos</th>
                  <th className={TH}>Situação</th>
                  <th className={`${TH} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-escuro/5">
                {paginaVisivel.map((u) => (
                  <tr key={u.id}>
                    <td className={`${TD} font-medium`}>
                      <Link
                        href={`/dashboard/unidades/${u.id}`}
                        className="hover:underline focus-visible:underline"
                      >
                        {u.nome}
                      </Link>
                      {u.demo && <SeloExemplo />}
                    </td>
                    <td className={TD}>{u.responsavel}</td>
                    <td className={TD}>{u.cidade}</td>
                    <td className={TD}>{u.qtdDocumentos}</td>
                    <td className={TD}>
                      <BadgeStatus tom={tomUnidade[u.situacao]}>{u.situacao}</BadgeStatus>
                    </td>
                    <td className={TD}>
                      <AcoesLinha nome={u.nome} onEditar={() => edicao.editar(u)} onExcluir={() => setParaExcluir(u)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <nav
              aria-label="Paginação das unidades"
              className="flex flex-col items-center justify-between gap-3 border-t border-escuro/10 px-4 py-3 text-xs sm:flex-row"
            >
              <p aria-live="polite">
                Mostrando {inicio + 1}–{Math.min(inicio + POR_PAGINA, visiveis.length)} de {visiveis.length}
              </p>
              {totalPaginas > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className="rounded-lg border border-escuro/15 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className="rounded-lg border border-escuro/15 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </nav>
          </>
        )}
      </section>

      <Modal
        aberto={edicao.alvo !== null}
        titulo={editando ? "Editar unidade" : "Nova unidade"}
        descricao="Informe os dados da unidade."
        onFechar={edicao.fechar}
      >
        <FormularioRegistro
          schema={unidadeSchema}
          ler={(d) => ({
            nome: valorDoCampo(d, "nome"),
            responsavel: valorDoCampo(d, "responsavel"),
            cidade: valorDoCampo(d, "cidade"),
            situacao: valorDoCampo(d, "situacao"),
          })}
          onSalvar={async (dados) => {
            const resposta = await salvar(editando?.id ?? null, dados);
            if (resposta.ok) edicao.fechar();
            return resposta;
          }}
          rotuloSalvar={editando ? "Salvar alterações" : "Cadastrar unidade"}
          onCancelar={edicao.fechar}
        >
          {(erros) => (
            <>
              <CampoForm rotulo="Nome da unidade" erro={erros.nome}>
                <input name="nome" defaultValue={editando?.nome} className={CONTROLE} autoFocus />
              </CampoForm>
              <CampoForm rotulo="Responsável" erro={erros.responsavel}>
                <input name="responsavel" defaultValue={editando?.responsavel} className={CONTROLE} />
              </CampoForm>
              <CampoForm rotulo="Cidade" erro={erros.cidade}>
                <input name="cidade" defaultValue={editando?.cidade} className={CONTROLE} />
              </CampoForm>
              <CampoForm rotulo="Situação" erro={erros.situacao}>
                <select name="situacao" defaultValue={editando?.situacao ?? "Ativa"} className={CONTROLE}>
                  {SITUACOES_UNIDADE.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </CampoForm>
            </>
          )}
        </FormularioRegistro>
      </Modal>

      <ConfirmarAcao
        aberto={paraExcluir !== null}
        titulo="Excluir unidade"
        descricao={`Tem certeza que deseja excluir “${paraExcluir?.nome ?? ""}”? Os documentos e tarefas vinculados continuam cadastrados, mas ficam sem unidade. Unidades inativas com registros vinculados precisam ser reativadas antes da exclusão.`}
        rotuloConfirmar="Excluir"
        pendente={ocupado}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  );
}