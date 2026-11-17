import { z } from "zod";
import { PERFIS } from "@/lib/dashboard/tipos";

// Schemas de autenticação. São usados tanto pelas APIs quanto pelos
// formulários (validação no navegador), para que as regras sejam as mesmas.

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
  // O formulário envia "on" quando a caixa está marcada.
  lembrar: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((valor) => valor === true || valor === "on" || valor === "true"),
});

function cnpjValido(cnpj: string): boolean {
  const valor = cnpj.toUpperCase();

  if (
    !/^[A-Z0-9]{12}\d{2}$/.test(valor) ||
    /^([A-Z0-9])\1{13}$/.test(valor)
  ) {
    return false;
  }

  const valores = [...valor].map(
    (caractere) => caractere.charCodeAt(0) - 48
  );

  function calcularDigito(base: number[], pesos: number[]) {
    const soma = base.reduce(
      (total, numero, indice) => total + numero * pesos[indice],
      0
    );
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const primeiro = calcularDigito(
    valores.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const segundo = calcularDigito(
    [...valores.slice(0, 12), primeiro],
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return valores[12] === primeiro && valores[13] === segundo;
}

function  cpfValido(cpf: string): boolean {
  if  (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  function calcularDigito(base: string, pesoInicial: number)  {
    const soma = [...base].reduce(
      (total, digito, indice) =>
        total + Number(digito) * (pesoInicial - indice),
      0
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return (
    calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(3, "Nome muito curto"),
    cpf: z.string().optional().transform((valor) => valor?.replace(/[.\s-]/g, "")),
    cnpj: z.string().optional().transform((valor) => valor?.replace(/[.\s/-]/g, "").toUpperCase()),
    email: z.string().trim().email("E-mail inválido"),
    senha: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
    confirmarSenha: z.string(),
    perfil: z.enum(PERFIS).optional(),
  })

  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

  .refine((d) => d.perfil !== "funcionario" || cpfValido(d.cpf ?? ""),
    {
      message:  "Informe um CPF válido.",
      path: ["cpf"],
    }
  )

  .refine((d) => (d.perfil ?? "empresa") !== "empresa" || cnpjValido(d.cnpj ?? ""),
    {
      message: "Informe um CNPJ válido.",
      path: ["cnpj"],
    }
  );

export const contaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter ao menos 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
});
