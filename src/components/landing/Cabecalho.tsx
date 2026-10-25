import Link from "next/link";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-escuro/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold text-campo">
          Adgestion
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#plataforma" className="transition hover:text-white">
            Plataforma
          </a>
          <a href="#funcionalidades" className="transition hover:text-white">
            Funcionalidades
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Botões ligados às telas existentes */}
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-md border border-white/30 px-4 text-sm font-medium transition hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex h-9 items-center rounded-md bg-destaque px-4 text-sm font-medium text-white transition hover:brightness-110"
          >
            Começar agora
          </Link>
        </div>
      </div>
    </header>
  );
}
