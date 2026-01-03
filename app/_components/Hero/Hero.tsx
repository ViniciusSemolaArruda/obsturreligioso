"use client";

import { useCallback } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const scrollToHash = useCallback((hash: string) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.getElementById("site-header");
    const headerH = header?.getBoundingClientRect().height ?? 0;

    const gap = 10; // respiro
    const y = window.scrollY + el.getBoundingClientRect().top - headerH - gap;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const onAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();

      // espera 1 frame pro layout estar 100% estável
      requestAnimationFrame(() => scrollToHash(href));
    },
    [scrollToHash]
  );

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.badge}>Produções • Eventos • Cultura • Experiências</p>

        <h1 className={styles.title}>
          Capadócia Produções
          <span className={styles.sub}>Transformando ideias em eventos memoráveis.</span>
        </h1>

        <p className={styles.desc}>
          Planejamento, execução e comunicação com seriedade, impacto e excelência — do
          conceito ao palco.
        </p>

        <div className={styles.actions}>
          <a
            href="#faq"
            className={styles.primary}
            onClick={(e) => onAnchorClick(e, "#faq")}
          >
            Perguntas Frequentes
          </a>

          <a
            href="#contato"
            className={styles.secondary}
            onClick={(e) => onAnchorClick(e, "#contato")}
          >
            Solicitar Orçamento
          </a>
        </div>

        <div className={styles.highlight}>
          <div className={styles.kpi}>
            <strong>+ Experiência</strong>
            <span>em eventos e ativações</span>
          </div>
          <div className={styles.kpi}>
            <strong>+ Impacto</strong>
            <span>com responsabilidade social</span>
          </div>
          <div className={styles.kpi}>
            <strong>+ Credibilidade</strong>
            <span>ética e transparência</span>
          </div>
        </div>
      </div>
    </section>
  );
}
