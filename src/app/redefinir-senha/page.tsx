"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import InputTexto from "@/app/components/InputTexto";
import InputSenha from "@/app/components/InputSenha";
import BotaoExtendido from "@/app/components/BotaoExtendido";
import { PainelIlustracao } from "@/components/PainelIlustracao";

export default function RedefinirSenhaPage() {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso(false);
    setCarregando(true);

    const formulario = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(formulario));

    try {
      const resposta = await fetch("/api/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado: unknown = await resposta.json();

      if (!resposta.ok) {
        const mensagem =
          typeof resultado === "object" &&
          resultado !== null &&
          "erro" in resultado &&
          typeof resultado.erro === "string"
            ? resultado.erro
            : "Não foi possível redefinir a senha.";

        setErro(mensagem);
        return;
      }

      formulario.reset();
      setSucesso(true);
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-painel px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <h1 className="text-center text-3xl font-bold">
            Redefinição de senha
          </h1>

          <p className="mb-3 text-center text-[11px]">
            Crie uma nova senha para sua conta.
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            <InputTexto
              label="E-mail cadastrado"
              nome="email"
              tipo="email"
              placeholder="Digite o e-mail da sua conta"
            />

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

            {erro && (
              <p role="alert" className="text-sm text-red-300">
                {erro}
              </p>
            )}

            {sucesso && (
              <p role="status" className="text-sm text-green-300">
                Senha redefinida com sucesso. Você já pode entrar com a
                nova senha.
              </p>
            )}

            <BotaoExtendido
              texto={carregando ? "Salvando..." : "Salvar"}
              tipo="submit"
            />
          </form>

          <div className="mt-3 text-center">
            <Link
              href="/login"
              className="text-xs text-white/60 hover:text-white"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </section>

      <PainelIlustracao
        imagem="/ilustracoes/RecuperaçãoSenha.svg"
        alt="Ilustração de recuperação de senha"
        className="md:w-[45%]"
      />
    </main>
  );
}