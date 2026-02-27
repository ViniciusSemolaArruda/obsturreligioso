import { prisma } from "@/lib/prisma"

function formatBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d)
}

export default async function MensagensPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200, // limite simples
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
        <h2 style={{ margin: 0 }}>Mensagens</h2>
        <p style={{ marginTop: 8, color: "rgba(0,0,0,.65)" }}>
          Aqui estão as mensagens enviadas pelo site (contato).
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
        {messages.length === 0 ? (
          <p style={{ margin: 0, color: "rgba(0,0,0,.65)" }}>
            Nenhuma mensagem ainda.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 800 }}>
                    {m.firstName} {m.lastName ?? ""}
                  </div>
                  <div style={{ color: "rgba(0,0,0,.55)", fontSize: 13 }}>
                    {formatBR(m.createdAt)}
                  </div>
                </div>

                <div style={{ marginTop: 6, color: "rgba(0,0,0,.7)" }}>
                  <div>
                    <strong>E-mail:</strong> {m.email}
                  </div>
                  {m.phone ? (
                    <div>
                      <strong>Telefone:</strong> {m.phone}
                    </div>
                  ) : null}
                </div>

                {m.message ? (
                  <p style={{ marginTop: 10, marginBottom: 0, whiteSpace: "pre-wrap" }}>
                    {m.message}
                  </p>
                ) : (
                  <p style={{ marginTop: 10, marginBottom: 0, color: "rgba(0,0,0,.55)" }}>
                    (Sem mensagem)
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}