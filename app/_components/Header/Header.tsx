"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  const leftLinks = useMemo(
    () => [
      { label: "Início", href: "#inicio" },
      { label: "Quem Somos", href: "#quem-somos" },
      { label: "Pilares", href: "#pilares" },
      { label: "Imagens", href: "#imagens" },
    ],
    []
  );

  const rightLinks = useMemo(
    () => [
      { label: "Perguntas Frequentes", href: "#faq" },
      { label: "Contato", href: "#contato" },
    ],
    []
  );

  const allLinks = useMemo(() => [...leftLinks, ...rightLinks], [leftLinks, rightLinks]);

  const close = useCallback(() => setOpen(false), []);

  // ESC fecha
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // trava scroll quando abre (HTML + BODY) — evita bug mobile
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;

    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    }

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  return (
    <header className={styles.header} id="site-header">
      <nav className={styles.nav} aria-label="Navegação principal">
        {/* Lado esquerdo (desktop) */}
        <div className={styles.side}>
          {leftLinks.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="#inicio" className={styles.logoWrap} aria-label="Capadócia Produções">
          <Image
            src="/novaLOGO.png"
            alt="Capadócia Produções e Eventos"
            width={300}
            height={300}
            priority
            sizes="(max-width: 860px) 150px, 170px"
            className={styles.logo}
          />
        </Link>

        {/* Lado direito (desktop) */}
        <div className={styles.sideRight}>
          {rightLinks.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}

          <Link href="#contato" className={styles.cta}>
            Fale Conosco
          </Link>

          {/* Botão hambúrguer (mobile) */}
          <button
            className={styles.burger}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className={`${styles.bLine} ${open ? styles.bLine1 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine2 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine3 : ""}`} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <button
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
        type="button"
      />

      {/* Drawer fullscreen */}
      <aside
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.drawerTop}>
          <Link href="#inicio" className={styles.drawerBrand} onClick={close} aria-label="Início">
            <Image
              src="/novaLOGO.png"
              alt="Capadócia Produções e Eventos"
              width={300}
              height={300}
              sizes="150px"
              className={styles.drawerLogo}
              priority
            />
          </Link>

          <button className={styles.closeBtn} onClick={close} type="button" aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className={styles.drawerLinks}>
          {allLinks.map((l) => (
            <Link key={l.href} href={l.href} className={styles.drawerLink} onClick={close}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="#contato" className={styles.drawerCTA} onClick={close}>
          Fale Conosco
        </Link>
      </aside>
    </header>
  );
}
