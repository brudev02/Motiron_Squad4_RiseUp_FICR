import Link from "next/link";
import FormCadastro from "./app/cadastro/FormCadastro";
import { PainelIlustracao } from "@/components/PainelIlustracao";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">Crie sua conta</h1>

          <p className="mb-3 text-center text-[11px]">
            Preencha os campos para começar.
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
        imagem="/ilustracoes/LoginArt.svg"
        alt="Ilustração de criação de conta"
        className="md:w-[45%]"
      />
    </main>
  );
}