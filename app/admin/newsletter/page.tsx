import { prisma } from "@/lib/prisma"

function formatBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d)
}

export default async function NewsletterAdminPage() {
  const items = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
  })

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <h2 style={{ margin: 0 }}>Newsletter</h2>
        <p style={{ marginTop: 8, color: "rgba(0,0,0,.65)" }}>
          Lista de e-mails inscritos para receber notícias e análises.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800 }}>
            Total: {items.length}
          </div>
        </div>

        <div style={{ height: 12 }} />

        {items.length === 0 ? (
          <p style={{ margin: 0, color: "rgba(0,0,0,.65)" }}>Nenhum inscrito ainda.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: 14,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{it.email}</div>
                  <div style={{ color: "rgba(0,0,0,.55)", fontSize: 13 }}>
                    {formatBR(it.createdAt)}
                  </div>
                </div>

                {/* Se quiser remover, eu te mando a versão com botão DELETE (client) */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}