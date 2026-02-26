export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createAdminSessionToken } from "@/lib/adminSession"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const email = String(body?.email ?? "").trim().toLowerCase()
    const password = String(body?.password ?? "").trim()

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Preencha e-mail e senha." },
        { status: 400 }
      )
    }

    // 🔎 Busca o usuário no banco (Neon)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas." },
        { status: 401 }
      )
    }

    // 🔐 Verifica a senha com bcrypt
    const senhaValida = await bcrypt.compare(password, user.passwordHash)

    if (!senhaValida) {
      return NextResponse.json(
        { ok: false, error: "Credenciais inválidas." },
        { status: 401 }
      )
    }

    // 🛑 Segurança: só ADMIN pode acessar /admin
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Sem permissão de administrador." },
        { status: 403 }
      )
    }

    // 🍪 Cria sessão segura
    const res = NextResponse.json({ ok: true })

    res.cookies.set(
      "admin_session",
      createAdminSessionToken({
        userId: user.id,
        role: user.role,
        email: user.email,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 horas
      }
    )

    return res
  } catch (error) {
    console.error("Erro no login admin:", error)
    return NextResponse.json(
      { ok: false, error: "Erro interno do servidor." },
      { status: 500 }
    )
  }
}