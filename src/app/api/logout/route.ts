import { NextResponse } from "next/server";
import { COOKIE_SESSAO, opcoesCookieSessao } from "@/lib/sessao";

// Encerra a sessão apagando o cookie. POST (e não GET) para que um link ou
// imagem de outro site não consiga deslogar o usuário.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSAO, "", { ...opcoesCookieSessao(false), maxAge: 0 });
  return res;
}
