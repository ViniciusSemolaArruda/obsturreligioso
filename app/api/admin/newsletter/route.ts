import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const items = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    })
    return NextResponse.json({ ok: true, items })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: "Erro ao carregar." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { id?: string }
    const id = (body.id ?? "").trim()

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID ausente." }, { status: 400 })
    }

    await prisma.newsletterSubscriber.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: "Erro ao remover." }, { status: 500 })
  }
}