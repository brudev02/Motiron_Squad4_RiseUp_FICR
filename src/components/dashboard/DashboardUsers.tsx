import { formatarData } from "@/lib/dashboard/datas";
import type { UsuarioSessao } from "@/lib/dashboard/tipos";
import { CARTAO, TD, TH } from "./estilos";
import { BadgeStatus } from "./ui/BadgeStatus";
import { CabecalhoSecao } from "./ui/BlocosSecao";

const nomePerfil = { empresa: "Empresa", funcionario: "Funcionário" } as const;

// Administração de usuários. Hoje cada conta é independente (não existe
// modelo de empresa/equipe no banco), então a lista mostra a conta logada.
// Convites e permissões só serão exibidos quando esse modelo existir.
export function DashboardUsers({ usuario }: { usuario: UsuarioSessao }) {
  return (
    <>
      <CabecalhoSecao
        titulo="Usuários"
        descricao="Contas com acesso a este painel."
      />

      <section className={`${CARTAO} overflow-x-auto`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-escuro/10">
              <th className={TH}>Usuário</th>
              <th className={TH}>Perfil</th>
              <th className={TH}>Conta criada em</th>
              <th className={TH}>Acesso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={TD}>
                <b className="block">{usuario.nome}</b>
                <span className="text-escuro/60">{usuario.email}</span>
              </td>
              <td className={TD}>{nomePerfil[usuario.perfil]}</td>
              <td className={TD}>{formatarData(usuario.criadoEm.slice(0, 10))}</td>
              <td className={TD}>
                <BadgeStatus tom="ok">Ativo (você)</BadgeStatus>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <p className="mt-4 rounded-xl border border-escuro/10 bg-white px-4 py-3 text-xs text-escuro/60">
        Convite de outros usuários e controle de permissões ainda não estão
        disponíveis: dependem de um cadastro de empresa e equipe que será
        implementado em uma próxima etapa. Por isso este painel mostra somente a
        sua conta.
      </p>
    </>
  );
}
