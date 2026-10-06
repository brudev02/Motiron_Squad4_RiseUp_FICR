import Link from "next/link";
import InputSenha from "@/app/components/InputSenha";
import BotaoExtendido from "@/app/components/BotaoExtendido";

export default function RedefinirSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1D2029] px-5 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-[#344D6B] p-8 shadow-xl sm:p-10">
        <h1 className="text-3xl font-bold text-white">
          Redefinição de senha
        </h1>

        <p className="mb-8 mt-2 text-sm text-slate-300">
          Crie uma nova senha para sua conta.
        </p>

        <form className="flex flex-col gap-5">
          <InputSenha
            label="Nova senha"
            nome="novaSenha"
            placeholder="Digite a nova senha"
          />

          <InputSenha
            label="Confirmar nova senha"
            nome="confirmarNovaSenha"
            placeholder="Repita a nova senha"
          />

          <BotaoExtendido
            texto="Salvar"
            tipo="button"
          />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-violet-300 hover:text-white"
          >
            Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  );
}