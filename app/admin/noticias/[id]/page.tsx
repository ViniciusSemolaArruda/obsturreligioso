"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import styles from "../../criar-noticia/CriarNoticia.module.css"
import ImageDropzone from "../../_components/ImageDropzone"

type GetResp =
  | {
      ok: true
      news: {
        id: string
        title: string
        slug: string
        category: string
        imageUrl: string | null
        content: string
      }
    }
  | { ok: false; error: string }

type PatchResp =
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

export default function EditarNoticiaPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = String(params?.id || "").trim()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [autoSlug, setAutoSlug] = useState(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [boot, setBoot] = useState(true)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const slugPreview = useMemo(() => {
    const s = autoSlug ? slugify(title) : slugify(slug)
    return s || "noticia"
  }, [autoSlug, title, slug])

  const canSubmit =
    title.trim().length >= 6 &&
    category &&
    content.trim().length >= 40 &&
    !loading &&
    !boot

  // ✅ carrega dados da notícia e preenche
  useEffect(() => {
    if (!id) return

    ;(async () => {
      setBoot(true)
      setMsg(null)

      try {
        const res = await fetch(`/api/admin/news/${id}`, { credentials: "include" })
        const data = (await res.json()) as GetResp

        if (!res.ok || !data.ok) {
          setMsg({ type: "err", text: !data.ok ? data.error : "Erro ao carregar." })
          return
        }

        setTitle(data.news.title || "")
        setSlug(data.news.slug || "")
        setCategory(data.news.category || "")
        setContent(data.news.content || "")
        setCurrentImageUrl(data.news.imageUrl || "")
        setAutoSlug(false) // começa manual, mantendo o slug atual
      } catch (e) {
        console.error(e)
        setMsg({ type: "err", text: "Falha de conexão com o servidor." })
      } finally {
        setBoot(false)
      }
    })()
  }, [id])

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

  async function handleSave() {
    setMsg(null)

    if (!canSubmit) {
      setMsg({ type: "err", text: "Preencha título, categoria e conteúdo (mín. 40 caracteres)." })
      return
    }

    setLoading(true)
    try {
      // ✅ se escolher nova imagem, faz upload; senão mantém a atual
      const uploadedUrl = await uploadIfNeeded()
      const finalImageUrl = uploadedUrl || currentImageUrl || ""

      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          slug: (autoSlug ? slugPreview : slug).trim(), // PATCH atualiza slug se vier preenchido
          category,
          imageUrl: finalImageUrl,
          content: content.trim(),
        }),
      })

      const data = (await res.json()) as PatchResp

      if (!res.ok || !data.ok) {
        const err = !data.ok ? data.error : "Erro ao salvar."
        setMsg({ type: "err", text: err })
        return
      }

      // mantém estado atualizado (caso slug normalize)
      setSlug(data.news.slug)
      setCurrentImageUrl(finalImageUrl)
      setImageFile(null)

      setMsg({ type: "ok", text: `Notícia atualizada! Slug: ${data.news.slug}` })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e)
      setMsg({ type: "err", text: e?.message || "Falha de conexão com o servidor." })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    const ok = confirm("Excluir esta notícia? Essa ação não pode ser desfeita.")
    if (!ok) return

    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        setMsg({ type: "err", text: data.error || "Erro ao excluir." })
        return
      }

      router.push("/admin/noticias")
      router.refresh()
    } catch (e) {
      console.error(e)
      setMsg({ type: "err", text: "Falha de conexão ao excluir." })
    } finally {
      setLoading(false)
    }
  }

  function handleGoBack() {
    router.push("/admin/noticias")
  }

  const previewImage = imageFile
    ? URL.createObjectURL(imageFile)
    : currentImageUrl

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <h1 className={styles.h1}>Editar notícia</h1>
          <p className={styles.sub}>
            A tela é igual à de criação — só que já vem com os dados preenchidos para você editar.
          </p>
        </div>

        <div className={styles.actionsTop}>
          <button className={styles.secondary} onClick={handleGoBack} disabled={loading}>
            Voltar
          </button>

          <button className={styles.secondary} onClick={handleDelete} disabled={loading || boot}>
            Excluir
          </button>

          <button className={styles.primary} onClick={handleSave} disabled={!canSubmit}>
            {loading ? "Salvando..." : "Salvar alterações"}
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
                disabled={loading || boot}
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
                  disabled={loading || boot}
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
                <div className={styles.help}>
                  Se você não escolher outra imagem, a atual será mantida.
                </div>
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
                    disabled={loading || boot}
                  />
                  Auto
                </label>
              </div>

              {!autoSlug && (
                <label className={styles.label}>
                  Personalizar slug
                  <input
                    className={styles.input}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ex: turismo-religioso-em-alta"
                    disabled={loading || boot}
                  />
                  <div className={styles.help}>Dica: sem acentos e sem espaços.</div>
                </label>
              )}

              <div className={styles.slugPreview}>
                <span className={styles.mini}>Preview:</span>
                <span className={styles.mono}>/noticias/{slugPreview}</span>
              </div>
            </div>

            <label className={styles.label}>
              Conteúdo <span className={styles.req}>*</span>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva aqui o conteúdo completo da notícia..."
                disabled={loading || boot}
              />
              <div className={styles.help}>{content.trim().length} caracteres</div>
            </label>

            <div className={styles.actionsBottom}>
              <a
                className={styles.secondary as unknown as string}
                href={`/noticias/${slugPreview}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver no site
              </a>

              <button className={styles.primary} onClick={handleSave} disabled={!canSubmit}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <aside className={styles.preview} aria-label="Pré-visualização">
          <div className={styles.previewMedia}>
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.phIcon}>🖼️</div>
                <div className={styles.phText}>Prévia da imagem</div>
                <div className={styles.placeholderOk}>Sem imagem</div>
              </div>
            )}
          </div>

          <div className={styles.previewBody}>
            <div className={styles.previewMeta}>
              <span className={styles.tag}>{category || "Categoria"}</span>
              <span className={styles.metaRight}>Preview</span>
            </div>

            <div className={styles.previewTitle}>{title || "Título da notícia"}</div>

            <div className={styles.previewText}>
              {content.trim().length
                ? content.trim().slice(0, 240) + (content.trim().length > 240 ? "..." : "")
                : "O conteúdo vai aparecer aqui (uma prévia)."}
            </div>

            <div className={styles.previewFooter}>
              URL: <span className={styles.mono}>/noticias/{slugPreview}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}