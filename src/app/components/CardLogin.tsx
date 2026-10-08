"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputTexto from "./InputTexto";
import InputSenha from "./InputSenha";
import BotaoExtendido from "./BotaoExtendido";

export default function CardLogin() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function parseJsonSeguro(resposta: Response) {
    const texto = await resposta.text();
    const valor = texto.trim();

    if (!valor) return null;

    try {
      return JSON.parse(valor);
    } catch {
      return null;
    }
  }

  async function handleSubmit(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    const dados = Object.fromEntries(new FormData(evento.currentTarget));

    const resposta = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    setCarregando(false);

    if (resposta.ok) {
      router.push("/");
      return;
    }

    const json = await parseJsonSeguro(resposta);
    setErro(json?.erro ?? "Não foi possível entrar no sistema");
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-white">Bem-vindo de volta!</h1>

      <p className="mb-8 mt-2 text-sm text-slate-300">
        Acesse sua conta para gerenciar suas licenças.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputTexto
          label="E-mail"
          nome="email"
          tipo="email"
          placeholder="Digite seu e-mail"
        />

        <InputSenha
          label="Senha"
          nome="senha"
          placeholder="Digite sua senha"
        />

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="lembrar" />
          Lembrar de mim
        </label>

        {erro && <p className="text-sm text-red-300">{erro}</p>}

        <BotaoExtendido texto={carregando ? "Entrando..." : "Entrar"} tipo="submit" />
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center text-sm">
        <Link href="/redefinir-senha" className="text-indigo-300 hover:text-white">
          Esqueceu sua senha?
        </Link>

        <p className="text-slate-300">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-indigo-300 hover:text-white">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}