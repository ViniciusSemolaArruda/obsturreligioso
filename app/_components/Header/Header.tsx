"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import styles from "./HeaderObservatorio.module.css"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  // ✅ agora os links SEMPRE apontam para a HOME + hash
  // Assim, em páginas secundárias, o clique te leva para "/" e para a seção correta.
  const leftLinks = useMemo(
    () => [
      { label: "Início", href: "/#inicio" },
      { label: "Quem Somos", href: "/#quem-somos" },
      { label: "Pilares", href: "/#pilares" },
      { label: "Como fazemos", href: "/#como-fazemos" },
    ],
    []
  )

  const rightLinks = useMemo(
    () => [
      { label: "Perguntas Frequentes", href: "/#faq" },
      { label: "Contato", href: "/#contato" },
    ],
    []
  )

  const allLinks = useMemo(() => [...leftLinks, ...rightLinks], [leftLinks, rightLinks])

  const close = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((v) => !v), [])

  /* 🔽🔼 ESCONDE / MOSTRA HEADER NO SCROLL (MAS NÃO SOME COM MENU ABERTO) */
  useEffect(() => {
    const onScroll = () => {
      if (open) return

      const currentY = window.scrollY

      if (Math.abs(currentY - lastScrollY.current) < 10) return

      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [open])

  /* ESC fecha menu */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [close])

  /* trava scroll do body quando menu abre */
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

  /**
   * ✅ scroll com offset REAL (SÓ QUANDO JÁ ESTÁ NA HOME)
   * Mantive sua lógica e seu "gap" exatamente como estava.
   */
  const scrollToHash = useCallback((hash: string) => {
    const id = hash.replace("#", "")
    const el = document.getElementById(id)
    if (!el) return

    const header = document.getElementById("site-header")
    const headerH = header?.getBoundingClientRect().height ?? 0

    // ⚠️ mantém seu ajuste fino
    const gap = -230

    const y = window.scrollY + el.getBoundingClientRect().top - headerH - gap
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
  }, [])

  /**
   * ✅ Clique inteligente:
   * - Se estiver na HOME: faz scroll suave com offset.
   * - Se estiver em página secundária: navega pra "/#secao" (home + âncora).
   */
  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // pega apenas a parte do hash (aceita "/#x" e "#x")
      const hashIndex = href.indexOf("#")
      if (hashIndex === -1) return

      e.preventDefault()

      const hash = href.slice(hashIndex) // "#inicio"

      // garante header visível, fecha menu
      setHidden(false)
      close()

      if (pathname !== "/") {
        // ✅ está fora da home: vai pra home com hash
        router.push(`/${hash}`)
        return
      }

      // ✅ já está na home: scroll com offset (seu comportamento atual)
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
      <header id="site-header" className={`${styles.header} ${hidden ? styles.headerHidden : ""}`}>
        <nav className={styles.nav}>
          {/* Esquerda (desktop) */}
          <div className={styles.side}>
            {leftLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={styles.link}
                onClick={(e) => onNavClick(e, l.href)}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link
            href="/#inicio"
            className={styles.logoWrap}
            onClick={(e) => onNavClick(e, "/#inicio")}
            aria-label="Voltar ao início"
          >
            <Image
              src="/novaLOGO3.png"
              alt="INSTITUTO EU ACREDITO"
              width={400}
              height={400}
              priority
              className={styles.logo}
            />
          </Link>

          {/* Direita (desktop) + burger (mobile) */}
          <div className={styles.sideRight}>
            {rightLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={styles.link}
                onClick={(e) => onNavClick(e, l.href)}
              >
                {l.label}
              </Link>
            ))}

            <Link href="/#noticias" className={styles.cta} onClick={(e) => onNavClick(e, "/#noticias")}>
              Notícias
            </Link>

            {/* Burger aparece no mobile via CSS */}
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

      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
      />

      {/* Menu mobile */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuInner}>
          {allLinks.map((l) => (
            <Link
              key={`m-${l.href}`}
              href={l.href}
              className={styles.mobileLink}
              onClick={(e) => onNavClick(e, l.href)}
            >
              {l.label}
            </Link>
          ))}

          <Link href="/#noticias" className={styles.mobileCTA} onClick={(e) => onNavClick(e, "/#noticias")}>
            Notícias
          </Link>
        </div>
      </div>
    </>
  )
}