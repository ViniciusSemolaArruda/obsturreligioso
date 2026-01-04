"use client";

import { useEffect, useRef } from "react";
import styles from "./Timeline.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  icon: "user" | "whatsapp" | "note" | "laptop";
  title: string;
  text: string;
};

const steps: Step[] = [
  {
    num: "01",
    icon: "user",
    title: "Escutamos a realidade",
    text: "Tudo começa com pessoas. Acolhemos demandas, entendemos o contexto e mapeamos as necessidades reais da comunidade com respeito e sensibilidade.",
  },
  {
    num: "02",
    icon: "whatsapp",
    title: "Conectamos quem pode ajudar",
    text: "Unimos voluntários, parceiros e lideranças locais para tirar a ideia do papel. Comunicação ágil, humana e transparente — do primeiro contato ao próximo passo.",
  },
  {
    num: "03",
    icon: "note",
    title: "Planejamos com propósito",
    text: "Transformamos a intenção em ação: metas, organização e responsabilidade. Definimos prioridades, recursos e cronograma para gerar impacto consistente e mensurável.",
  },
  {
    num: "04",
    icon: "laptop",
    title: "Executamos e prestamos contas",
    text: "Colocamos o projeto em prática e acompanhamos de perto os resultados. Registramos ações, avaliamos impacto e prestamos contas com ética e transparência.",
  },
];

function Icon({ name }: { name: Step["icon"] }) {
  switch (name) {
    case "user":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2-8 4.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5C20 16 16.42 14 12 14Z"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.74 6.2L0 24l5.95-1.73A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52ZM12 21.82a9.8 9.8 0 0 1-5-1.36l-.36-.22-3.53 1.03 1.03-3.53-.22-.36A9.8 9.8 0 1 1 12 21.82Zm5.65-7.08c-.31-.16-1.86-.92-2.15-1.03-.29-.11-.5-.16-.71.16-.2.31-.82 1.03-1.01 1.25-.19.22-.37.24-.69.08-.31-.16-1.32-.49-2.52-1.56-.93-.83-1.55-1.86-1.73-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.37.46-.55.15-.19.2-.31.31-.52.1-.2.05-.39-.03-.55-.08-.16-.71-1.72-.97-2.34-.25-.6-.5-.52-.71-.53h-.6c-.2 0-.52.08-.8.39-.28.31-1.07 1.05-1.07 2.56s1.1 2.97 1.26 3.17c.16.2 2.16 3.29 5.23 4.61.73.31 1.3.49 1.74.63.73.23 1.4.2 1.93.12.59-.09 1.86-.76 2.13-1.5.26-.74.26-1.38.18-1.51-.08-.13-.28-.2-.59-.36Z"
          />
        </svg>
      );
    case "note":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 4v2h10V6H7Zm0 4v2h10v-2H7Zm0 4v2h7v-2H7Z"
          />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4V5Zm-2 11h20v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1Z"
          />
        </svg>
      );
  }
}

export default function Timeline() {
  const rootRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    const progress = progressRef.current;
    if (!root || !line || !progress) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.text}`));
    gsap.set(cards, { opacity: 0, y: 12, filter: "blur(8px)" });

    const cardsTween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: line,
        start: "top 80%",
        end: "bottom 55%",
        scrub: true,
      },
    });

    const lineTween = gsap.fromTo(
      progress,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: line,
          start: "top 80%",
          end: "bottom 35%",
          scrub: true,
        },
      }
    );

    return () => {
      cardsTween.kill();
      lineTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.pai} id="como-fazemos">
      <div className={styles.layout}>
        {/* ESQUERDA: título */}
        <aside className={styles.left}>
          <h2 className={styles.title}>Como geramos impacto</h2>
          <p className={styles.subtitle}>
            Um caminho claro: da escuta à ação, com transparência e resultados.
          </p>
        </aside>

        {/* DIREITA: timeline */}
        <div className={styles.right}>
          <div ref={lineRef} className={styles.linee}>
            <div ref={progressRef} className={styles.progress} />

            {steps.map((s) => (
              <div key={s.num} className={styles.text}>
                <div className={styles.stepHead}>
                  <span className={styles.badge}>{s.num}</span>
                  <span className={styles.iconBox}>
                    <Icon name={s.icon} />
                  </span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                </div>

                <p className={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
