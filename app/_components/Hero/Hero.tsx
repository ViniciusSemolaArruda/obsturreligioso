"use client";

import { useCallback } from "react";
import styles from "./Hero.module.css";

const topics = [
  "Catolicismo",
  "Cristianismo",
  "Islamismo",
  "Judaísmo",
  "Hinduísmo",
  "Budismo",
  "Espiritismo",
  "Religiões de Matriz Africana",
  "Espiritualidade",
];

export default function Hero() {
  const scrollToHash = useCallback((hash: string) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.getElementById("site-header");
    const headerH = header?.getBoundingClientRect().height ?? 0;

    const gap = -230;
    const y = window.scrollY + el.getBoundingClientRect().top - headerH - gap;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const onAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      requestAnimationFrame(() => scrollToHash(href));
    },
    [scrollToHash]
  );

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          Observatório Internacional do Turismo Religioso
          <span className={styles.sub}>
            Fé no Turismo!
          </span>
        </h1>

        <div className={styles.topics} aria-label="Áreas de atuação">
          {topics.map((t) => (
            <span key={t} className={styles.topic}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <a
            href="#pilares"
            className={styles.primary}
            onClick={(e) => onAnchorClick(e, "#pilares")}
          >
            Nossos pilares
          </a>

          <a
            href="#contato"
            className={styles.secondary}
            onClick={(e) => onAnchorClick(e, "#contato")}
          >
            Contato
          </a>
        </div>
      </div>
    </section>
  );
}
