"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import styles from "./HeaderObservatorio.module.css"

type NavLink = {
  label: string
  href: string
  isESG?: boolean
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const leftLinks = useMemo<NavLink[]>(
    () => [
      { label: "Início", href: "/#inicio" },
      { label: "Quem Somos", href: "/#quem-somos" },
      { label: "Pilares", href: "/#pilares" },
      { label: "Como fazemos", href: "/#como-fazemos" },
    ],
    []
  )

  const rightLinks = useMemo<NavLink[]>(
    () => [
      { label: "ESG", href: "/#esg", isESG: true },
      { label: "Perguntas Frequentes", href: "/#faq" },
      { label: "Contato", href: "/#contato" },
    ],
    []
  )

  const allLinks = useMemo<NavLink[]>(
    () => [...leftLinks, ...rightLinks],
    [leftLinks, rightLinks]
  )

  const close = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((value) => !value), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [close])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const scrollToHash = useCallback((hash: string) => {
    const id = hash.replace("#", "")
    const el = document.getElementById(id)
    if (!el) return

    const header = document.getElementById("site-header")
    const headerHeight = header?.getBoundingClientRect().height ?? 0
    const gap = -230

    const y =
      window.scrollY + el.getBoundingClientRect().top - headerHeight - gap

    window.scrollTo({
      top: Math.max(0, y),
      behavior: "smooth",
    })
  }, [])

  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf("#")
      if (hashIndex === -1) return

      e.preventDefault()

      const hash = href.slice(hashIndex)
      close()

      if (pathname !== "/") {
        router.push(`/${hash}`)
        return
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToHash(hash)
        })
      })
    },
    [close, pathname, router, scrollToHash]
  )

  return (
    <>
      <header id="site-header" className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.side}>
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.link}
                onClick={(e) => onNavClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/#inicio"
            className={styles.logoWrap}
            onClick={(e) => onNavClick(e, "/#inicio")}
            aria-label="Voltar ao início"
          >
            <Image
              src="/novaLOGO5.png"
              alt="INSTITUTO EU ACREDITO"
              width={400}
              height={400}
              priority
              className={styles.logo}
            />
          </Link>

          <div className={styles.sideRight}>
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.isESG ? styles.linkESG : styles.link}
                onClick={(e) => onNavClick(e, link.href)}
              >
                {link.isESG && <span className={styles.leafIcon} aria-hidden="true" />}
                {link.label}
              </Link>
            ))}

            <Link
              href="/#noticias"
              className={styles.cta}
              onClick={(e) => onNavClick(e, "/#noticias")}
            >
              Notícias
            </Link>

            <button
              type="button"
              className={styles.burger}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={toggleMenu}
            >
              <span className={`${styles.bLine} ${open ? styles.bLine1 : ""}`} />
              <span className={`${styles.bLine} ${open ? styles.bLine2 : ""}`} />
              <span className={`${styles.bLine} ${open ? styles.bLine3 : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <button
        type="button"
        aria-label="Fechar menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
      />

      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuInner}>
          {allLinks.map((link) => (
            <Link
              key={`m-${link.href}`}
              href={link.href}
              className={link.isESG ? styles.mobileLinkESG : styles.mobileLink}
              onClick={(e) => onNavClick(e, link.href)}
            >
              {link.isESG && <span className={styles.mobileLeafIcon} aria-hidden="true" />}
              {link.label}
            </Link>
          ))}

          <Link
            href="/#noticias"
            className={styles.mobileCTA}
            onClick={(e) => onNavClick(e, "/#noticias")}
          >
            Notícias
          </Link>
        </div>
      </div>
    </>
  )
}