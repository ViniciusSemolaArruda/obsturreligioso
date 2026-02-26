"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import styles from "./AdminShell.module.css"

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // fecha menu ao trocar de rota
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    // bloqueia scroll do body quando menu estiver aberto (mobile)
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST", credentials: "include" })
    router.replace("/")
    router.refresh()
  }

  return (
    <div className={styles.app}>
      {/* Topbar (mobile) */}
      <header className={styles.mobileTopbar}>
        <button
          className={styles.burger}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>

        <div className={styles.mobileBrand}>
          <Image
            src="/novaLOGO3.png"
            alt="Logo"
            width={160}
            height={48}
            priority
            className={styles.mobileLogo}
          />
        </div>

        <div className={styles.mobileRight}>
          <span className={styles.pill}>Admin</span>
        </div>
      </header>

      {/* Overlay (mobile) */}
      <button
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-label="Fechar menu"
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <Image
            src="/novaLOGO3.png"
            alt="Logo"
            width={190}
            height={56}
            priority
            className={styles.logo}
          />
        </div>

        <nav className={styles.nav} aria-label="Navegação Admin">
          <Link
            className={`${styles.item} ${pathname === "/admin" ? styles.active : ""}`}
            href="/admin"
          >
            Dashboard
          </Link>

          <Link
            className={`${styles.item} ${pathname === "/admin/criar-noticia" ? styles.active : ""}`}
            href="/admin/criar-noticia"
          >
            Criar Notícias
          </Link>
          <Link
  className={`${styles.item} ${pathname === "/admin/noticias" ? styles.active : ""}`}
  href="/admin/noticias"
>
  Notícias
</Link>
          <Link
            className={`${styles.item} ${pathname === "/admin/mensagens" ? styles.active : ""}`}
            href="/admin/mensagens"
          >
            Mensagens
          </Link>
        </nav>

        <div className={styles.footerArea}>
          <button className={styles.logout} onClick={handleLogout}>
            Sair
          </button>

          <div className={styles.smallNote}>
            Observatório • Painel administrativo
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Topbar (desktop) */}
        <div className={styles.topbar}>
          <div className={styles.topTitle}>Área Administrativa</div>
          <div className={styles.topRight}>
            <span className={styles.pill}>Sessão ativa</span>
          </div>
        </div>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}