import Link from "next/link"

export default function AdminHome() {
  const stats = [
    { label: "Notícias publicadas", value: "—", hint: "Total no portal" },
    { label: "Rascunhos", value: "—", hint: "Em revisão" },
    { label: "Mensagens", value: "—", hint: "Novas / não lidas" },
    { label: "Última atualização", value: "—", hint: "Status do sistema" },
  ]

  const actions = [
    {
      title: "Criar nova notícia",
      desc: "Publique uma notícia com título, imagem, categoria e conteúdo.",
      href: "/admin/criar-noticia",
      cta: "Nova notícia",
    },
    {
      title: "Ver mensagens",
      desc: "Acompanhe mensagens do formulário de contato e responda com agilidade.",
      href: "/admin/mensagens",
      cta: "Abrir mensagens",
    },
  ]

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ minWidth: 0 }}>
          <h1 style={styles.h1}>Painel Administrativo</h1>
          <p style={styles.sub}>
            Observatório Internacional do Turismo Religioso Laico — Brasil &amp; América Latina
          </p>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.badge}>
            <span style={styles.dot} />
            Sistema online
          </div>
        </div>
      </div>

      {/* Stats */}
      <section style={styles.gridStats} aria-label="Métricas">
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statHint}>{s.hint}</div>
            </div>
            <div style={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </section>

      {/* Main grid */}
      <section style={styles.gridMain} aria-label="Ações e atividade">
        {/* Actions */}
        <div style={styles.card}>
          <div style={styles.cardHead}>
            <h2 style={styles.h2}>Ações rápidas</h2>
            <p style={styles.p}>
              Atalhos para as tarefas mais comuns do painel.
            </p>
          </div>

          <div style={styles.actionsWrap}>
            {actions.map((a) => (
              <div key={a.title} style={styles.actionItem}>
                <div style={{ minWidth: 0 }}>
                  <div style={styles.actionTitle}>{a.title}</div>
                  <div style={styles.actionDesc}>{a.desc}</div>
                </div>

                <Link href={a.href} style={styles.actionBtn}>
                  {a.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={styles.card}>
          <div style={styles.cardHead}>
            <h2 style={styles.h2}>Atividade recente</h2>
            <p style={styles.p}>
              Aqui você pode mostrar as últimas notícias criadas/atualizadas e mensagens recebidas.
            </p>
          </div>

          <div style={styles.emptyState}>
            <div style={styles.emptyIcon} aria-hidden>
              ⟡
            </div>
            <div style={styles.emptyTitle}>Sem atividade para mostrar</div>
            <div style={styles.emptyDesc}>
              Quando você criar notícias ou receber mensagens, elas aparecerão aqui.
            </div>

            <div style={styles.emptyActions}>
              <Link href="/admin/criar-noticia" style={styles.secondaryBtn}>
                Criar notícia
              </Link>
              <Link href="/admin/mensagens" style={styles.secondaryBtn}>
                Ver mensagens
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div style={styles.note}>
        Dica: mantenha títulos curtos, use imagens em alta qualidade e selecione a categoria correta para
        facilitar a navegação no portal.
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "grid",
    gap: 16,
    padding: 4,
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  headerRight: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  h1: {
    margin: 0,
    fontSize: 22,
    lineHeight: 1.15,
    fontWeight: 900,
    letterSpacing: -0.4,
  },
  sub: {
    margin: "8px 0 0",
    color: "rgba(0,0,0,.62)",
    fontSize: 13,
    lineHeight: 1.4,
    maxWidth: 760,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,.08)",
    background: "rgba(255,255,255,.85)",
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(0,0,0,.75)",
    whiteSpace: "nowrap",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(34,197,94,.9)",
    boxShadow: "0 0 0 3px rgba(34,197,94,.15)",
  },

  gridStats: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  },
  statCard: {
    background: "rgba(255,255,255,.92)",
    border: "1px solid rgba(0,0,0,.08)",
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
  },
  statTop: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,0,0,.72)",
  },
  statHint: {
    fontSize: 11,
    color: "rgba(0,0,0,.45)",
    whiteSpace: "nowrap",
  },
  statValue: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 950,
    letterSpacing: -0.6,
  },

  gridMain: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    alignItems: "stretch",
  },

  card: {
    background: "rgba(255,255,255,.92)",
    border: "1px solid rgba(0,0,0,.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 12px 40px rgba(0,0,0,.07)",
    minWidth: 0,
  },
  cardHead: {
    marginBottom: 12,
  },

  h2: {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: -0.2,
  },
  p: {
    margin: "6px 0 0",
    fontSize: 12.5,
    color: "rgba(0,0,0,.6)",
    lineHeight: 1.45,
  },

  actionsWrap: {
    display: "grid",
    gap: 10,
    marginTop: 10,
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,.08)",
    background: "rgba(255,255,255,.7)",
  },
  actionTitle: {
    fontWeight: 950,
    fontSize: 13,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: "rgba(0,0,0,.6)",
    lineHeight: 1.4,
  },
  actionBtn: {
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,.12)",
    background: "rgba(31,79,121,.08)",
    color: "rgba(0,0,0,.85)",
    fontWeight: 900,
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  emptyState: {
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "22px 10px 8px",
    borderRadius: 16,
    border: "1px dashed rgba(0,0,0,.18)",
    background: "rgba(255,255,255,.6)",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,.10)",
    display: "grid",
    placeItems: "center",
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 10,
    background: "rgba(31,79,121,.06)",
  },
  emptyTitle: {
    fontWeight: 950,
    fontSize: 14,
  },
  emptyDesc: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(0,0,0,.62)",
    maxWidth: 520,
    lineHeight: 1.45,
  },
  emptyActions: {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  secondaryBtn: {
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,.12)",
    background: "rgba(255,255,255,.85)",
    color: "rgba(0,0,0,.85)",
    fontWeight: 900,
    fontSize: 12,
  },

  note: {
    marginTop: 2,
    fontSize: 12,
    color: "rgba(0,0,0,.55)",
    lineHeight: 1.45,
  },
}