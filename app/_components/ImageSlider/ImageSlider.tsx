"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./ImageSlider.module.css";

type PageStyle = CSSProperties & {
  "--perView"?: number;
};

export default function ImageSlider() {
  const images = useMemo(
    () => [
      "/bu1.png",
      "/bu2.png",
      "/bu3.png",
      "/bu4.png",
      "/bu5.png",
      "/bu6.png",
      "/bu7.png",
      "/event1.png",
      "/event2.png",
      "/event3.png",
      "/event4.png",
      "/event5.png",
      "/event7.png",
      "/pagod1.png",
      "/pagod3.png",
      "/pagod4.png",
      "/pagod5.png",
      "/pagod6.png",
    ],
    []
  );

  const [perView, setPerView] = useState(4);
  const [page, setPage] = useState(0);

  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  useEffect(() => {
    function calcPerView() {
      const w = window.innerWidth;
      if (w <= 560) return 1; // mobile: 1 por vez
      if (w <= 980) return 2; // tablet: 2 por vez
      return 4; // desktop: 4 por vez
    }

    const initial = calcPerView();
    setPerView(initial);
    setPage(0);

    function onResize() {
      const next = calcPerView();
      setPerView(next);

      setPage((p) => {
        const nextPageCount = Math.max(1, Math.ceil(images.length / next));
        return Math.min(p, nextPageCount - 1);
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [images.length]);

  const pageCount = Math.max(1, Math.ceil(images.length / perView));

  function goTo(p: number) {
    setPage((p + pageCount) % pageCount);
  }

  function startAuto() {
    stopAuto();
    timerRef.current = window.setInterval(() => {
      if (!pausedRef.current) {
        setPage((p) => (p + 1) % pageCount);
      }
    }, 2600);
  }

  function stopAuto() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  function onTouchStart(e: React.TouchEvent) {
    pausedRef.current = true;
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  }

  function onTouchEnd() {
    pausedRef.current = false;

    if (deltaX.current > 50) goTo(page - 1);
    if (deltaX.current < -50) goTo(page + 1);

    startX.current = null;
    deltaX.current = 0;
  }

  return (
    <section className={styles.section} id="imagens">
      <div className={styles.container}>
        <h2 className={styles.title}>Destaques</h2>
        <p className={styles.subtitle}>Alguns registros e experiências da Capadócia.</p>

        <div
          className={styles.shell}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.track} style={{ transform: `translateX(-${page * 100}%)` }}>
            {Array.from({ length: pageCount }).map((_, p) => {
              // ✅ sempre gera EXATAMENTE perView itens (sem “buraco” no grid)
              const startIndex = p * perView;
              const slice = Array.from({ length: perView }, (_, i) => {
                const idx = (startIndex + i) % images.length;
                return images[idx];
              });

              return (
                <div
                  key={p}
                  className={styles.page}
                  style={{ "--perView": perView } as PageStyle}
                >
                  {slice.map((src, i) => (
                    <div key={`${p}-${i}-${src}`} className={styles.card}>
                      <Image
                        src={src}
                        alt="Evento Capadócia"
                        fill
                        className={styles.img}
                        sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw"
                        priority={p === 0 && i < perView}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className={styles.dots}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ir para página ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
