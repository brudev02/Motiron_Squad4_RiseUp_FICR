"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icone } from "@/components/ui/Icones";
import type { UsuarioSessao } from "@/lib/dashboard/tipos";
import { enviarJson, primeiraMensagem } from "@/lib/http";
import { contaSchema } from "@/lib/validacao/auth";
import { BOTAO_PERIGO, BOTAO_PRIMARIO, BOTAO_SECUNDARIO, CARTAO, CONTROLE } from "./estilos";
import { CabecalhoSecao } from "./ui/BlocosSecao";
import { CampoForm } from "./ui/CampoForm";
import { ConfirmarAcao } from "./ui/ConfirmarAcao";
import { useToast } from "./ui/Toast";
import { useSair } from "./useSair";

type Props = {
  usuario: UsuarioSessao;
  /** A conta já tem registros de exemplo carregados. */
  temDadosExemplo: boolean;
};

const nomePerfil = { empresa: "Empresa", funcionario: "Funcionário" } as const;

// Configurações: dados da conta, dados de exemplo (opcionais) e sessão.
export function DashboardSettings({ usuario, temDadosExemplo }: Props) {
  const router = useRouter();
  const { notificar } = useToast();
  const { sair, saindo } = useSair();

  const [erroNome, setErroNome] = useState("");
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [processandoExemplo, setProcessandoExemplo] = useState(false);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);

  async function salvarNome(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvandoNome) return;

    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    const validacao = contaSchema.safeParse(dados);

    if (!validacao.success) {
      setErroNome(validacao.error.issues[0]?.message ?? "Confira o nome informado.");
      return;
    }

    setErroNome("");
    setSalvandoNome(true);
    const resposta = await enviarJson("/api/conta", "PATCH", validacao.data);
    setSalvandoNome(false);

    if (resposta.ok) {
      notificar("Nome atualizado com sucesso.");
      router.refresh();
    } else if (resposta.status === 401) {
      router.replace("/login");
    } else {
      setErroNome(
        resposta.falhaDeRede
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : primeiraMensagem(resposta.json, "Não foi possível atualizar o nome.")
      );
    }
  }

  async function alterarDadosExemplo(acao: "carregar" | "remover") {
    setProcessandoExemplo(true);
    const resposta = await enviarJson("/api/demo", "POST", { acao });
    setProcessandoExemplo(false);
    setConfirmandoRemocao(false);

    if (resposta.ok) {
      notificar(
        acao === "carregar"
          ? "Dados de exemplo carregados."
          : "Dados de exemplo removidos. Seus registros foram mantidos."
      );
      router.refresh();
    } else if (resposta.status === 401) {
      router.replace("/login");
    } else {
      notificar(
        resposta.falhaDeRede
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : primeiraMensagem(resposta.json, "Não foi possível concluir a operação."),
        "erro"
      );
    }
  }

  return (
    <>
      <CabecalhoSecao titulo="Configurações" descricao="Dados da conta, dados de exemplo e sessão." />

      <div className="grid max-w-3xl gap-6">
        <section className={`${CARTAO} p-5`}>
          <h2 className="text-sm font-semibold">Minha conta</h2>

          <form onSubmit={salvarNome} noValidate className="mt-4 grid gap-4">
            <CampoForm rotulo="Nome de exibição" erro={erroNome}>
              <input name="nome" defaultValue={usuario.nome} autoComplete="name" className={CONTROLE} />
            </CampoForm>

            <div className="grid gap-4 sm:grid-cols-2">
              <CampoForm rotulo="E-mail" dica="O e-mail não pode ser alterado.">
                <input value={usuario.email} readOnly disabled className={`${CONTROLE} bg-escuro/5`} />
              </CampoForm>
              <CampoForm rotulo="Perfil">
                <input value={nomePerfil[usuario.perfil]} readOnly disabled className={`${CONTROLE} bg-escuro/5`} />
              </CampoForm>
            </div>

            <div>
              <button type="submit" disabled={salvandoNome} className={BOTAO_PRIMARIO}>
                {salvandoNome ? "Salvando..." : "Salvar nome"}
              </button>
            </div>
          </form>
        </section>

        <section className={`${CARTAO} p-5`}>
          <h2 className="text-sm font-semibold">Dados de exemplo</h2>
          <p className="mt-1 text-xs text-escuro/60">
            Sua conta começa vazia. Para conhecer o painel, você pode carregar
            unidades, documentos e tarefas de exemplo (marcados com o selo
            “Exemplo”) e removê-los quando quiser. Os registros que você mesmo
            cadastrou nunca são apagados por esta opção.
          </p>

          <div className="mt-4">
            {temDadosExemplo ? (
              <button
                type="button"
                onClick={() => setConfirmandoRemocao(true)}
                disabled={processandoExemplo}
                className={BOTAO_SECUNDARIO}
              >
                <Icone nome="lixeira" /> Remover dados de exemplo
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alterarDadosExemplo("carregar")}
                disabled={processandoExemplo}
                className={BOTAO_SECUNDARIO}
              >
                <Icone nome="baixar" /> {processandoExemplo ? "Carregando..." : "Carregar dados de exemplo"}
              </button>
            )}
          </div>
        </section>

        <section className={`${CARTAO} p-5`}>
          <h2 className="text-sm font-semibold">Sessão</h2>
          <p className="mt-1 text-xs text-escuro/60">Encerre o acesso a este navegador.</p>
          <div className="mt-4">
            <button type="button" onClick={sair} disabled={saindo} className={BOTAO_PERIGO}>
              <Icone nome="sair" /> {saindo ? "Saindo..." : "Sair da conta"}
            </button>
          </div>
        </section>
      </div>

      <ConfirmarAcao
        aberto={confirmandoRemocao}
        titulo="Remover dados de exemplo"
        descricao="Todas as unidades, documentos e tarefas marcados como “Exemplo” serão excluídos. Os registros criados por você continuam cadastrados."
        rotuloConfirmar="Remover"
        pendente={processandoExemplo}
        onConfirmar={() => alterarDadosExemplo("remover")}
        onCancelar={() => setConfirmandoRemocao(false)}
      />
    </>
  );
}
