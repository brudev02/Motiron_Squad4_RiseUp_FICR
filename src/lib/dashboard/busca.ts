/** Minúsculas e sem acentos, para pesquisar "joao" e achar "João". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Verdadeiro se algum dos campos contém o termo (ou se o termo está vazio). */
export function correspondeBusca(
  campos: (string | null | undefined)[],
  termo: string
): boolean {
  const procurado = normalizar(termo);
  if (!procurado) return true;

  return campos.some((campo) => normalizar(campo ?? "").includes(procurado));
}

export function valorDoCampo(dados: FormData, campo: string): string {
  return String(dados.get(campo) ?? "");
}
