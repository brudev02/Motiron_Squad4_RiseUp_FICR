import { NextResponse } from "next/server";
import {
  exigirUsuarioApi,
  lerEValidar,
  responderErro,
} from "@/lib/api";
import type { Validador } from "@/lib/validacao/dashboard";

// Fábrica das rotas REST de unidades, documentos e tarefas. Cada recurso
// só informa o schema de validação e as funções de acesso ao banco; a
// autenticação, a validação e o tratamento de erros ficam aqui, em um lugar.

export type Recurso<Entrada, Saida> = {
  schema: Validador<Entrada>;
  listar: (usuarioId: string) => Promise<Saida[]>;
  criar: (usuarioId: string, dados: Entrada) => Promise<Saida>;
  atualizar: (usuarioId: string, id: string, dados: Entrada) => Promise<Saida>;
  remover: (usuarioId: string, id: string) => Promise<void>;
};

type ContextoItem = { params: Promise<{ id: string }> };

/** GET (lista) e POST (cria) em /api/<recurso>. */
export function rotasDaColecao<Entrada, Saida>(recurso: Recurso<Entrada, Saida>) {
  return {
    async GET() {
      try {
        const usuario = await exigirUsuarioApi();
        return NextResponse.json({ itens: await recurso.listar(usuario.id) });
      } catch (erro) {
        return responderErro(erro);
      }
    },

    async POST(req: Request) {
      try {
        const usuario = await exigirUsuarioApi();
        const dados = await lerEValidar(req, recurso.schema);
        const item = await recurso.criar(usuario.id, dados);
        return NextResponse.json({ item }, { status: 201 });
      } catch (erro) {
        return responderErro(erro);
      }
    },
  };
}

/** PUT (edita) e DELETE (exclui) em /api/<recurso>/[id]. */
export function rotasDoItem<Entrada, Saida>(recurso: Recurso<Entrada, Saida>) {
  return {
    async PUT(req: Request, contexto: ContextoItem) {
      try {
        const usuario = await exigirUsuarioApi();
        const { id } = await contexto.params;
        const dados = await lerEValidar(req, recurso.schema);
        const item = await recurso.atualizar(usuario.id, id, dados);
        return NextResponse.json({ item });
      } catch (erro) {
        return responderErro(erro);
      }
    },

    async DELETE(_req: Request, contexto: ContextoItem) {
      try {
        const usuario = await exigirUsuarioApi();
        const { id } = await contexto.params;
        await recurso.remover(usuario.id, id);
        return NextResponse.json({ ok: true });
      } catch (erro) {
        return responderErro(erro);
      }
    },
  };
}
