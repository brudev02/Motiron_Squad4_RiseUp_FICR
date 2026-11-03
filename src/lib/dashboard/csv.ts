type Celula = string | number | boolean | null | undefined;

// Células que começam com estes caracteres podem ser interpretadas como
// fórmula por planilhas (CSV injection). Prefixamos com apóstrofo.
const INICIO_PERIGOSO = /^[=+\-@\t\r]/;

function escapar(valor: Celula): string {
  if (valor === null || valor === undefined) return "";

  let texto = String(valor);
  if (typeof valor === "string" && INICIO_PERIGOSO.test(texto)) {
    texto = `'${texto}`;
  }

  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

/**
 * Gera um CSV com separador ";" e BOM UTF-8, que é o formato que o Excel
 * em português abre corretamente (acentos e colunas).
 */
export function gerarCsv(cabecalhos: string[], linhas: Celula[][]): string {
  const todas = [cabecalhos, ...linhas];
  return "﻿" + todas.map((linha) => linha.map(escapar).join(";")).join("\r\n");
}
