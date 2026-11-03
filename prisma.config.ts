import { defineConfig } from "prisma/config";

// O CLI do Prisma não lê o .env sozinho: carrega o arquivo aqui (Node 20.12+).
// Sem .env, usa o mesmo banco local padrão da aplicação.
try {
  (process as unknown as { loadEnvFile?: () => void }).loadEnvFile?.();
} catch {
  // .env inexistente: segue com o valor padrão abaixo.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
});
