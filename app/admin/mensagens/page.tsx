export default function MensagensPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,.08)",
        borderRadius: 16,
        padding: 18
      }}>
        <h2 style={{ margin: 0 }}>Mensagens</h2>
        <p style={{ marginTop: 8, color: "rgba(0,0,0,.65)" }}>
          Aqui você vai listar as mensagens enviadas pelo site (contato).
        </p>
      </div>
    </div>
  )
}