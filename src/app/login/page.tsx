"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Campo } from "../../components/Campo";
import { BotaoPrincipal } from "../../components/BotaoPrincipal";
import { PainelIlustracao } from "../../components/PainelIlustracao";

type Perfil = "empresa" | "funcionario";

const perfis: { id: Perfil; nome: string; imagem: string }[] = [
  { id: "empresa", nome: "Empresa", imagem: "/ilustracoes/empresa.svg" },
  { id: "funcionario", nome: "Funcionário", imagem: "/ilustracoes/funcionario.svg" },];

export default function Login() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  // O botão "Próximo" leva para a tela do perfil escolhido
  function proximo() {
    if (perfil) router.push(`/cadastro/${perfil}`);
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">Bem-Vindo de volta!</h1>
          <p className="mb-3 text-center text-[11px]">
            Acesse sua conta para acompanhar e gerenciar suas licenças
          </p>

          <form className="flex w-full flex-col gap-3">
            <Campo icone="usuario" placeholder="Nome completo" name="nomeCompleto" />
            <Campo icone="arroba" placeholder="Nome de usuário" name="usuario" />
            <Campo icone="email" type="email" placeholder="e-mail" name="email" />
            <Campo icone="cadeado" senha placeholder="Senha" name="senha" />

            <div className="flex items-center justify-between text-[10px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-destaque" />
                Lembrar de mim
              </label>
              <Link href="/redefinir-senha" className="text-white/60 hover:text-white">
                Esqueceu a senha?
              </Link>
            </div>
          </form>

          <hr className="my-3 w-full border-white/20" />

          <h2 className="text-lg">Escolha uma opção de perfil</h2>

          <div className="flex gap-4">
            {perfis.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPerfil(p.id)}
                aria-pressed={perfil === p.id}
                className={`relative h-24 w-24 overflow-hidden rounded-xl bg-campo shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition ${
                  perfil === p.id ? "ring-2 ring-white" : "opacity-90 hover:opacity-100"
                }`}>

                <Image src={p.imagem} alt="" fill className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-white/70 py-0.5 text-center text-xs font-bold text-escuro">
                  {p.nome}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PainelIlustracao
        className="md:w-[45%]"
        imagem="/ilustracoes/loginArt.svg"
        alt="Ilustração de acesso seguro"
        etapa={1}
        legenda="Criação de Conta"
        acao={<BotaoPrincipal onClick={proximo}>Próximo</BotaoPrincipal>}/>
    </main>
  );
}
