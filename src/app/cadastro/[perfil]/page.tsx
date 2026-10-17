import Link from "next/link";
import { notFound } from "next/navigation";
import FormCadastro from "../app/cadastro/FormCadastro";
import { PainelIlustracao } from "@/components/PainelIlustracao";

type Perfil = "empresa" | "funcionario";

const perfis: Record<Perfil, { nome: string; imagem: string }> = {
  empresa: {
    nome: "empresa",
    imagem: "/ilustracoes/empresa.svg",
  },
  funcionario: {
    nome: "funcionário",
    imagem: "/ilustracoes/funcionario.svg",
  },
};

export default async function CadastroPerfilPage({
  params,
}: {
  params: Promise<{ perfil: string }>;
}) {
  const { perfil } = await params;

  if (perfil !== "empresa" && perfil !== "funcionario") {
    notFound();
  }

  const configuracao = perfis[perfil];

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">
            Cadastro de {configuracao.nome}
          </h1>

          <p className="mb-3 text-center text-[11px]">
            Preencha os campos para criar sua conta.
          </p>

          <FormCadastro />

          <p className="mt-3 text-center text-xs text-white/70">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-white/60 hover:text-white">
              Entrar
            </Link>
          </p>
        </div>
      </section>

      <PainelIlustracao
        imagem={configuracao.imagem}
        alt={`Ilustração de ${configuracao.nome}`}
        etapa={2}
        legenda="Cadastro"
        className="md:w-[45%]"
      />
    </main>
  );
}
