import crypto from "crypto"

export type AdminSessionPayload = {
  userId: string
  role: "ADMIN" | "USER"
  email: string
  iat: number
}

function sign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url")
}

export function createAdminSessionToken(payload: Omit<AdminSessionPayload, "iat">) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET")

  const full: AdminSessionPayload = { ...payload, iat: Date.now() }

  const body = Buffer.from(JSON.stringify(full)).toString("base64url")
  const sig = sign(body, secret)

  return `${body}.${sig}`
}

export function verifyAdminSessionToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token) return null

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return null

  const [body, sig] = token.split(".")
  if (!body || !sig) return null

  const expected = sign(body, secret)
  if (sig !== expected) return null

  try {
    const json = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AdminSessionPayload
    if (!json?.userId || !json?.email || !json?.role) return null
    return json
  } catch {
    return null
  }
}