"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./TraditionNewsSection.module.css"
import TraditionFilterCards, { type Tradition } from "./TraditionCard/TraditionFilterCards"

type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string // ex: "Política"
  date: string // ex: "12 Fev 2026"
  author: string // ex: "Ricardo Gomes"
  tradition: Tradition
  href: string
  image: string
}

/* ✅ mock para testar. Troque depois por seus dados reais */
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "O impacto das novas legislações sobre liberdade religiosa no congresso",
    excerpt:
      "Uma análise detalhada sobre como as bancadas religiosas estão se movendo para aprovar novas emendas constitucionais.",
    category: "Política",
    date: "12 Fev 2026",
    author: "Ricardo Gomes",
    tradition: "Cristianismo",
    href: "/noticias/impacto-legislacoes-liberdade-religiosa",
    image: "/bu1.png",
  },
  {
    id: "2",
    title: "O impacto das novas legislações sobre liberdade religiosa no congresso",
    excerpt:
      "Uma análise detalhada sobre como as bancadas religiosas estão se movendo para aprovar novas emendas constitucionais.",
    category: "Política",
    date: "12 Fev 2026",
    author: "Ricardo Gomes",
    tradition: "Catolicismo",
    href: "/noticias/impacto-legislacoes-liberdade-religiosa-2",
    image: "/bu2.png",
  },
  {
    id: "3",
    title: "Comunidades e patrimônio: novas rotas de peregrinação em alta",
    excerpt:
      "Levantamento sobre destinos e fluxos de peregrinos, com impacto direto na economia local.",
    category: "Brasil",
    date: "10 Fev 2026",
    author: "Redação",
    tradition: "Espiritismo",
    href: "/noticias/rotas-peregrinacao-em-alta",
    image: "/bu3.png",
  },
  {
    id: "4",
    title: "O crescimento do Islã no Brasil e os novos centros culturais",
    excerpt:
      "Dados e contexto sobre expansão demográfica e iniciativas comunitárias em capitais brasileiras.",
    category: "América Latina",
    date: "08 Fev 2026",
    author: "Equipe Observatório",
    tradition: "Islamismo",
    href: "/noticias/crescimento-isla-no-brasil",
    image: "/bu4.png",
  },
]

export default function TraditionNewsSection() {
  const [selected, setSelected] = useState<Tradition | "Todos">("Todos")

  const filtered = useMemo(() => {
    if (selected === "Todos") return MOCK_NEWS
    return MOCK_NEWS.filter((n) => n.tradition === selected)
  }, [selected])

  return (
    <section id="noticias" className={styles.section}>
      {/* ===== Top: Por Tradição ===== */}
      <div className={styles.topBar}>
        <h2 className={styles.h2}>Busca</h2>

        {/* <Link href="/categorias" className={styles.viewAll}>
          Ver todas <span aria-hidden="true">›</span>
        </Link> */}
      </div>

      {/* ✅ filtro no estilo “cards” (ícone + label) */}
      <TraditionFilterCards value={selected} onChange={setSelected} />

      <div className={styles.divider} />

      {/* ===== Últimas Notícias ===== */}
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <h3 className={styles.h3}>Últimas Notícias</h3>

          <div className={styles.newsList}>
            {filtered.map((n) => (
              <Link key={n.id} href={n.href} className={styles.card}>
                <div className={styles.thumb}>
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    sizes="(max-width: 980px) 92vw, 260px"
                    className={styles.thumbImg}
                  />
                </div>

                <div className={styles.content}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaPill}>{n.category}</span>
                    <span className={styles.metaDate}>{n.date}</span>
                  </div>

                  <div className={styles.title}>{n.title}</div>
                  <div className={styles.excerpt}>{n.excerpt}</div>

                  <div className={styles.authorRow}>
                    <span className={styles.avatar} aria-hidden="true" />
                    <span className={styles.author}>{n.author}</span>
                  </div>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className={styles.empty}>
                Nenhuma notícia encontrada para <strong>{selected}</strong>.
              </div>
            )}
          </div>
        </div>

        {/* Coluna direita: “Análises e Contexto” (igual ao seu print) */}
        <aside className={styles.rightCol} aria-label="Análises e Contexto">
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Análises e Contexto</div>

            <div className={styles.sideItem}>
              <div className={styles.sideTag}>OPINIÃO</div>
              <div className={styles.sideHeadline}>
                A secularização irreversível da juventude urbana latino-americana
              </div>
              <div className={styles.sideTime}>🕒 10 min de leitura</div>
            </div>

            <div className={styles.sideItem}>
              <div className={styles.sideTag}>OPINIÃO</div>
              <div className={styles.sideHeadline}>
                A secularização irreversível da juventude urbana latino-americana
              </div>
              <div className={styles.sideTime}>🕒 10 min de leitura</div>
            </div>

            <Link href="/analises" className={styles.sideBtn}>
              Ver todas as análises
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}