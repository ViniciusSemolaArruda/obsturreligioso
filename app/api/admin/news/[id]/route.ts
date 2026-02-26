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

function forbidden() {
  return NextResponse.json({ ok: false, error: "Você não tem autorização." }, { status: 403 })
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSession(req)
    if (!session || session.role !== "ADMIN") return forbidden()

    // ✅ Next 15: params é Promise
    const { id } = await ctx.params
    const newsId = String(id || "").trim()
    if (!newsId) {
      return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 })
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        imageUrl: true,
        content: true,
      },
    })

    if (!news) {
      return NextResponse.json({ ok: false, error: "Notícia não encontrada." }, { status: 404 })
    }

    return NextResponse.json({ ok: true, news })
  } catch (e) {
    console.error("GET /api/admin/news/[id] error:", e)
    return NextResponse.json({ ok: false, error: "Erro interno do servidor." }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSession(req)
    if (!session || session.role !== "ADMIN") return forbidden()

    // ✅ Next 15: params é Promise
    const { id } = await ctx.params
    const newsId = String(id || "").trim()
    if (!newsId) {
      return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 })
    }

    const body = await req.json()

    const title = String(body.title ?? "").trim()
    const slug = String(body.slug ?? "").trim()
    const category = String(body.category ?? "").trim()
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : ""
    const content = String(body.content ?? "").trim()

    if (!title || !slug || !category || !content) {
      return NextResponse.json(
        { ok: false, error: "Título, slug, categoria e conteúdo são obrigatórios." },
        { status: 400 }
      )
    }

    const updated = await prisma.news.update({
      where: { id: newsId },
      data: { title, slug, category, imageUrl: imageUrl || null, content },
      select: { id: true, title: true, slug: true },
    })

    return NextResponse.json({ ok: true, news: updated })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // slug duplicado (Prisma P2002)
    if (e?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Já existe uma notícia com esse slug." },
        { status: 409 }
      )
    }

    console.error("PATCH /api/admin/news/[id] error:", e)
    return NextResponse.json({ ok: false, error: "Erro interno do servidor." }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSession(req)
    if (!session || session.role !== "ADMIN") return forbidden()

    // ✅ Next 15: params é Promise
    const { id } = await ctx.params
    const newsId = String(id || "").trim()
    if (!newsId) {
      return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 })
    }

    await prisma.news.delete({ where: { id: newsId } })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("DELETE /api/admin/news/[id] error:", e)
    return NextResponse.json({ ok: false, error: "Erro interno do servidor." }, { status: 500 })
  }
}