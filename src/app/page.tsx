import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Adgestion</h1>

      <p>Sistema de gerenciamento de licenças</p>

      <Link href="/login">
        Entrar
      </Link>

      <br />

      <Link href="/cadastro">
        Criar conta
      </Link>
    </main>
  );
}