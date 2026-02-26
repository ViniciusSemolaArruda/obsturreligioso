export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminSessionToken } from "@/lib/adminSession"

type AdminSession = {
  userId: string
  role: "ADMIN" | "USER"
  iat: number
}

function getCookieToken(cookie: string) {
  return cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("admin_session="))
    ?.split("=")[1]
}

function getSession(req: Request): AdminSession | null {
  const cookie = req.headers.get("cookie") || ""
  const token = getCookieToken(cookie)
  const session = verifyAdminSessionToken(token) as AdminSession | null
  return session
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function uniqueSlug(base: string) {
  const clean = base && base.trim() ? slugify(base) : "noticia"
  let slug = clean
  let i = 2

  while (true) {
    const exists = await prisma.news.findUnique({ where: { slug } })
    if (!exists) return slug
    slug = `${clean}-${i++}`
  }
}

/**
 * GET /api/admin/news?page=1&take=20
 * Lista notícias com data e hora (createdAt), mais autor.
 */
export async function GET(req: Request) {
  try {
    const session = getSession(req)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Você não tem autorização." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const take = Math.min(50, Math.max(5, Number(searchParams.get("take") ?? "20")))
    const skip = (page - 1) * take

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true, name: true } },
        },
      }),
      prisma.news.count(),
    ])

    return NextResponse.json({
      ok: true,
      page,
      take,
      total,
      pages: Math.ceil(total / take),
      items,
    })
  } catch (e) {
    console.error("GET /api/admin/news error:", e)
    return NextResponse.json({ ok: false, error: "Erro interno do servidor." }, { status: 500 })
  }
}

/**
 * POST /api/admin/news
 * Cria notícia (slug único). Recebe:
 * { title, slug?, category, imageUrl?, content }
 */
export async function POST(req: Request) {
  try {
    const session = getSession(req)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Você não tem autorização para acessar essa página." },
        { status: 403 }
      )
    }

    const body = await req.json().catch(() => null)

    const title = String(body?.title ?? "").trim()
    const category = String(body?.category ?? "").trim()
    const content = String(body?.content ?? "").trim()
    const imageUrlRaw = String(body?.imageUrl ?? "").trim()
    const slugRaw = String(body?.slug ?? "").trim()

    if (!title || title.length < 6) {
      return NextResponse.json({ ok: false, error: "Título muito curto." }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ ok: false, error: "Selecione uma categoria." }, { status: 400 })
    }
    if (!content || content.length < 40) {
      return NextResponse.json({ ok: false, error: "Conteúdo muito curto." }, { status: 400 })
    }

    const imageUrl = imageUrlRaw || null
    const base = slugRaw ? slugRaw : title
    const slug = await uniqueSlug(base)

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        category,
        imageUrl,
        authorId: session.userId,
      },
      select: { id: true, slug: true, title: true },
    })

    return NextResponse.json({ ok: true, news })
  } catch (e) {
    console.error("POST /api/admin/news error:", e)
    return NextResponse.json({ ok: false, error: "Erro interno do servidor." }, { status: 500 })
  }
}