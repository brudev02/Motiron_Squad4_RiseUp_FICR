
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icone } from "@/components/ui/Icones";
import { formatarData } from "@/lib/dashboard/datas";
import {
  SITUACOES_DOCUMENTO,
  type DocumentoDTO,
  type SituacaoDocumento,
} from "@/lib/dashboard/tipos";

type UnidadeOpcao = {
  id: string;
  nome: string;
  situacao: "Ativa" | "Inativa";
};

type Props = {
  documentos: DocumentoDTO[];
  unidades: UnidadeOpcao[];
  abrirNovo: boolean;
};

type FormularioDocumento = {
  nome: string;
  responsavel: string;
  unidadeId: string;
  vencimento: string;
  emAnalise: boolean;
};

const FORMULARIO_VAZIO: FormularioDocumento = {
  nome: "",
  responsavel: "",
  unidadeId: "",
  vencimento: "",
  emAnalise: false,
};

// Limite de tamanho do PDF: 10 MB.
const TAMANHO_MAXIMO_PDF = 10 * 1024 * 1024;

const campo =
  "mt-1 h-10 w-full rounded-lg border border-escuro/15 bg-white px-3 text-sm text-escuro outline-none transition placeholder:text-escuro/40 focus:border-destaque focus:ring-2 focus:ring-destaque/30";

const botaoPrimario =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-painel px-4 text-xs font-semibold text-white transition hover:bg-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destaque disabled:cursor-not-allowed disabled:opacity-60";

const botaoSecundario =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-escuro/15 bg-white px-4 text-xs font-semibold text-escuro transition hover:bg-escuro/5 disabled:cursor-not-allowed disabled:opacity-60";

const tons: Record<SituacaoDocumento, string> = {
  Vigente: "bg-ok-fundo text-ok",
  "Em análise": "bg-campo/40 text-painel",
  "A vencer": "bg-aviso-fundo text-aviso",
  Vencido: "bg-perigo-fundo text-perigo",
};

