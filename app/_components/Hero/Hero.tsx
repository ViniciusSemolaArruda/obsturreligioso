"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./Hero.module.css"

type TrendingItem = {
  id: string
  href: string
  category: string
  title: string
  readTime: string
  image: string
  createdAt?: string
}

type InfoCard = {
  key: "dados" | "impacto" | "comunidade"
  buttonLabel: string
  title: string
  text: string
}

const featured = {
  href: "/noticias/destaque",
  title:
    "Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina",
  excerpt:
    "Plataforma estratégica de monitoramento, análise e divulgação de dados, notícias e tendências do turismo religioso no Brasil e na América Latina.",
  image: "/hero3.png",
}

const INFO_CARDS: InfoCard[] = [
  {
    key: "dados",
    buttonLabel: "Dados e Inteligência",
    title: "Geração de Dados e Inteligência de Mercado",
    text:
      "A geração de dados sobre o turismo religioso fortalece a tomada de decisão e amplia a visibilidade do segmento. A partir de informações organizadas, ajudamos agências, destinos e instituições a comunicar melhor suas experiências no Brasil e no exterior, atraindo mais peregrinos. Na prática, isso significa construir um banco de dados unificado com o fluxo de visitantes, o perfil socioeconômico do turista e as principais rotas, criando uma base confiável para planejamento, promoção e desenvolvimento do setor.",
  },
  {
    key: "impacto",
    buttonLabel: "Impacto e Mapeamento",
    title: "Impacto Econômico e Mapeamento",
    text:
      "Em parceria com governos e instituições, mensuramos o impacto econômico do turismo religioso nas principais regiões do país, apoiando o planejamento e atraindo investimentos para hotelaria, gastronomia, transportes e serviços. Ao mesmo tempo, realizamos o mapeamento e a catalogação de bens materiais e imateriais no Brasil e na América Latina, para valorizar patrimônios, preservar identidades e oferecer ao peregrino uma experiência mais completa, com acesso a informações culturais relevantes em cada destino visitado.",
  },
  {
    key: "comunidade",
    buttonLabel: "Comunidades e Renda",
    title: "Conscientização Comunitária e Empreendedorismo",
    text:
      "Levamos conhecimento e formação para comunidades religiosas, etnias e povos originários, aproximando academia e território para fortalecer o acolhimento e a comunicação cultural dos destinos. A ideia é capacitar pessoas para receber visitantes de forma profissional, compartilhando informações profundas sobre tradições, monumentos e patrimônios locais. Paralelamente, apoiamos o empreendedorismo e a geração de renda, estimulando microempreendedores a criarem experiências complementares ao turismo religioso — como gastronomia, artesanato, shows culturais e feiras literárias — contribuindo para o desenvolvimento sustentável das economias locais.",
  },
]

const FALLBACK_TRENDING: TrendingItem[] = []

function calcReadTimeFromText(text: string) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = Math.max(1, Math.round(words / 180))
  return `${minutes} min de leitura`
}

function getHeaderOffset(extra = 14) {
  const root = document.documentElement
  const cssOffset = getComputedStyle(root).getPropertyValue("--scroll-offset")
  const headerOffset = Math.max(0, parseInt(cssOffset || "0", 10) || 0)
  return headerOffset + extra
}

export default function Hero() {
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)

  const [openKey, setOpenKey] = useState<InfoCard["key"] | null>(null)
  const [closing, setClosing] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0, s: 0.65 })
  const lastBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    let alive = true

    async function loadTrending() {
      try {
        const res = await fetch("/api/news?take=3", { cache: "no-store" })
        const data = await res.json()

        if (!alive) return

        if (data?.ok && Array.isArray(data.items)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: TrendingItem[] = data.items.map((n: any) => ({
            id: String(n.id),
            href: String(n.href || `/noticias/${n.slug || ""}`),
            category: String(n.category || "Notícia"),
            title: String(n.title || ""),
            readTime: calcReadTimeFromText(String(n.excerpt || "")),
            image: String(n.image || "/event1.png"),
            createdAt: n.createdAt ? String(n.createdAt) : undefined,
          }))

          const sorted = [...mapped].sort((a, b) => {
            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0
            if (!ad && !bd) return 0
            return bd - ad
          })

          setTrending(sorted.slice(0, 3))
        } else {
          setTrending([])
        }
      } catch (e) {
        console.error("Erro ao carregar EM ALTA:", e)
        if (alive) setTrending([])
      } finally {
        if (alive) setLoadingTrending(false)
      }
    }

    loadTrending()
    return () => {
      alive = false
    }
  }, [])

  const trendingToRender = useMemo(() => {
    if (loadingTrending) return FALLBACK_TRENDING
    return trending.length ? trending : FALLBACK_TRENDING
  }, [loadingTrending, trending])

  const selected = useMemo(
    () => INFO_CARDS.find((c) => c.key === openKey) || null,
    [openKey]
  )

  function openFromButton(key: InfoCard["key"], btn: HTMLButtonElement) {
    lastBtnRef.current = btn

    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const vx = window.innerWidth / 2
    const vy = window.innerHeight / 2

    setOrigin({
      x: Math.round(cx - vx),
      y: Math.round(cy - vy),
      s: 0.66,
    })

    setClosing(false)
    setOpenKey(key)
  }

  function requestClose() {
    if (!openKey || closing) return
    setClosing(true)

    const btn = lastBtnRef.current
    window.setTimeout(() => {
      setOpenKey(null)
      setClosing(false)
      btn?.focus()
    }, 220)
  }

  useEffect(() => {
    if (!openKey) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose()
    }

    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey])

  return (
    <>
      <section className={styles.hero} id="inicio">
        <div className={styles.bg} aria-hidden="true" />

        <div className={styles.stage}>
          <div className={styles.featuredContent}>
            <h1 className={styles.featuredTitle}>{featured.title}</h1>
            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>

            <div className={styles.actions}>
              <div className={styles.pills} aria-label="Abrir detalhes">
                {INFO_CARDS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={styles.pillBtn}
                    onClick={(e) => openFromButton(c.key, e.currentTarget)}
                  >
                    <span className={styles.pillDot} aria-hidden="true" />
                    <span className={styles.pillLabel}>{c.buttonLabel}</span>
                  </button>
                ))}
              </div>

              
            </div>
          </div>

          <aside className={styles.trending} aria-label="Em alta">
            <div className={styles.rightHeader}>EM ALTA</div>

            <div className={styles.list}>
              {trendingToRender.map((item) => (
                <Link key={item.id} href={item.href} className={styles.item}>
                  <div className={styles.thumb}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={styles.thumbImg}
                      sizes="(max-width: 980px) 82px, 120px"
                    />
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.category}>{item.category}</div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.time}>{item.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ✅ MODAL Premium (só texto) */}
      {openKey && selected && (
        <div
          className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) requestClose()
          }}
        >
          <div
            className={`${styles.modal} ${closing ? styles.modalClosing : ""}`}
            style={
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--from-x" as any]: `${origin.x}px`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--from-y" as any]: `${origin.y}px`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--from-s" as any]: `${origin.s}`,
              } as React.CSSProperties
            }
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderText}>
                <div className={styles.modalKicker}>Detalhamento</div>
                <h2 className={styles.modalTitle}>{selected.title}</h2>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={requestClose}
                aria-label="Fechar"
                title="Fechar"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalText}>{selected.text}</p>

              
              
            </div>
          </div>
        </div>
      )}
    </>
  )
}