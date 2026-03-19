// app/api/news/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type NewsCard = {
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

function makeExcerpt(content: string, max = 140) {
  const clean = String(content || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .trim()

  return clean.length <= max ? clean : clean.slice(0, max).trimEnd() + "…"
}

// Como você não tem "tradition" no model, deduzimos por category.
// Católicos, protestantes e cristãos entram todos no mesmo grupo visual.
function guessTradition(category: string) {
  const c = (category || "").toLowerCase()

  if (c.includes("cat") || c.includes("protest") || c.includes("crist")) {
    return "Católicos e Protestantes"
  }

  if (c.includes("isl")) return "Islamismo"
  if (c.includes("juda")) return "Judaísmo"
  if (c.includes("hind")) return "Hinduísmo"
  if (c.includes("bud")) return "Budismo"
  if (c.includes("espir")) return "Espiritismo"
  if (c.includes("matriz") || c.includes("afric")) return "Matriz Africana"

  return "Espiritualidade"
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const takeRaw = Number(searchParams.get("take") ?? "1")
    const take = Math.min(10, Math.max(1, Number.isFinite(takeRaw) ? takeRaw : 1))

    const tradition = (searchParams.get("tradition") ?? "").trim().toLowerCase()

    const latest = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: tradition ? 20 : take,
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

    let items: NewsCard[] = latest.map((n) => ({
      id: String(n.id),
      title: n.title,
      excerpt: makeExcerpt(n.content, 140),
      category: n.category,
      date: formatShortPTBR(n.createdAt),
      author: n.author?.name || n.author?.email || "Redação",
      tradition: guessTradition(n.category),
      href: `/noticias/${n.slug}`,
      image: n.imageUrl || "/bu1.png",
    }))

    if (tradition) {
      items = items
        .filter((i) => i.tradition.toLowerCase() === tradition)
        .slice(0, take)
    }

    return NextResponse.json(
      { ok: true, items },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (e) {
    console.error("GET /api/news error:", e)
    return NextResponse.json(
      { ok: false, error: "Erro interno do servidor." },
      { status: 500 }
    )
  }
}