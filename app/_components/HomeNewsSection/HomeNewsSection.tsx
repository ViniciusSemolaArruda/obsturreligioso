import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import styles from "./HomeNewsSection.module.css"
import type { Prisma } from "@prisma/client"

function formatBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d)
}

function makeExcerpt(text: string, max = 160) {
  const clean = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}

// ✅ helper pra TS entender que saiu null
function isString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

type CatRow = { category: string | null }

// ✅ Tipos do Prisma (garante que items NÃO vira any[])
type NewsItem = Prisma.NewsGetPayload<{
  select: {
    id: true
    slug: true
    title: true
    content: true
    category: true
    imageUrl: true
    createdAt: true
    author: { select: { name: true; email: true } }
  }
}>

export default async function HomeNewsSection() {
  const baseWhere = {
    NOT: [
      { title: { contains: "teste", mode: "insensitive" as const } },
      { slug: { contains: "teste", mode: "insensitive" as const } },
      { title: { contains: "testando", mode: "insensitive" as const } },
      { slug: { contains: "testando", mode: "insensitive" as const } },
    ],
  }

  const items: NewsItem[] = await prisma.news.findMany({
    where: baseWhere,
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      category: true,
      imageUrl: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  })

  const cats: CatRow[] = await prisma.news.findMany({
    where: baseWhere,
    orderBy: { createdAt: "desc" },
    take: 24,
    select: { category: true },
  })

  const uniqueCats: string[] = Array.from(
    new Set(cats.map((c: CatRow) => c.category).filter(isString))
  ).slice(0, 8)

  const analyses: NewsItem[] = items.slice(0, 3)

  return (
    <section id="noticias" className={styles.section}>
      <div className={styles.topBar}>
        <h2 className={styles.h2}>Notícias</h2>

        <Link className={styles.viewAll} href="/noticias">
          Ver tudo →
        </Link>
      </div>

      {uniqueCats.length > 0 ? (
        <div className={styles.chipsRow}>
          {uniqueCats.map((c) => (
            <Link
              key={c}
              className={styles.chip}
              href={`/noticias?cat=${encodeURIComponent(c)}`}
            >
              {c}
            </Link>
          ))}
        </div>
      ) : null}

      <div className={styles.divider} />

      <div className={styles.grid}>
        {/* LEFT */}
        <div className={styles.leftCol}>
          <h3 className={styles.h3}>Últimas</h3>

          <div className={styles.newsList}>
            {items.length === 0 ? (
              <div className={styles.empty}>
                Ainda não há notícias publicadas.
              </div>
            ) : (
              items.map((n: NewsItem) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className={styles.card}
                >
                  <div className={styles.thumb}>
                    {n.imageUrl ? (
                      <Image
                        src={n.imageUrl}
                        alt={n.title}
                        fill
                        className={styles.thumbImg}
                        sizes="(max-width: 560px) 100vw, 260px"
                      />
                    ) : null}
                  </div>

                  <div className={styles.content}>
                    <div className={styles.metaRow}>
                      {/* se category puder ser null no seu schema, deixa fallback */}
                      <span className={styles.metaPill}>
                        {n.category ?? "Geral"}
                      </span>
                      <span className={styles.metaDate}>
                        {formatBR(n.createdAt)}
                      </span>
                    </div>

                    <div className={styles.title}>{n.title}</div>

                    <div className={styles.excerpt}>
                      {makeExcerpt(n.content, 170)}
                    </div>

                    <div className={styles.authorRow}>
                      <span className={styles.avatar} />
                      <span className={styles.author}>
                        {n.author?.name || n.author?.email || "Observatório"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* RIGHT (sidebar) */}
        <aside className={styles.rightCol}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Análises</div>

            {analyses.map((a: NewsItem) => (
              <div key={a.id} className={styles.sideItem}>
                <div className={styles.sideTag}>{a.category ?? "Geral"}</div>
                <div className={styles.sideHeadline}>{a.title}</div>
                <div className={styles.sideTime}>{formatBR(a.createdAt)}</div>
              </div>
            ))}

            <Link className={styles.sideBtn} href="/noticias">
              Ver mais análises
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}