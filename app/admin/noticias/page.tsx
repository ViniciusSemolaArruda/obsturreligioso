// app/admin/noticias/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import styles from "./NoticiasAdmin.module.css"

type NewsRow = {
  id: string
  title: string
  slug: string
  category: string
  imageUrl: string | null
  createdAt: string
  author?: { email?: string | null; name?: string | null } | null
}

type ApiResp =
  | {
      ok: true
      page: number
      take: number
      total: number
      pages: number
      items: NewsRow[]
    }
  | { ok: false; error: string }

function formatBR(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export default function NoticiasAdminPage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [items, setItems] = useState<NewsRow[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [q, setQ] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load(p = page) {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/news?page=${p}&take=20`, {
        credentials: "include",
      })
      const data = (await res.json()) as ApiResp

      if (!res.ok || !data.ok) {
        const msg = !data.ok ? data.error : "Erro ao carregar."
        setErr(msg)
        setItems([])
        setPages(1)
        return
      }

      setItems(data.items)
      setPages(data.pages || 1)
    } catch (e) {
      console.error(e)
      setErr("Falha de conexão.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return items
    return items.filter((n) => {
      return (
        n.title.toLowerCase().includes(term) ||
        n.slug.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term)
      )
    })
  }, [items, q])

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
  }

  async function handleDelete(id: string, title: string) {
    const ok = confirm(`Excluir esta notícia?\n\n"${title}"\n\nEssa ação não pode ser desfeita.`)
    if (!ok) return

    setDeletingId(id)
    setErr(null)

    // otimista: remove da lista já
    const prev = items
    setItems((arr) => arr.filter((n) => n.id !== id))

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        // rollback
        setItems(prev)
        setErr(data.error || "Não foi possível excluir.")
        return
      }

      // recarrega (pra acertar paginação/total)
      await load(page)
    } catch (e) {
      console.error(e)
      setItems(prev)
      setErr("Falha de conexão ao excluir.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.h1}>Notícias publicadas</h1>
          <p className={styles.sub}>
            Visualize todas as notícias criadas, com data e hora de publicação.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, categoria ou slug…"
            />
          </div>
          <a className={styles.newBtn} href="/admin/criar-noticia">
            + Nova notícia
          </a>
        </div>
      </div>

      {err && <div className={styles.alertErr}>{err}</div>}

      <div className={styles.card}>
        <div className={styles.tableHead}>
          <div className={styles.th}>Notícia</div>
          <div className={styles.th}>Categoria</div>
          <div className={styles.th}>Criado em</div>
          <div className={styles.th}>Ações</div>
        </div>

        {loading ? (
          <div className={styles.skeletonWrap}>
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Nenhuma notícia encontrada</div>
            <div className={styles.emptySub}>
              Crie sua primeira notícia em <b>Admin → Criar notícia</b>.
            </div>
          </div>
        ) : (
          <div className={styles.rows}>
            {filtered.map((n) => {
              const publicUrl = `/noticias/${n.slug}`
              const editUrl = `/admin/noticias/${n.id}`

              return (
                <div key={n.id} className={styles.row}>
                  <div className={styles.newsCell}>
                    <div className={styles.thumb}>
                      {n.imageUrl ? (
                        <img src={n.imageUrl} alt="" className={styles.thumbImg} />
                      ) : (
                        <div className={styles.thumbPlaceholder}>📰</div>
                      )}
                    </div>

                    <div className={styles.newsInfo}>
                      <div className={styles.title}>{n.title}</div>
                      <div className={styles.slugLine}>
                        <span className={styles.mono}>{n.slug}</span>
                        {n.author?.email ? (
                          <span className={styles.author}>• {n.author.email}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cat}>
                    <span className={styles.badge}>{n.category}</span>
                  </div>

                  <div className={styles.date}>{formatBR(n.createdAt)}</div>

                  <div className={styles.actions}>
                    <a className={styles.actionBtn} href={publicUrl} target="_blank">
                      Ver
                    </a>

                    <a className={styles.actionBtn} href={editUrl}>
                      Editar
                    </a>

                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={() => handleDelete(n.id, n.title)}
                      disabled={deletingId === n.id}
                      type="button"
                      title="Excluir"
                    >
                      {deletingId === n.id ? "Excluindo…" : "Excluir"}
                    </button>

                    <button
                      className={styles.actionBtn}
                      onClick={() => copy(`${location.origin}${publicUrl}`)}
                      type="button"
                    >
                      Copiar link
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Anterior
          </button>

          <div className={styles.pageInfo}>
            Página <b>{page}</b> de <b>{pages}</b>
          </div>

          <button
            className={styles.pageBtn}
            disabled={page >= pages || loading}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}