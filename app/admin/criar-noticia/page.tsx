"use client"

import { useMemo, useState } from "react"
import styles from "./CriarNoticia.module.css"
import ImageDropzone from "../_components/ImageDropzone"

type ApiResp =
  | { ok: true; news: { id: string; slug: string; title: string } }
  | { ok: false; error: string }

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

const CATEGORIES = [
  "Catolicismo",
  "Cristianismo",
  "Islamismo",
  "Judaísmo",
  "Hinduísmo",
  "Budismo",
  "Espiritismo",
  "Religiões de Matriz Africana",
  "Espiritualidade",
]

export default function CriarNoticiaPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)

  const [imageFile, setImageFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const slugPreview = useMemo(() => {
    const s = autoSlug ? slugify(title) : slugify(slug)
    return s || "noticia"
  }, [autoSlug, title, slug])

  const canSubmit = title.trim().length >= 6 && category && content.trim().length >= 40 && !loading

  async function uploadIfNeeded(): Promise<string> {
    if (!imageFile) return ""

    const fd = new FormData()
    fd.append("file", imageFile)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    })

    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || "Falha no upload")
    return String(data.url)
  }

  async function handleSubmit() {
    setMsg(null)
    if (!canSubmit) {
      setMsg({ type: "err", text: "Preencha título, categoria e conteúdo (mín. 40 caracteres)." })
      return
    }

    setLoading(true)
    try {
      const uploadedUrl = await uploadIfNeeded()

      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          slug: autoSlug ? "" : slug.trim(),
          category,
          imageUrl: uploadedUrl,
          content: content.trim(),
        }),
      })

      const data = (await res.json()) as ApiResp

      if (!res.ok || !data.ok) {
        const err = !data.ok ? data.error : "Erro ao salvar."
        setMsg({ type: "err", text: err })
        return
      }

      setMsg({ type: "ok", text: `Notícia criada! Slug: ${data.news.slug}` })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e)
      setMsg({ type: "err", text: e?.message || "Falha de conexão com o servidor." })
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setMsg(null)
    setTitle("")
    setSlug("")
    setCategory("")
    setContent("")
    setAutoSlug(true)
    setImageFile(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <h1 className={styles.h1}>Criar notícia</h1>
          <p className={styles.sub}>
            Publique uma notícia com título, categoria, imagem e conteúdo.
          </p>
        </div>

        <div className={styles.actionsTop}>
          <button className={styles.secondary} onClick={handleClear} disabled={loading}>
            Limpar
          </button>
          <button className={styles.primary} onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? "Salvando..." : "Salvar notícia"}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`${styles.alert} ${msg.type === "ok" ? styles.ok : styles.err}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.grid}>
        {/* FORM */}
        <section className={styles.card} aria-label="Formulário">
          <div className={styles.cardHead}>
            <h2 className={styles.h2}>Dados da publicação</h2>
            <p className={styles.p}>Obrigatório: título, categoria e conteúdo.</p>
          </div>

          <div className={styles.form}>
            <label className={styles.label}>
              Título <span className={styles.req}>*</span>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Novas rotas de peregrinação impulsionam o turismo..."
                maxLength={140}
                disabled={loading}
              />
              <div className={styles.help}>{title.trim().length}/140</div>
            </label>

            <div className={styles.row2}>
              <label className={styles.label}>
                Categoria <span className={styles.req}>*</span>
                <select
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.label}>
                Imagem (opcional)
                <ImageDropzone value={imageFile} onChange={setImageFile} maxMB={2} />
                <div className={styles.help}>Clique ou arraste a imagem (igual ao print).</div>
              </div>
            </div>

            <div className={styles.slugBox}>
              <div className={styles.slugTop}>
                <div className={styles.slugTitle}>Slug (URL)</div>

                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Gerar automaticamente pelo título</span>
                </label>
              </div>

              {!autoSlug && (
                <input
                  className={styles.input}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: turismo-religioso-america-latina"
                  disabled={loading}
                />
              )}

              <div className={styles.slugPreview}>
                Prévia: <span className={styles.mono}>/noticias/{slugPreview}</span>
                <span className={styles.mini}>(o sistema garante slug único)</span>
              </div>
            </div>

            <label className={styles.label}>
              Conteúdo <span className={styles.req}>*</span>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva a notícia completa..."
                rows={14}
                disabled={loading}
              />
              <div className={styles.help}>
                {content.trim().length} caracteres — mínimo: 40+
              </div>
            </label>

            <div className={styles.actionsBottom}>
              <button className={styles.secondary} onClick={handleClear} disabled={loading}>
                Limpar
              </button>
              <button className={styles.primary} onClick={handleSubmit} disabled={!canSubmit}>
                {loading ? "Salvando..." : "Salvar notícia"}
              </button>
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <aside className={styles.card} aria-label="Prévia">
          <div className={styles.cardHead}>
            <h2 className={styles.h2}>Prévia</h2>
            <p className={styles.p}>Simulação de como vai aparecer.</p>
          </div>

          <div className={styles.preview}>
            <div className={styles.previewMedia}>
              {imageFile ? (
                <div className={styles.placeholderOk}>Imagem selecionada ✅</div>
              ) : (
                <div className={styles.placeholder}>
                  <div className={styles.phIcon}>🖼️</div>
                  <div className={styles.phText}>Sem imagem</div>
                </div>
              )}
            </div>

            <div className={styles.previewBody}>
              <div className={styles.previewMeta}>
                <span className={styles.tag}>{category || "Categoria"}</span>
                <span className={styles.metaRight}>{slugPreview}</span>
              </div>

              <div className={styles.previewTitle}>{title.trim() || "Título da notícia"}</div>

              <div className={styles.previewText}>
                {(content.trim() || "O conteúdo aparecerá aqui...").slice(0, 220)}
                {content.trim().length > 220 ? "…" : ""}
              </div>
            </div>
          </div>

          <div className={styles.previewFooter}>
            Dica: comece com um parágrafo inicial forte (lead) e use subtítulos no conteúdo.
          </div>
        </aside>
      </div>
    </div>
  )
}