"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputTexto from "@/app/components/InputTexto";
import InputSenha from "@/app/components/InputSenha";
import BotaoExtendido from "@/app/components/BotaoExtendido";

export default function FormCadastro() {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const dados = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    setCarregando(false);

    if (res.ok) {
      router.push("/login");
      return;
    }

    const json = await parseJsonSeguro(res);
    const primeiroErro = Object.values(json?.erros ?? {}).flat()[0] as string;
    setErro(primeiroErro ?? "Não foi possível criar a conta");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputTexto label="Nome completo" nome="nome" placeholder="Digite seu nome" />
      <InputTexto label="E-mail" nome="email" tipo="email" placeholder="Digite seu e-mail" />
      <InputSenha label="Senha" nome="senha" placeholder="Crie uma senha" />
      <InputSenha label="Confirmar senha" nome="confirmarSenha" placeholder="Digite a senha novamente" />

      {erro && <p className="text-sm text-red-300">{erro}</p>}

      <BotaoExtendido texto={carregando ? "Criando..." : "Criar conta"} tipo="submit" />
    </form>
  );
}