import Link from "next/link";

export function Rodape() {
  return (
    <footer className="bg-escuro px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-semibold text-campo">Adgestion</p>
          <p className="text-[11px] text-white/50">Sua gestão, mais conectada.</p>
        </div>

        <p className="text-[11px] text-white/50">
          © {new Date().getFullYear()} Adgestion. Todos os direitos reservados.
        </p>

        <nav className="flex gap-6 text-[11px] text-white/60">
          <Link href="#" className="hover:text-white">Privacidade</Link>
          <Link href="#" className="hover:text-white">Termos de uso</Link>
        </nav>
      </div>
    </footer>
  );
}
