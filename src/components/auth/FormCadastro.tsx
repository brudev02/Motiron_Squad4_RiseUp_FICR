"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Campo } from "@/components/ui/Campo";
import { BotaoPrincipal } from "@/components/ui/BotaoPrincipal";
import { enviarJson, primeiraMensagem } from "@/lib/http";
import type { Perfil } from "@/lib/dashboard/tipos";

type Props = {
  perfil?: Perfil;
};

// Cadastro de uma nova conta. É independente do login: ao terminar, leva a
// pessoa para /login (etapa 3), onde ela entra com a conta recém-criada.
export function FormCadastro({ perfil }: Props) {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando) return;

    setErro("");
    setCarregando(true);

    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    const resposta = await enviarJson("/api/cadastro", "POST", { ...dados, perfil });

    if (resposta.ok) {
      router.push("/login?conta=criada");
      return;
    }

    setCarregando(false);
    setErro(
      resposta.falhaDeRede
        ? "Não foi possível conectar ao servidor. Tente novamente."
        : primeiraMensagem(resposta.json, "Não foi possível criar a conta")
    );
  }

  return (
    <form onSubmit={enviar} className="flex w-full flex-col gap-3">
      <Campo
        rotulo="Nome completo"
        name="nome"
        placeholder="Digite seu nome"
        autoComplete="name"
        required
      />
      <Campo
        rotulo="E-mail"
        type="email"
        name="email"
        placeholder="Digite seu e-mail"
        autoComplete="email"
        required
      />
      <Campo
        rotulo="Senha"
        senha
        name="senha"
        placeholder="Crie uma senha"
        autoComplete="new-password"
        required
      />
      <Campo
        rotulo="Confirmar senha"
        senha
        name="confirmarSenha"
        placeholder="Digite a senha novamente"
        autoComplete="new-password"
        required
      />

      {erro && (
        <p role="alert" className="text-sm text-red-300">
          {erro}
        </p>
      )}

      <BotaoPrincipal type="submit" largura="total" carregando={carregando}>
        {carregando ? "Criando..." : "Criar conta"}
      </BotaoPrincipal>
    </form>
  );
}
