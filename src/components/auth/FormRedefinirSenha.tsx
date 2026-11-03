"use client";

import { useState, type FormEvent } from "react";
import { Campo } from "@/components/ui/Campo";
import { BotaoPrincipal } from "@/components/ui/BotaoPrincipal";
import { enviarJson, primeiraMensagem } from "@/lib/http";

export function FormRedefinirSenha() {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando) return;

    setErro("");
    setSucesso(false);
    setCarregando(true);

    const formulario = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(formulario));
    const resposta = await enviarJson("/api/redefinir-senha", "POST", dados);

    setCarregando(false);

    if (resposta.ok) {
      formulario.reset();
      setSucesso(true);
      return;
    }

    setErro(
      resposta.falhaDeRede
        ? "Não foi possível conectar ao servidor. Tente novamente."
        : primeiraMensagem(resposta.json, "Não foi possível redefinir a senha.")
    );
  }

  return (
    <form onSubmit={enviar} className="flex w-full flex-col gap-3">
      <Campo
        rotulo="E-mail cadastrado"
        type="email"
        name="email"
        placeholder="Digite o e-mail da sua conta"
        autoComplete="email"
        required
      />
      <Campo
        rotulo="Nova senha"
        senha
        name="novaSenha"
        placeholder="Digite a nova senha"
        autoComplete="new-password"
        required
      />
      <Campo
        rotulo="Confirmar nova senha"
        senha
        name="confirmarNovaSenha"
        placeholder="Repita a nova senha"
        autoComplete="new-password"
        required
      />

      {erro && (
        <p role="alert" className="text-sm text-red-300">
          {erro}
        </p>
      )}

      {sucesso && (
        <p role="status" className="text-sm text-green-300">
          Senha redefinida com sucesso. Você já pode entrar com a nova senha.
        </p>
      )}

      <BotaoPrincipal type="submit" largura="total" carregando={carregando}>
        {carregando ? "Salvando..." : "Salvar"}
      </BotaoPrincipal>
    </form>
  );
}
