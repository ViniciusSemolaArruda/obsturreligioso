export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { verifyAdminSessionToken } from "@/lib/adminSession"

function getCookieToken(cookie: string) {
  return cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("admin_session="))
    ?.split("=")[1]
}

// ✅ Config via env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // se você usar CLOUDINARY_URL, o SDK também entende automaticamente
})

function uploadToCloudinary(buffer: Buffer) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "observatorio/news",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload falhou"))
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )

    stream.end(buffer)
  })
}

export async function POST(req: Request) {
  try {
    // ✅ Proteção ADMIN
    const cookie = req.headers.get("cookie") || ""
    const token = getCookieToken(cookie)
    const session = verifyAdminSessionToken(token)

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "Você não tem autorização." }, { status: 403 })
    }

    // ✅ Recebe FormData
    const form = await req.formData()
    const file = form.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Arquivo não enviado." }, { status: 400 })
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ ok: false, error: "Formato inválido. Use JPG/PNG/WEBP/GIF." }, { status: 400 })
    }

    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json({ ok: false, error: "Imagem acima de 2MB." }, { status: 400 })
    }

    // ✅ Upload
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadToCloudinary(buffer)

    return NextResponse.json({ ok: true, url: result.secure_url, publicId: result.public_id })
  } catch (e) {
    console.error("cloudinary upload error:", e)
    return NextResponse.json({ ok: false, error: "Erro no upload." }, { status: 500 })
  }
}