import { NextResponse } from "next/server";
import { z } from "zod";
import { exigirUsuarioApi, lerEValidar, responderErro } from "@/lib/api";
import {
  carregarDadosExemplo,
  removerDadosExemplo,
} from "@/lib/dashboard/demo";

const schema = z.object({
  acao: z.enum(["carregar", "remover"], { message: "Ação inválida." }),
});

// Carrega ou remove os dados de exemplo da conta logada (Configurações).
export async function POST(req: Request) {
  try {
    const usuario = await exigirUsuarioApi();
    const { acao } = await lerEValidar(req, schema);

    if (acao === "carregar") {
      await carregarDadosExemplo(usuario.id);
    } else {
      await removerDadosExemplo(usuario.id);
    }

    return NextResponse.json({ ok: true });
  } catch (erro) {
    return responderErro(erro);
  }
}