function CartaoResumo({
  titulo,
  valor,
  legenda,
  icone,
  tom = "normal",
}: {
  titulo: string;
  valor: number;
  legenda: string;
  icone: "documento" | "checkCirculo" | "relogio" | "alerta";
  tom?: "normal" | "ok" | "aviso" | "perigo";
}) {
  const fundos = {
    normal: "bg-campo/40 text-painel",
    ok: "bg-ok-fundo text-ok",
    aviso: "bg-aviso-fundo text-aviso",
    perigo: "bg-perigo-fundo text-perigo",
  };

  return (
    <article className="rounded-2xl border border-escuro/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 text-xs text-escuro/60">
        <span>{titulo}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${fundos[tom]}`}
        >
          <Icone nome={icone} className="h-[18px] w-[18px]" />
        </span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-escuro">
        {valor}
      </p>

      <p className="mt-1 text-[11px] text-escuro/50">{legenda}</p>
    </article>
  );
}

// Extrai a mensagem enviada pela API quando ocorre algum erro.
function mensagemErro(dados: unknown): string {
  if (dados && typeof dados === "object" && "erros" in dados) {
    const erros = (dados as { erros?: Record<string, string[]> }).erros;

    if (erros) {
      const primeira = Object.values(erros).flat()[0];
      if (primeira) return primeira;
    }
  }

  if (dados && typeof dados === "object" && "mensagem" in dados) {
    const mensagem = (dados as { mensagem?: string }).mensagem;
    if (mensagem) return mensagem;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

// Obtém o ID do documento retornado pela API.
function obterIdDocumento(dados: unknown): string | null {
  if (
    dados &&
    typeof dados === "object" &&
    "item" in dados &&
    dados.item &&
    typeof dados.item === "object" &&
    "id" in dados.item &&
    typeof dados.item.id === "string"
  ) {
    return dados.item.id;
  }

  return null;
}

export function DashboardDocumentsNova({
  documentos,
  unidades,
  abrirNovo,
}: Props) {
  const router = useRouter();

  const [termo, setTermo] = useState("");
  const [filtro, setFiltro] = useState<"" | SituacaoDocumento>("");
  const [modalAberto, setModalAberto] = useState(abrirNovo);
  const [documentoEditando, setDocumentoEditando] =
    useState<DocumentoDTO | null>(null);
  const [documentoExcluindo, setDocumentoExcluindo] =
    useState<DocumentoDTO | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioDocumento>(FORMULARIO_VAZIO);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [removendoArquivo, setRemovendoArquivo] = useState(false);

  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  // Guarda o PDF selecionado no formulário.
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null
  );

  // Guarda o ID caso o cadastro seja salvo, mas o envio do PDF falhe.
  const [documentoIdSalvo, setDocumentoIdSalvo] = useState<string | null>(
    null
  );

  // Controla a exibição do PDF atual depois de removê-lo.
  const [arquivoAtualRemovido, setArquivoAtualRemovido] = useState(false);

  // Abre o formulário quando a página recebe o parâmetro novo=1.
  useEffect(() => {
    if (abrirNovo) {
      setModalAberto(true);
    }
  }, [abrirNovo]);

  // Conta quantos documentos existem em cada situação.
  const contar = (situacao: SituacaoDocumento) =>
    documentos.filter((documento) => documento.situacao === situacao).length;

  // Filtra os documentos pela pesquisa e pela situação selecionada.
  const documentosVisiveis = useMemo(() => {
    const busca = termo.trim().toLocaleLowerCase("pt-BR");

    return documentos.filter((documento) => {
      const correspondeSituacao = !filtro || documento.situacao === filtro;

      const texto = [
        documento.nome,
        documento.responsavel,
        documento.unidadeNome ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return correspondeSituacao && (!busca || texto.includes(busca));
    });
  }, [documentos, filtro, termo]);

  // Limpa os dados temporários ao abrir um novo cadastro.
  function abrirCadastro() {
    setDocumentoEditando(null);
    setFormulario(FORMULARIO_VAZIO);
    setArquivoSelecionado(null);
    setDocumentoIdSalvo(null);
    setArquivoAtualRemovido(false);
    setErro("");
    setAviso("");
    setModalAberto(true);
  }

  // Preenche o formulário com os dados do documento escolhido.
  function abrirEdicao(documento: DocumentoDTO) {
    setDocumentoEditando(documento);

    setFormulario({
      nome: documento.nome,
      responsavel: documento.responsavel,
      unidadeId: documento.unidadeId ?? "",
      vencimento: documento.vencimento ?? "",
      emAnalise: documento.emAnalise,
    });

    setArquivoSelecionado(null);
    setDocumentoIdSalvo(null);
    setArquivoAtualRemovido(false);
    setErro("");
    setAviso("");
    setModalAberto(true);
  }

  // Atualiza um campo específico do formulário.
  function atualizarCampo<K extends keyof FormularioDocumento>(
    chave: K,
    valor: FormularioDocumento[K]
  ) {
    setFormulario((atual) => ({ ...atual, [chave]: valor }));
  }

  // Confere o formato e o tamanho antes de aceitar o arquivo.
  function selecionarArquivo(arquivo: File | null) {
    setErro("");

    if (!arquivo) {
      setArquivoSelecionado(null);
      return;
    }

    if (!arquivo.name.toLowerCase().endsWith(".pdf")) {
      setErro("Selecione um arquivo com extensão PDF.");
      setArquivoSelecionado(null);
      return;
    }

    if (arquivo.type && arquivo.type !== "application/pdf") {
      setErro("O arquivo selecionado não é um PDF válido.");
      setArquivoSelecionado(null);
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_PDF) {
      setErro("O PDF deve ter no máximo 10 MB.");
      setArquivoSelecionado(null);
      return;
    }

    setArquivoSelecionado(arquivo);
  }

  // Envia o PDF para a rota específica do documento.
  async function enviarArquivo(documentoId: string, arquivo: File) {
    const dados = new FormData();

    dados.append("arquivo", arquivo);

    const resposta = await fetch(
      `/api/documentos/${documentoId}/arquivo`,
      {
        method: "POST",
        body: dados,
      }
    );

    const retorno: unknown = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(mensagemErro(retorno));
    }
  }

  // Salva os dados do documento e, depois, envia o PDF selecionado.
  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setAviso("");

    if (formulario.nome.trim().length < 2) {
      setErro("Informe o nome do documento com pelo menos 2 caracteres.");
      return;
    }

    if (formulario.responsavel.trim().length < 2) {
      setErro("Informe o responsável com pelo menos 2 caracteres.");
      return;
    }

    setSalvando(true);

    try {
      let idDocumento = documentoEditando?.id ?? documentoIdSalvo;

      const resposta = await fetch(
        idDocumento
          ? `/api/documentos/${idDocumento}`
          : "/api/documentos",
        {
          method: idDocumento ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );

      const dados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(mensagemErro(dados));
        return;
      }

      if (!idDocumento) {
        idDocumento = obterIdDocumento(dados);

        if (!idDocumento) {
          setErro(
            "O documento foi salvo, mas não foi possível identificar seu cadastro para anexar o PDF."
          );
          return;
        }

        setDocumentoIdSalvo(idDocumento);
      }

      if (arquivoSelecionado) {
        try {
          await enviarArquivo(idDocumento, arquivoSelecionado);
        } catch (erroUpload) {
          setErro(
            erroUpload instanceof Error
              ? `Os dados foram salvos, mas o PDF não foi enviado: ${erroUpload.message}`
              : "Os dados foram salvos, mas ocorreu um erro ao enviar o PDF. Tente novamente."
          );
          return;
        }
      }

      setModalAberto(false);
      setDocumentoIdSalvo(null);
      setArquivoSelecionado(null);

      setAviso(
        documentoEditando
          ? "Documento atualizado com sucesso."
          : "Documento cadastrado com sucesso."
      );

      router.refresh();
    } catch {
      setErro(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  // Remove o PDF associado sem excluir o cadastro do documento.
  async function removerArquivo() {
    if (!documentoEditando?.id) return;

    setRemovendoArquivo(true);
    setErro("");

    try {
      const resposta = await fetch(
        `/api/documentos/${documentoEditando.id}/arquivo`,
        { method: "DELETE" }
      );

      const dados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(mensagemErro(dados));
        return;
      }

      setArquivoAtualRemovido(true);
      setArquivoSelecionado(null);
      setAviso("PDF removido com sucesso.");

      router.refresh();
    } catch {
      setErro("Não foi possível remover o PDF. Tente novamente.");
    } finally {
      setRemovendoArquivo(false);
    }
  }

  // Exclui o cadastro do documento.
  async function confirmarExclusao() {
    if (!documentoExcluindo) return;

    setExcluindo(true);
    setErro("");

    try {
      const resposta = await fetch(
        `/api/documentos/${documentoExcluindo.id}`,
        { method: "DELETE" }
      );

      const dados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(mensagemErro(dados));
        return;
      }

      setDocumentoExcluindo(null);
      setAviso("Documento excluído com sucesso.");

      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-painel">
            <Icone nome="documento" /> Gestão documental

            <span className="rounded-full bg-campo/40 px-2 py-1 text-[10px]">
              Nova versão
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-escuro">Documentos</h1>

          <p className="mt-1 text-xs text-escuro/60">
            Organize licenças, contratos e acompanhe as datas de vencimento.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className={botaoPrimario}
        >
          <Icone nome="mais" /> Novo documento
        </button>
      </header>

      {aviso && (
        <div
          role="status"
          className="rounded-xl border border-ok/20 bg-ok-fundo px-4 py-3 text-xs text-ok"
        >
          {aviso}
        </div>
      )}

      {erro && !modalAberto && (
        <div
          role="alert"
          className="rounded-xl border border-perigo/20 bg-perigo-fundo px-4 py-3 text-xs text-perigo"
        >
          {erro}
        </div>
      )}

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resumo dos documentos"
      >
        <CartaoResumo
          titulo="Documentos"
          valor={documentos.length}
          legenda="Cadastrados na conta"
          icone="documento"
        />

        <CartaoResumo
          titulo="Vigentes"
          valor={contar("Vigente")}
          legenda="Dentro da validade"
          icone="checkCirculo"
          tom="ok"
        />

        <CartaoResumo
          titulo="A vencer"
          valor={contar("A vencer")}
          legenda="Acompanhar renovação"
          icone="relogio"
          tom="aviso"
        />

        <CartaoResumo
          titulo="Vencidos"
          valor={contar("Vencido")}
          legenda="Precisam de atenção"
          icone="alerta"
          tom="perigo"
        />
      </section>

      <section className="rounded-2xl border border-escuro/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Pesquisar documentos</span>

            <Icone
              nome="busca"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-escuro/40"
            />

            <input
              type="search"
              value={termo}
              onChange={(evento) => setTermo(evento.target.value)}
              placeholder="Buscar por documento, unidade ou responsável..."
              className={`${campo} mt-0 pl-9`}
            />
          </label>

          <label className="text-xs font-medium text-escuro/70 md:w-56">
            <span className="sr-only">Filtrar por situação</span>

            <select
              value={filtro}
              onChange={(evento) =>
                setFiltro(evento.target.value as "" | SituacaoDocumento)
              }
              className={`${campo} mt-0`}
            >
              <option value="">Todas as situações</option>

              {SITUACOES_DOCUMENTO.map((situacao) => (
                <option key={situacao} value={situacao}>
                  {situacao}
                </option>
              ))}
            </select>
          </label>
        </div>

        {documentos.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-campo/40 text-painel">
              <Icone nome="documento" className="h-6 w-6" />
            </span>

            <h2 className="text-sm font-semibold text-escuro">
              Nenhum documento cadastrado
            </h2>

            <p className="mt-1 max-w-sm text-xs text-escuro/60">
              Cadastre o primeiro documento para começar a acompanhar as
              informações.
            </p>

            <button
              type="button"
              onClick={abrirCadastro}
              className={`${botaoPrimario} mt-4`}
            >
              <Icone nome="mais" /> Cadastrar documento
            </button>
          </div>
        ) : documentosVisiveis.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h2 className="text-sm font-semibold text-escuro">
              Nenhum resultado encontrado
            </h2>

            <p className="mt-1 text-xs text-escuro/60">
              Altere a pesquisa ou o filtro para ver outros documentos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead>
                <tr className="border-b border-escuro/10">
                  {[
                    "Documento",
                    "Unidade",
                    "Responsável",
                    "Vencimento",
                    "Situação",
                    "Arquivo PDF",
                    "Ações",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      className="whitespace-nowrap px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-escuro/50"
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-escuro/5">
                {documentosVisiveis.map((documento) => (
                  <tr
                    key={documento.id}
                    className="transition hover:bg-fundo-claro/50"
                  >
                    <td className="px-3 py-4 font-semibold text-escuro">
                      {documento.nome}

                      {documento.demo && (
                        <span className="ml-2 rounded bg-escuro/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-escuro/50">
                          Exemplo
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-4 text-escuro/60">
                      {documento.unidadeNome ?? "Sem unidade"}
                    </td>

                    <td className="px-3 py-4 text-escuro/70">
                      {documento.responsavel}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-escuro/70">
                      {formatarData(documento.vencimento)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${tons[documento.situacao]}`}
                      >
                        {documento.situacao}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      {documento.arquivoNome && documento.arquivoChave ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/documentos/${documento.id}/arquivo`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-painel underline hover:text-escuro"
                          >
                            Visualizar
                          </a>

                          <a
                            href={`/api/documentos/${documento.id}/arquivo?download=1`}
                            className="font-medium text-painel underline hover:text-escuro"
                          >
                            Baixar
                          </a>
                        </div>
                      ) : (
                        <span className="text-escuro/40">Sem PDF</span>
                      )}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(documento)}
                          aria-label={`Editar ${documento.nome}`}
                          title="Editar"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-escuro/60 hover:bg-escuro/5 hover:text-escuro"
                        >
                          <Icone nome="lapis" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setErro("");
                            setDocumentoExcluindo(documento);
                          }}
                          aria-label={`Excluir ${documento.nome}`}
                          title="Excluir"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-perigo hover:bg-perigo-fundo"
                        >
                          <Icone nome="lixeira" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 border-t border-escuro/5 pt-3 text-[11px] text-escuro/50">
          Exibindo {documentosVisiveis.length} de {documentos.length} documento(s).
        </div>
      </section>

      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-escuro/60 p-4"
          role="presentation"
          onMouseDown={(evento) => {
            if (
              evento.target === evento.currentTarget &&
              !salvando &&
              !removendoArquivo
            ) {
              setModalAberto(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-documento"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 text-escuro shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-modal-documento"
                  className="text-lg font-semibold"
                >
                  {documentoEditando ? "Editar documento" : "Novo documento"}
                </h2>

                <p className="mt-1 text-xs text-escuro/60">
                  Preencha os dados e, se desejar, anexe o arquivo PDF.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={salvando || removendoArquivo}
                aria-label="Fechar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-escuro/60 hover:bg-escuro/5 disabled:opacity-50"
              >
                <Icone nome="fechar" />
              </button>
            </div>

            <form onSubmit={salvar} className="grid gap-4">
              <label className="text-xs font-medium text-escuro/70">
                Nome do documento

                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={formulario.nome}
                  onChange={(evento) =>
                    atualizarCampo("nome", evento.target.value)
                  }
                  placeholder="Ex.: Alvará de funcionamento"
                  className={campo}
                />
              </label>

              <label className="text-xs font-medium text-escuro/70">
                Responsável

                <input
                  required
                  minLength={2}
                  value={formulario.responsavel}
                  onChange={(evento) =>
                    atualizarCampo("responsavel", evento.target.value)
                  }
                  placeholder="Nome do responsável"
                  className={campo}
                />
              </label>

              <label className="text-xs font-medium text-escuro/70">
                Unidade

                <select
                  value={formulario.unidadeId}
                  onChange={(evento) =>
                    atualizarCampo("unidadeId", evento.target.value)
                  }
                  className={campo}
                >
                  <option value="">Sem unidade vinculada</option>

                  {unidades.map((unidade) => (
                    <option key={unidade.id} value={unidade.id}>
                      {unidade.nome} ({unidade.situacao})
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-medium text-escuro/70">
                Data de vencimento

                <input
                  type="date"
                  value={formulario.vencimento}
                  onChange={(evento) =>
                    atualizarCampo("vencimento", evento.target.value)
                  }
                  className={campo}
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-escuro/70">
                <input
                  type="checkbox"
                  checked={formulario.emAnalise}
                  onChange={(evento) =>
                    atualizarCampo("emAnalise", evento.target.checked)
                  }
                  className="h-4 w-4 accent-painel"
                />
                Documento em análise (renovação protocolada)
              </label>

              {/* Área de seleção e gerenciamento do PDF. */}
              <div className="rounded-xl border border-escuro/10 bg-fundo-claro/40 p-4">
                <h3 className="text-xs font-semibold text-escuro">
                  Arquivo PDF
                </h3>

                {documentoEditando?.arquivoNome &&
                  documentoEditando.arquivoChave &&
                  !arquivoAtualRemovido && (
                    <div className="mt-3 rounded-lg bg-white p-3">
                      <p className="break-all text-xs text-escuro/70">
                        PDF atual:{" "}
                        <strong>{documentoEditando.arquivoNome}</strong>
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs">
                        <a
                          href={`/api/documentos/${documentoEditando.id}/arquivo`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-painel underline"
                        >
                          Visualizar PDF
                        </a>

                        <a
                          href={`/api/documentos/${documentoEditando.id}/arquivo?download=1`}
                          className="font-medium text-painel underline"
                        >
                          Baixar PDF
                        </a>

                        <button
                          type="button"
                          onClick={removerArquivo}
                          disabled={removendoArquivo || salvando}
                          className="font-medium text-perigo underline disabled:opacity-50"
                        >
                          {removendoArquivo ? "Removendo..." : "Remover PDF"}
                        </button>
                      </div>
                    </div>
                  )}

                <label className="mt-3 block text-xs font-medium text-escuro/70">
                  {documentoEditando?.arquivoNome &&
                  documentoEditando.arquivoChave &&
                  !arquivoAtualRemovido
                    ? "Escolher outro PDF para substituir"
                    : "Selecionar PDF"}

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(evento) =>
                      selecionarArquivo(evento.target.files?.[0] ?? null)
                    }
                    className="mt-2 block w-full text-xs text-escuro/70 file:mr-3 file:rounded-lg file:border-0 file:bg-painel file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-escuro"
                  />
                </label>

                {arquivoSelecionado && (
                  <p className="mt-2 break-all text-xs text-ok">
                    PDF selecionado: {arquivoSelecionado.name}
                  </p>
                )}

                <p className="mt-2 text-[11px] text-escuro/50">
                  Formato permitido: PDF. Tamanho máximo: 10 MB.
                </p>
              </div>

              {erro && (
                <p
                  role="alert"
                  className="rounded-lg bg-perigo-fundo px-3 py-2 text-xs text-perigo"
                >
                  {erro}
                </p>
              )}

              <div className="mt-2 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  disabled={salvando || removendoArquivo}
                  className={botaoSecundario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando || removendoArquivo}
                  className={botaoPrimario}
                >
                  {salvando
                    ? "Salvando..."
                    : documentoEditando
                      ? "Salvar alterações"
                      : "Cadastrar documento"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {documentoExcluindo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-escuro/60 p-4"
          role="presentation"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-excluir-documento"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-escuro shadow-2xl"
          >
            <h2
              id="titulo-excluir-documento"
              className="text-lg font-semibold"
            >
              Excluir documento?
            </h2>

            <p className="mt-2 text-sm text-escuro/60">
              Tem certeza que deseja excluir{" "}
              <strong>{documentoExcluindo.nome}</strong>? Essa ação não pode
              ser desfeita.
            </p>

            {erro && (
              <p
                role="alert"
                className="mt-3 rounded-lg bg-perigo-fundo px-3 py-2 text-xs text-perigo"
              >
                {erro}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDocumentoExcluindo(null)}
                disabled={excluindo}
                className={botaoSecundario}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-perigo px-4 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
