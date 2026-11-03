"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Campo } from "@/components/ui/Campo";
import { BotaoPrincipal } from "@/components/ui/BotaoPrincipal";
import { enviarJson, primeiraMensagem } from "@/lib/http";
import { loginSchema } from "@/lib/validacao/auth";

type Props = {
  /** Mensagem de sucesso exibida acima do formulário (ex.: conta recém-criada). */
  aviso?: string;
};

// Formulário real de autenticação: valida, chama /api/login e, se der certo,
// segue para /dashboard. A sessão fica no cookie httpOnly "sessao".
export function FormLogin({ aviso }: Props) {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando) return;

    setErro("");

    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    const validacao = loginSchema.safeParse(dados);

    if (!validacao.success) {
      setErro(validacao.error.issues[0]?.message ?? "Confira os dados informados.");
      return;
    }

    setCarregando(true);
    const resposta = await enviarJson("/api/login", "POST", validacao.data);

    if (resposta.ok) {
      // Mantém o botão em "Entrando..." até a nova página aparecer.
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setCarregando(false);

    if (resposta.falhaDeRede) {
      setErro("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    } else if (resposta.status >= 500) {
      setErro(primeiraMensagem(resposta.json, "Erro no servidor. Tente novamente em instantes."));
    } else {
      setErro(primeiraMensagem(resposta.json, "Não foi possível entrar no sistema."));
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex w-full flex-col gap-3">
      {aviso && (
        <p
          role="status"
          className="rounded-lg bg-white/10 px-3 py-2 text-center text-xs text-campo"
        >
          {aviso}
        </p>
      )}

      <Campo
        icone="email"
        type="email"
        name="email"
        placeholder="E-mail"
        aria-label="E-mail"
        autoComplete="email"
        required
      />
      <Campo
        icone="cadeado"
        senha
        name="senha"
        placeholder="Senha"
        aria-label="Senha"
        autoComplete="current-password"
        required
      />

      <div className="flex items-center justify-between text-[10px]">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="lembrar" className="accent-destaque" />
          Lembrar de mim
        </label>
        <Link href="/redefinir-senha" className="text-white/60 hover:text-white">
          Esqueceu a senha?
        </Link>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-300">
          {erro}
        </p>
      )}

      <BotaoPrincipal type="submit" largura="total" carregando={carregando}>
        {carregando ? "Entrando..." : "Entrar"}
      </BotaoPrincipal>
    </form>
  );
}
