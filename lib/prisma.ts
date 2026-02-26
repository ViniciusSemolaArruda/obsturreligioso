import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// 👇 tipagem segura do global (evita prisma virar any)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is missing in environment variables.")
  }

  const adapter = new PrismaPg({ connectionString: url })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

// 👇 singleton (essencial para Next.js + App Router)
export const prisma: PrismaClient =
  global.prisma ?? createPrismaClient()

// 👇 evita múltiplas instâncias no dev (hot reload)
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}