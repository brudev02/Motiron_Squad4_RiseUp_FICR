import Link from "next/link";
import { FormRedefinirSenha } from "@/components/auth/FormRedefinirSenha";
import { PainelIlustracao } from "@/components/auth/PainelIlustracao";

export const metadata = { title: "Redefinir senha | Adgestion" };

export default function RedefinirSenhaPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">
            Redefinição de senha
          </h1>

          <p className="mb-3 text-center text-[11px]">
            Crie uma nova senha para sua conta.
          </p>

          <FormRedefinirSenha />

          <div className="mt-3 text-center">
            <Link
              href="/login"
              className="text-xs text-white/60 hover:text-white"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </section>

      <PainelIlustracao
        imagem="/ilustracoes/RecuperacaoSenha.svg"
        alt="Ilustração de recuperação de senha"
        className="md:w-[45%]"
      />
    </main>
  );
}