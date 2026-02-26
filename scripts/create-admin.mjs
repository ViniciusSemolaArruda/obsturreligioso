import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const url = process.env.DATABASE_URL
if (!url) {
  console.error("❌ DATABASE_URL missing in .env")
  process.exit(1)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
})

const email = process.env.ADMIN_EMAIL || "admin@gmail.com"
const password = process.env.ADMIN_PASSWORD || "@dm1nS3nh4F0rt3!"

async function main() {
  const hash = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hash,
      role: "ADMIN",
      name: "Administrador Observatório",
    },
  })

  console.log("✅ Admin pronto:", admin.email)
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })