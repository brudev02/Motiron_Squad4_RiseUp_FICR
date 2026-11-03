import Link from "next/link";
import { PainelIlustracao } from "@/components/auth/PainelIlustracao";
import { SeletorPerfil } from "@/components/auth/SeletorPerfil";

export const metadata = { title: "Criar conta | Adgestion" };

// Etapa 1 do acesso: criação de conta (escolha do perfil). O cadastro é
// independente do login: quem já tem conta usa /login.
export default function CadastroPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">Crie sua conta</h1>
          <p className="mb-3 text-center text-[11px]">
            Escolha como você vai usar a Adgestion para começar.
          </p>

          <SeletorPerfil />

          <p className="mt-3 text-center text-xs text-white/70">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-white hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </section>

      <PainelIlustracao
        imagem="/ilustracoes/LoginArt.svg"
        alt="Ilustração de criação de conta"
        etapa={1}
        legenda="Criação de Conta"
        className="md:w-[45%]"
      />
    </main>
  );
}
