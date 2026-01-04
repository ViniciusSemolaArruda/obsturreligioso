"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const leftLinks = useMemo(
    () => [
      { label: "Início", href: "#inicio" },
      { label: "Quem Somos", href: "#quem-somos" },
      { label: "Pilares", href: "#pilares" },
      { label: "Como fazemos", href: "#como-fazemos" },
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

  const allLinks = useMemo(
    () => [...leftLinks, ...rightLinks],
    [leftLinks, rightLinks]
  );

  const close = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  /* 🔽🔼 ESCONDE / MOSTRA HEADER NO SCROLL (MAS NÃO SOME COM MENU ABERTO) */
  useEffect(() => {
    const onScroll = () => {
      if (open) return; // ✅ com menu aberto, mantém header visível

      const currentY = window.scrollY;

      // evita flicker com micro scroll
      if (Math.abs(currentY - lastScrollY.current) < 10) return;

      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true); // rolando pra baixo
      } else {
        setHidden(false); // rolando pra cima
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  /* ESC fecha menu */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  /* trava scroll do body quando menu abre (opcional mas profissional) */
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* scroll com offset real */
  const scrollToHash = useCallback((hash: string) => {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.getElementById("site-header");

  // altura real do header visível
  const headerH = header?.getBoundingClientRect().height ?? 0;

  // respiro extra (ajuste fino)
  const gap = -230;

  const y = window.scrollY + el.getBoundingClientRect().top - headerH - gap;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}, []);


  const onNavClick = useCallback(
  (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;

    e.preventDefault();

    // ✅ garante que o header esteja visível antes de medir
    setHidden(false);
    close();

    // ✅ 2 frames: 1) aplicar hidden=false / fechar menu, 2) layout estável e mede certo
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToHash(href);
      });
    });
  },
  [close, scrollToHash]
);


  return (
    <>
      <header
        id="site-header"
        className={`${styles.header} ${hidden ? styles.headerHidden : ""}`}
      >
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
            href="#inicio"
            className={styles.logoWrap}
            onClick={(e) => onNavClick(e, "#inicio")}
            aria-label="Voltar ao início"
          >
            <Image
              src="/novaLOGO2.png"
              alt="Instituto Eu Acredito"
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

            <Link
              href="#contato"
              className={styles.cta}
              onClick={(e) => onNavClick(e, "#contato")}
            >
              Fale Conosco
            </Link>

            {/* ✅ Burger aparece no mobile via CSS */}
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

      {/* ✅ Overlay */}
      <button
        type="button"
        aria-label="Fechar menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
      />

      {/* ✅ Menu mobile */}
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

          <Link
            href="#contato"
            className={styles.mobileCTA}
            onClick={(e) => onNavClick(e, "#contato")}
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </>
  );
}
