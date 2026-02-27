// app/_components/Tradition/TraditionNewsSection.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import styles from "./TraditionNewsSection.module.css"
import TraditionFilterCards, {
  Tradition,
} from "./TraditionCard/TraditionFilterCards"

type NewsCard = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  tradition: string
  href: string
  image: string
}

function guessTradition(category: string): Tradition | "Todos" {
  const c = (category || "").toLowerCase()

  if (c.includes("cat")) return "Catolicismo"
  if (c.includes("crist")) return "Cristianismo"
  if (c.includes("isl")) return "Islamismo"
  if (c.includes("juda")) return "Judaísmo"
  if (c.includes("hind")) return "Hinduísmo"
  if (c.includes("bud")) return "Budismo"
  if (c.includes("espir")) return "Espiritismo"
  if (c.includes("matriz") || c.includes("afric")) return "Matriz Africana"

  return "Todos"
}

export default function TraditionNewsSection() {
  const [filter, setFilter] = useState<Tradition | "Todos">("Todos")
  const [news, setNews] = useState<NewsCard[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 PUXA AS NOTÍCIAS REAIS DO BANCO (API que você já criou)
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news?take=8", {
          cache: "no-store",
        })
        const data = await res.json()

        if (data?.ok) {
          setNews(data.items)
        }
      } catch (err) {
        console.error("Erro ao carregar notícias:", err)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  // 🔥 FILTRO USANDO SEU COMPONENTE DE TRADIÇÃO
  const filteredNews = useMemo(() => {
    if (filter === "Todos") return news

    return news.filter(
      (n) => guessTradition(n.category) === filter
    )
  }, [news, filter])

  return (
    <section className={styles.section} id="noticias">
      {/* TÍTULO BUSCA (igual seu layout) */}
      <div className={styles.topBar}>
        <h2 className={styles.h2}>Busca</h2>

        
      </div>

      {/* 🔥 AQUI REUTILIZA SEU FILTRO PRONTO */}
      <TraditionFilterCards value={filter} onChange={setFilter} />

      <div className={styles.divider} />

      <div className={styles.grid}>
        {/* COLUNA ESQUERDA - NOTÍCIAS */}
        <div className={styles.leftCol}>
          <h3 className={styles.h3}>Últimas Notícias</h3>

          <div className={styles.newsList}>
            {loading ? (
              <div className={styles.empty}>Carregando notícias...</div>
            ) : filteredNews.length === 0 ? (
              <div className={styles.empty}>
                Nenhuma notícia encontrada para este filtro.
              </div>
            ) : (
              filteredNews.map((n) => (
                <Link key={n.id} href={n.href} className={styles.card}>
                  {/* IMAGEM */}
                  <div className={styles.thumb}>
                    <Image
                      src={n.image}
                      alt={n.title}
                      fill
                      className={styles.thumbImg}
                      sizes="(max-width: 560px) 100vw, 260px"
                    />
                  </div>

                  {/* CONTEÚDO */}
                  <div className={styles.content}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaPill}>
                        {n.category}
                      </span>
                      <span className={styles.metaDate}>
                        {n.date}
                      </span>
                    </div>

                    <div className={styles.title}>
                      {n.title}
                    </div>

                    <div className={styles.excerpt}>
                      {n.excerpt}
                    </div>

                    <div className={styles.authorRow}>
                      <span className={styles.avatar} />
                      <span className={styles.author}>
                        {n.author}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR DIREITA (mantida igual) */}
        {/* SIDEBAR DIREITA — ANÁLISES E CONTEXTO (INSTITUCIONAL) */}
<aside className={styles.rightCol}>
  <div className={styles.sideCard}>
    <div className={styles.sideTitle}>
      Análises & Contexto
    </div>

    {/* 
      Seção institucional do Observatório.
      Não é uma área de notícias.
      Futuramente exibirá análises estratégicas, dados, estudos e inteligência
      sobre turismo religioso, manifestações de fé e contexto sociocultural
      no Brasil e na América Latina.
    */}

    <div className={styles.sideItem}>
      <div className={styles.sideTag}>OBSERVATÓRIO</div>
      <div className={styles.sideHeadline}>
        Espaço dedicado à análise estratégica, dados e contextualização das 
        principais tendências do turismo religioso e das manifestações de fé 
        no Brasil e na América Latina.
      </div>
    </div>

    <div className={styles.sideItem}>
      <div className={styles.sideTag}>INTELIGÊNCIA</div>
      <div className={styles.sideHeadline}>
        O Observatório busca ir além da notícia, oferecendo interpretações 
        analíticas, estudos socioculturais e visão institucional sobre o 
        impacto religioso na cultura, economia e sociedade contemporânea.
      </div>
    </div>
  </div>
</aside>
      </div>
    </section>
  )
}