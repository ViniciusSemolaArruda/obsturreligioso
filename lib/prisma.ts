// /lib/prisma.ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

/**
 * Tipagem do global para evitar:
 * - múltiplas instâncias do Prisma no Next.js (App Router)
 * - erro de "PrismaClient is already running"
 * - e evitar any implícito (ESLint/TS)
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      "❌ DATABASE_URL não encontrada nas variáveis de ambiente."
    )
  }

  // Adapter PG (Neon, Supabase, Postgres, etc)
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  })

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

  return client
}

/**
 * Singleton do Prisma (ESSENCIAL no Next.js 13+ App Router)
 * Evita:
 * - múltiplas conexões no hot reload
 * - crash em dev
 * - consumo excessivo de conexões no banco
 */
export const prisma: PrismaClient =
  global.prisma ?? createPrismaClient()

// Em desenvolvimento, guarda no global
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}