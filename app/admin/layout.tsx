import { cookies } from "next/headers"
import { verifyAdminSessionToken } from "@/lib/adminSession"
import AdminShell from "./_components/AdminShell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  const session = verifyAdminSessionToken(token)

  if (!session || session.role !== "ADMIN") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, width: "100%", border: "1px solid rgba(0,0,0,.08)", borderRadius: 16, padding: 24, background: "#fff" }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Acesso negado</h1>
          <p style={{ marginTop: 10, marginBottom: 0, color: "rgba(0,0,0,.7)" }}>
            Você não tem autorização para acessar essa página.
          </p>
        </div>
      </main>
    )
  }

  return <AdminShell>{children}</AdminShell>
}