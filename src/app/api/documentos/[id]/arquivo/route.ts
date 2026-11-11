
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  exigirUsuarioApi,
  erroGeral,
  responderErro,
} from "@/lib/api";

import {
  PASTA_ARQUIVOS,
  excluirArquivoDocumento,
  obterCaminhoArquivo,
} from "@/lib/arquivos-documentos";

// Utiliza o ambiente Node.js, necessário para acessar os arquivos do servidor.
export const runtime = "nodejs";

// Limite máximo de 10 MB por PDF.
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

type ContextoRota = {
  params: Promise<{ id: string }>;
};

// Localiza o documento e confirma que ele pertence ao usuário conectado.
async function buscarDocumento(id: string, usuarioId: string) {
  const documento = await prisma.documento.findFirst({
    where: { id, usuarioId },
    select: {
      id: true,
      nome: true,
      arquivoNome: true,
      arquivoChave: true,
      arquivoTipo: true,
    },
  });

  if (!documento) {
    throw erroGeral(404, "Documento não encontrado.");
  }

  return documento;
}

/**
 * Recebe um PDF, valida seu conteúdo e salva o arquivo.
 * O banco guarda somente o nome, o tipo e a chave interna.
 */
export async function POST(_req: Request, contexto: ContextoRota) {
  try {
    const usuario = await exigirUsuarioApi();
    const { id } = await contexto.params;

    const documento = await buscarDocumento(id, usuario.id);

    const formulario = await _req.formData();
    const arquivo = formulario.get("arquivo");

    if (!(arquivo instanceof File)) {
      throw erroGeral(400, "Selecione um arquivo PDF.");
    }

    if (arquivo.size === 0 || arquivo.size > TAMANHO_MAXIMO) {
      throw erroGeral(400, "O PDF deve ter até 10 MB e não pode estar vazio.");
    }

    if (
      !arquivo.name.toLowerCase().endsWith(".pdf") ||
      (arquivo.type !== "" && arquivo.type !== "application/pdf")
    ) {
      throw erroGeral(400, "Envie um arquivo com formato PDF.");
    }

    const conteudo = Buffer.from(await arquivo.arrayBuffer());

    // Confere a assinatura inicial do arquivo para evitar falsos PDFs.
    if (conteudo.subarray(0, 5).toString() !== "%PDF-") {
      throw erroGeral(400, "O conteúdo enviado não é um PDF válido.");
    }

    await mkdir(PASTA_ARQUIVOS, { recursive: true });

    const novaChave = `${randomUUID()}.pdf`;
    const novoCaminho = obterCaminhoArquivo(novaChave);

    // Salva o PDF com um nome aleatório, sem usar o nome enviado pelo usuário.
    await writeFile(novoCaminho, conteudo, { flag: "wx" });

    try {
      await prisma.documento.update({
        where: { id: documento.id },
        data: {
          arquivoNome: arquivo.name,
          arquivoChave: novaChave,
          arquivoTipo: "application/pdf",
        },
      });
    } catch (erro) {
      // Se o banco falhar, remove o arquivo recém-salvo.
      await excluirArquivoDocumento(novaChave);
      throw erro;
    }

    // Depois de atualizar o banco, remove o PDF anterior, se existir.
    if (documento.arquivoChave) {
      await excluirArquivoDocumento(documento.arquivoChave);
    }

    return NextResponse.json({
      mensagem: "PDF anexado com sucesso.",
      arquivoNome: arquivo.name,
    });
  } catch (erro) {
    return responderErro(erro);
  }
}

/**
 * Entrega o PDF somente ao usuário dono do documento.
 * Com ?download=1, o navegador baixa o arquivo.
 * Sem esse parâmetro, tenta abrir o PDF no próprio navegador.
 */
export async function GET(req: Request, contexto: ContextoRota) {
  try {
    const usuario = await exigirUsuarioApi();
    const { id } = await contexto.params;

    const documento = await buscarDocumento(id, usuario.id);

    if (!documento.arquivoChave || !documento.arquivoNome) {
      throw erroGeral(404, "Este documento ainda não possui PDF anexado.");
    }

    const caminho = obterCaminhoArquivo(documento.arquivoChave);
    const conteudo = await readFile(caminho);

    const baixar = new URL(req.url).searchParams.get("download") === "1";
    const disposicao = baixar ? "attachment" : "inline";

    return new NextResponse(new Uint8Array(conteudo), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(conteudo.length),
        "Content-Disposition": `${disposicao}; filename*=UTF-8''${encodeURIComponent(documento.arquivoNome)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (erro) {
    return responderErro(erro);
  }
}

/** Remove o PDF anexado sem excluir o cadastro do documento. */
export async function DELETE(_req: Request, contexto: ContextoRota) {
  try {
    const usuario = await exigirUsuarioApi();
    const { id } = await contexto.params;

    const documento = await buscarDocumento(id, usuario.id);

    if (!documento.arquivoChave) {
      throw erroGeral(404, "Este documento não possui PDF anexado.");
    }

    await prisma.documento.update({
      where: { id: documento.id },
      data: {
        arquivoNome: null,
        arquivoChave: null,
        arquivoTipo: null,
      },
    });

    await excluirArquivoDocumento(documento.arquivoChave);

    return NextResponse.json({
      mensagem: "PDF removido com sucesso.",
    });
  } catch (erro) {
    return responderErro(erro);
  }
}
