import CardLogin from "@/app/components/CardLogin";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#1D2029] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#293A50] p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-3xl font-bold text-violet-300">
            Adgestion
          </p>

          <p className="mt-3 max-w-sm text-sm text-slate-300">
            Organização e controle para suas licenças.
          </p>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-white">
            Tudo sob controle.
          </h2>

          <p className="mt-4 text-slate-300">
            Acesse seu espaço para acompanhar e gerenciar
            suas informações.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Adgestion · Área de acesso
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#344D6B] px-6 py-12 sm:px-12">
        <CardLogin />
      </section>
    </main>
  );
}