"use client"

import Link from "next/link"
import Image from "next/image"
import styles from "./Hero.module.css"
import { scrollToHash } from "@/app/_lib/scrollToHash"

type NewsItem = {
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

const trending: NewsItem[] = [
  {
    id: "1",
    href: "/brasil/sincretismo-identidade-cultural",
    category: "Brasil",
    title: "Sincretismo e Identidade Cultural no Nordeste Brasileiro",
    readTime: "8 min de leitura",
    image: "/event1.png",
  },
  {
    id: "2",
    href: "/opiniao/laicidade-estado-moderno",
    category: "Opinião",
    title: "Novas Perspectivas sobre a Laicidade no Estado Moderno",
    readTime: "6 min de leitura",
    image: "/event2.png",
  },
  {
    id: "3",
    href: "/brasil/festivais-hindus-sao-paulo",
    category: "Brasil",
    title: "Festivais Hindus ganham espaço no calendário oficial de São Paulo",
    readTime: "4 min de leitura",
    image: "/event3.png",
  },
  {
    id: "4",
    href: "/brasil/festivais-hindus-sao-paulo-2",
    category: "Brasil",
    title: "Roteiros de peregrinação: novas rotas e experiências no Sudeste",
    readTime: "5 min de leitura",
    image: "/event4.png",
  },
  {
    id: "5",
    href: "/america-latina/patrimonio-fe",
    category: "América Latina",
    title: "Patrimônio, fé e turismo: destinos em alta na América Latina",
    readTime: "7 min de leitura",
    image: "/event5.png",
  },
]

export default function Hero() {
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
                requestAnimationFrame(() => scrollToHash("#pilares", 10)) // ✅ sobe 10px
              }}
            >
              Nossos pilares
            </a>

            <a
              href="#contato"
              className={styles.secondary}
              onClick={(e) => {
                e.preventDefault()
                requestAnimationFrame(() => scrollToHash("#contato", 10)) // ✅ sobe 10px
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
            {trending.map((item) => (
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