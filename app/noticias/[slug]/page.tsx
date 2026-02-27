/* eslint-disable @next/next/no-html-link-for-pages */

import { notFound } from "next/navigation"
import Image from "next/image"
import styles from "./Noticia.module.css"
import { prisma } from "@/lib/prisma"

import Footer from "@/app/_components/Footer/Footer"
import Header from "@/app/_components/Header/Header"
import NewsletterCardInline from "@/app/_components/Newsletter/NewsletterCardInline"

function formatBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d)
}

function splitParagraphs(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
}

type RouteParams = { slug: string }
type Props = { params: RouteParams | Promise<RouteParams> }

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  if (!slug) return notFound()

  const news = await prisma.news.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      category: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  })

  if (!news) return notFound()

  const paragraphs = splitParagraphs(news.content)

  const latest = await prisma.news.findMany({
    where: { slug: { not: news.slug } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { slug: true, title: true, category: true, createdAt: true, imageUrl: true },
  })

  return (
    <>
      <Header />

      <main className={styles.noticiaPage}>
        <div className={styles.noticiaContainer}>
          <nav className={styles.noticiaBreadcrumb}>
            <a className={styles.noticiaBreadcrumbLink} href="/">
              Início
            </a>
            <span className={styles.noticiaBreadcrumbSep}>›</span>
            <a className={styles.noticiaBreadcrumbLink} href="/">
              Notícias
            </a>
            <span className={styles.noticiaBreadcrumbSep}>›</span>
            <span className={styles.noticiaBreadcrumbCurrent}>{news.category}</span>
          </nav>

          <header className={styles.noticiaHeader}>
            <div className={styles.noticiaBadgeRow}>
              <span className={styles.noticiaBadge}>{news.category}</span>
            </div>

            <h1 className={styles.noticiaTitle}>{news.title}</h1>

            <p className={styles.noticiaExcerpt}>
              Observatório apresenta dados inéditos sobre crescimento do setor e impactos econômicos nas
              comunidades locais
            </p>

            <div className={styles.noticiaMetaRow}>
              <span className={styles.noticiaMetaItem}>
                {news.author?.name || news.author?.email ? (
                  <>{news.author.name || news.author.email}</>
                ) : (
                  <>Observatório</>
                )}
              </span>
              <span className={styles.noticiaMetaSep}>•</span>
              <time className={styles.noticiaMetaItem} dateTime={news.createdAt.toISOString()}>
                {formatBR(news.createdAt)}
              </time>
            </div>

            {news.imageUrl ? (
              <div className={styles.noticiaCoverWrap}>
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  priority
                  className={styles.noticiaCoverImg}
                  sizes="(max-width: 980px) 100vw, 1200px"
                />
              </div>
            ) : null}
          </header>

          <div className={styles.noticiaGrid}>
            <article className={styles.noticiaArticle}>
              {paragraphs.map((p, i) => (
                <p key={i} className={styles.noticiaP} data-first={i === 0 ? "true" : "false"}>
                  {p}
                </p>
              ))}

              <div className={styles.noticiaBackRow}>
                <a className={styles.noticiaBackLink} href="/">
                  ← Voltar para Notícias
                </a>
              </div>
            </article>

            <aside className={styles.noticiaSidebar}>
              <section className={styles.noticiaSideCard}>
                <div className={styles.noticiaSideTitle}>Últimas Notícias</div>

                <div className={styles.noticiaSideList}>
                  {latest.map((n) => (
                    <a key={n.slug} className={styles.noticiaSideItem} href={`/noticias/${n.slug}`}>
                      <div className={styles.noticiaSideThumb}>
                        {n.imageUrl ? (
                          <Image
                            src={n.imageUrl}
                            alt=""
                            fill
                            className={styles.noticiaSideThumbImg}
                            sizes="84px"
                          />
                        ) : (
                          <div className={styles.noticiaSideThumbFallback} />
                        )}
                      </div>

                      <div className={styles.noticiaSideMeta}>
                        <div className={styles.noticiaSideCat}>{n.category}</div>
                        <div className={styles.noticiaSideT}>{n.title}</div>
                        <div className={styles.noticiaSideTime}>{formatBR(n.createdAt)}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              {/* ✅ Newsletter agora FUNCIONAL (salva no banco via /api/newsletter/subscribe) */}
              <NewsletterCardInline
                classNameCard={styles.newsletterCard}
                classNameTitle={styles.newsletterTitle}
                classNameText={styles.newsletterText}
                classNameForm={styles.newsletterForm}
                classNameInput={styles.newsletterInput}
                classNameButton={styles.newsletterButton}
              />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}