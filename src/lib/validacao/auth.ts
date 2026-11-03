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

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(3, "Nome muito curto"),
    email: z.string().trim().email("E-mail inválido"),
    senha: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
    confirmarSenha: z.string(),
    perfil: z.enum(PERFIS).optional(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export const contaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter ao menos 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
});
