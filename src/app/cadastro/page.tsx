import Link from "next/link";
import FormCadastro from "./app/cadastro/FormCadastro";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1D2029] px-5 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-[#344D6B] p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>

        <p className="mb-8 mt-2 text-sm text-slate-300">
          Preencha os campos para começar.
        </p>

        <FormCadastro />

        <p className="mt-6 text-center text-sm text-slate-300">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-violet-300">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}