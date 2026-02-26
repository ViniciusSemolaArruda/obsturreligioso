"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import styles from "./Hero.module.css"
import { scrollToHash } from "@/app/_lib/scrollToHash"

type TrendingItem = {
  id: string
  href: string
  category: string
  title: string
  readTime: string
  image: string
}

const featured = {
  href: "/noticias/destaque",
  title:
    "Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina",
  excerpt:
    "Plataforma estratégica de monitoramento, análise e divulgação de dados, notícias e tendências do turismo religioso no Brasil e na América Latina.",
  image: "/hero3.png",
}

// fallback caso ainda não tenha 5 notícias no banco
const FALLBACK_TRENDING: TrendingItem[] = [
  {
    id: "f1",
    href: "/noticias",
    category: "Portal",
    title: "Publicações em construção",
    readTime: "1 min de leitura",
    image: "/event1.png",
  },
]

function calcReadTimeFromText(text: string) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = Math.max(1, Math.round(words / 180))
  return `${minutes} min de leitura`
}

export default function Hero() {
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)

  useEffect(() => {
    let alive = true

    async function loadTrending() {
      try {
        const res = await fetch("/api/news?take=5", { cache: "no-store" })
        const data = await res.json()

        if (!alive) return

        if (data?.ok && Array.isArray(data.items)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: TrendingItem[] = data.items.map((n: any) => ({
            id: String(n.id),
            href: String(n.href || `/noticias/${n.slug || ""}`),
            category: String(n.category || "Notícia"),
            title: String(n.title || ""),
            // ✅ seu endpoint já manda excerpt — usamos pra estimar tempo
            readTime: calcReadTimeFromText(String(n.excerpt || "")),
            image: String(n.image || "/event1.png"),
          }))

          setTrending(mapped)
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

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.stage}>
        <div className={styles.featuredContent}>
          <h1 className={styles.featuredTitle}>{featured.title}</h1>
          <p className={styles.featuredExcerpt}>{featured.excerpt}</p>

          <div className={styles.actions}>
            <a
              href="#pilares"
              className={styles.primary}
              onClick={(e) => {
                e.preventDefault()
                requestAnimationFrame(() => scrollToHash("#pilares", 10))
              }}
            >
              Nossos pilares
            </a>

            <a
              href="#contato"
              className={styles.secondary}
              onClick={(e) => {
                e.preventDefault()
                requestAnimationFrame(() => scrollToHash("#contato", 10))
              }}
            >
              Contato
            </a>

            <Link href={featured.href} className={styles.secondary}>
              Ler destaque
            </Link>
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
                    sizes="120px"
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
  )
}