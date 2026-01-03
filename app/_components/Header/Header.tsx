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

  // se rolar a página, fecha o menu
  useEffect(() => {
    if (!open) return;
    const onScroll = () => close();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, close]);

  // ✅ scroll com offset REAL do header (funciona igual em produção)
  const scrollToHash = useCallback((hash: string) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.getElementById("site-header");
    const headerH = header?.getBoundingClientRect().height ?? 0;

    // pequeno "gap" pra respirar
    const gap = 10;

    const y = window.scrollY + el.getBoundingClientRect().top - headerH - gap;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      close();
      // espera 1 frame pra garantir que o header/menu já fechou e layout estabilizou
      requestAnimationFrame(() => scrollToHash(href));
    },
    [close, scrollToHash]
  );

  return (
    <header className={styles.header} id="site-header">
      <nav className={styles.nav} aria-label="Navegação principal">
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

        <Link href="#inicio" className={styles.logoWrap} aria-label="Capadócia Produções"
          onClick={(e) => onNavClick(e, "#inicio")}
        >
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

          <Link href="#contato" className={styles.cta} onClick={(e) => onNavClick(e, "#contato")}>
            Fale Conosco
          </Link>

          <button
            className={styles.burger}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className={`${styles.bLine} ${open ? styles.bLine1 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine2 : ""}`} />
            <span className={`${styles.bLine} ${open ? styles.bLine3 : ""}`} />
          </button>
        </div>
      </nav>

      <button
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.mobileMenuInner}>
          {allLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.mobileLink}
              onClick={(e) => onNavClick(e, l.href)}
            >
              {l.label}
            </Link>
          ))}

          <Link href="#contato" className={styles.mobileCTA} onClick={(e) => onNavClick(e, "#contato")}>
            Fale Conosco
          </Link>
        </div>
      </div>
    </header>
  );
}
