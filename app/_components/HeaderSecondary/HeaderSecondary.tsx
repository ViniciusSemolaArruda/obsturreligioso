"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import styles from "./HeaderSecondary.module.css"

type NavItem = { label: string; href: string }

export default function HeaderSecondary() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = useMemo<NavItem[]>(
    () => [
      { label: "Início", href: "/" },
      { label: "Notícias", href: "/noticias" },
      { label: "Quem Somos", href: "/#quem-somos" },
      { label: "Pilares", href: "/#pilares" },
      { label: "Contato", href: "/#contato" },
    ],
    []
  )

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Fecha menu ao trocar de rota
  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ESC fecha
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [close])

  // trava scroll do body quando menu abre
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

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logoWrap} aria-label="Voltar para o início">
            <Image
              src="/novaLOGO3.png"
              alt="Observatório Internacional do Turismo Religioso"
              width={320}
              height={320}
              priority
              className={styles.logo}
            />
          </Link>

          {/* Nav desktop */}
          <nav className={styles.nav} aria-label="Navegação principal">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </Link>
            ))}

            <Link href="/noticias" className={styles.cta}>
              Portal de Notícias
            </Link>
          </nav>

          {/* Burger mobile */}
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={toggle}
          >
            <span className={`${styles.bLine} ${open ? styles.bLine1 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine2 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine3 : ""}`} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
      />

      {/* Menu mobile */}
      <aside className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileInner}>
          {links.map((l) => (
            <Link key={`m-${l.href}`} href={l.href} className={styles.mobileLink} onClick={close}>
              {l.label}
            </Link>
          ))}

          <Link href="/noticias" className={styles.mobileCTA} onClick={close}>
            Portal de Notícias
          </Link>
        </div>
      </aside>
    </>
  )
}