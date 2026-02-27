import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Body = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
}

// validação simples e objetiva
function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    const firstName = (body.firstName ?? "").trim()
    const lastName = (body.lastName ?? "").trim()
    const email = (body.email ?? "").trim().toLowerCase()
    const phone = (body.phone ?? "").trim()
    const message = (body.message ?? "").trim()

    if (!firstName) {
      return NextResponse.json({ ok: false, error: "Informe o primeiro nome." }, { status: 400 })
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "E-mail inválido." }, { status: 400 })
    }

    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        message: message || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Erro ao enviar mensagem." },
      { status: 500 }
    )
  }
}