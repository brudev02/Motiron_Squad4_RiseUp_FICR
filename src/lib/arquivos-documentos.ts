import { unlink } from "node:fs/promises";
import path from "node:path";

// Caminho onde os PDFs dos documentos são armazenados.
export const PASTA_ARQUIVOS = path.join(
  process.cwd(),
  "private_uploads",
  "documentos"
);

// Monta o caminho somente para chaves no formato UUID + .pdf.
export function obterCaminhoArquivo(chave: string) {
  if (!/^[0-9a-f-]{36}\.pdf$/i.test(chave)) {
    throw new Error("Arquivo não encontrado.");
  }

  return path.join(PASTA_ARQUIVOS, chave);
}

// Exclui o PDF, caso ele exista.
export async function excluirArquivoDocumento(chave: string | null) {
  if (!chave) return;

  try {
    await unlink(obterCaminhoArquivo(chave));
  } catch (erro) {
    // Ignora somente o caso em que o arquivo já não existe.
    if ((erro as NodeJS.ErrnoException).code !== "ENOENT") {
      throw erro;
    }
  }
}
