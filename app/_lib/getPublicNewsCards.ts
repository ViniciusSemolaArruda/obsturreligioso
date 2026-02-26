import { prisma } from "@/lib/prisma"

export type NewsCard = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  tradition: string
  href: string
  image: string
}

function formatShortPTBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

function makeExcerpt(content: string, max = 160) {
  const clean = String(content || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .trim()

  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}

// Se você não tiver campo "tradition" no banco, a gente “deduz”
// Você pode ajustar depois (ou criar coluna tradition no Prisma)
function guessTradition(category: string) {
  const c = (category || "").toLowerCase()

  if (c.includes("cat")) return "Catolicismo"
  if (c.includes("crist")) return "Cristianismo"
  if (c.includes("isl")) return "Islamismo"
  if (c.includes("juda")) return "Judaísmo"
  if (c.includes("hind")) return "Hinduísmo"
  if (c.includes("bud")) return "Budismo"
  if (c.includes("espir")) return "Espiritismo"
  if (c.includes("matriz") || c.includes("afric")) return "Religiões de Matriz Africana"

  return "Espiritualidade"
}

export async function getPublicNewsCards(take = 8): Promise<NewsCard[]> {
  const items = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      category: true,
      imageUrl: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  })

  return items.map((n) => ({
    id: String(n.id),
    title: n.title,
    excerpt: makeExcerpt(n.content, 160),
    category: n.category,
    date: formatShortPTBR(n.createdAt),
    author: n.author?.name || n.author?.email || "Redação",
    tradition: guessTradition(n.category),
    href: `/noticias/${n.slug}`,
    image: n.imageUrl || "/bu1.png", // fallback se não tiver imagem
  }))
}