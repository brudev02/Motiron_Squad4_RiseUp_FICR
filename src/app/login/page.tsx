import Link from "next/link";
import { redirect } from "next/navigation";
import { FormLogin } from "@/components/auth/FormLogin";
import { PainelIlustracao } from "@/components/auth/PainelIlustracao";
import { obterUsuarioAtual } from "@/lib/sessao";

export const metadata = { title: "Entrar | Adgestion" };

// Etapa 3 do acesso: entrada no sistema. Quem já está autenticado vai direto
// para o dashboard (a sessão é conferida no servidor).
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ conta?: string }>;
}) {
  if (await obterUsuarioAtual()) redirect("/dashboard");

  const { conta } = await searchParams;
  const aviso =
    conta === "criada"
      ? "Conta criada com sucesso! Entre com seu e-mail e senha."
      : undefined;

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">Bem-vindo de volta!</h1>
          <p className="mb-3 text-center text-[11px]">
            Acesse sua conta para acompanhar e gerenciar suas licenças
          </p>

          <FormLogin aviso={aviso} />

          <p className="mt-3 text-center text-xs text-white/70">
            Ainda não tem uma conta?{" "}
            <Link href="/cadastro" className="text-white hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </section>

      <PainelIlustracao
        className="md:w-[45%]"
        imagem="/ilustracoes/LoginArt.svg"
        alt="Ilustração de acesso seguro"
        etapa={3}
        legenda="Entrada no sistema"
      />
    </main>
  );
}
