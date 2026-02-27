import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string }
    const email = (body.email ?? "").trim().toLowerCase()

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "E-mail inválido." }, { status: 400 })
    }

    // upsert: se já existe, não duplica
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: "Erro ao inscrever." }, { status: 500 })
  }
}