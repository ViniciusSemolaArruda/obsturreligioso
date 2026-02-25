import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import styles from "./Noticia.module.css"
import { getPostBySlug, getTrending } from "../data"

export default function NoticiaPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  const related = getTrending(5).filter((p) => p.slug !== post.slug)

  return (
    <main className={styles.noticiaPage}>
      <div className={styles.noticiaContainer}>
        <div className={styles.noticiaBreadcrumb}>
          <Link href="/" className={styles.noticiaBreadcrumbLink}>
            Início
          </Link>
          <span className={styles.noticiaBreadcrumbSep}>/</span>
          <Link href="/noticias" className={styles.noticiaBreadcrumbLink}>
            Notícias
          </Link>
          <span className={styles.noticiaBreadcrumbSep}>/</span>
          <span className={styles.noticiaBreadcrumbCurrent}>{post.title}</span>
        </div>

        <header className={styles.noticiaHeader}>
          <div className={styles.noticiaTopMeta}>
            <span className={styles.noticiaCategory}>{post.category}</span>
            <span className={styles.noticiaDot}>•</span>
            <span className={styles.noticiaReadTime}>{post.readTime}</span>
            <span className={styles.noticiaDot}>•</span>
            <span className={styles.noticiaDate}>{post.dateISO}</span>
          </div>

          <h1 className={styles.noticiaTitle}>{post.title}</h1>
          <p className={styles.noticiaExcerpt}>{post.excerpt}</p>

          <div className={styles.noticiaCoverWrap}>
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className={styles.noticiaCoverImg}
              priority
            />
          </div>

          <div className={styles.noticiaAuthor}>Por {post.author}</div>
        </header>

        <section className={styles.noticiaGrid}>
          <article className={styles.noticiaArticle}>
            {post.content.map((block, idx) => {
              if (block.type === "h2") {
                return (
                  <h2 key={idx} className={styles.noticiaH2}>
                    {block.text}
                  </h2>
                )
              }

              if (block.type === "p") {
                return (
                  <p key={idx} className={styles.noticiaP}>
                    {block.text}
                  </p>
                )
              }

              if (block.type === "list") {
                return (
                  <ul key={idx} className={styles.noticiaUl}>
                    {block.items.map((it, i) => (
                      <li key={i} className={styles.noticiaLi}>
                        {it}
                      </li>
                    ))}
                  </ul>
                )
              }

              if (block.type === "quote") {
                return (
                  <figure key={idx} className={styles.noticiaQuote}>
                    <blockquote className={styles.noticiaBlockquote}>
                      {block.text}
                    </blockquote>
                    {block.cite ? (
                      <figcaption className={styles.noticiaCite}>
                        — {block.cite}
                      </figcaption>
                    ) : null}
                  </figure>
                )
              }

              return null
            })}

            <div className={styles.noticiaBackRow}>
              <Link href="/noticias" className={styles.noticiaBackLink}>
                ← Voltar para Notícias
              </Link>
            </div>
          </article>

          <aside className={styles.noticiaSidebar}>
            <div className={styles.noticiaSideTitle}>EM ALTA</div>

            <div className={styles.noticiaSideList}>
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/noticias/${p.slug}`}
                  className={styles.noticiaSideItem}
                >
                  <div className={styles.noticiaSideThumb}>
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      className={styles.noticiaSideThumbImg}
                      sizes="90px"
                    />
                  </div>

                  <div className={styles.noticiaSideMeta}>
                    <div className={styles.noticiaSideCat}>{p.category}</div>
                    <div className={styles.noticiaSideT}>{p.title}</div>
                    <div className={styles.noticiaSideTime}>{p.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}