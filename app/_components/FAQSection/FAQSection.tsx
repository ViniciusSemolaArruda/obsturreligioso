"use client";

import { useId, useMemo, useState } from "react";
import styles from "./FAQSection.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const uid = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = useMemo(
    () => [
      {
        question: "O que é o Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina?",
        answer:
          "É uma iniciativa voltada à produção, organização e difusão de dados estratégicos sobre o turismo religioso no Brasil e no mundo. Atuamos como centro de inteligência para apoiar decisões, planejamento e desenvolvimento sustentável do setor.",
      },
      {
        question: "Quais tipos de dados e análises o Observatório acompanha?",
        answer:
          "Monitoramos fluxos de visitantes, destinos e rotas, perfis de peregrinos, tendências de mercado, sazonalidade, impactos econômicos e indicadores sociais. Também estruturamos panoramas por regiões do Brasil e por continentes no cenário global.",
      },
      {
        question: "Como as informações do Observatório podem ajudar destinos e instituições?",
        answer:
          "Os dados ajudam a orientar políticas públicas, planejar infraestrutura, qualificar serviços, organizar calendários de eventos, estruturar produtos turísticos e atrair investimentos. O objetivo é transformar informação em ações mais eficientes e mensuráveis.",
      },
      {
        question: "O Observatório produz relatórios ou boletins periódicos?",
        answer:
          "Sim. Podemos consolidar dados em relatórios temáticos e boletins de inteligência, com indicadores e leituras de cenário para apoiar gestores, parceiros e profissionais do setor ao longo do ano.",
      },
      {
        question: "O Observatório trabalha com parcerias?",
        answer:
          "Sim. Desenvolvemos cooperação com órgãos públicos, destinos turísticos, instituições religiosas, universidades, empresas e entidades do setor. As parcerias podem envolver dados, estudos, eventos, produção de conteúdo e ações estratégicas.",
      },
      {
        question: "Como posso solicitar informações ou propor uma parceria?",
        answer:
          "Você pode entrar em contato pelo canal oficial do Observatório para apresentar sua demanda, objetivo e contexto. A partir disso, avaliamos o melhor formato de apoio, estudos, entregáveis e colaboração.",
      },
    ],
    []
  );

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section id="faq" className={styles.section} aria-label="Perguntas frequentes">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h2 className={styles.title}>Perguntas frequentes</h2>
          <p className={styles.subtitle}>
            Respostas rápidas sobre dados, análises e atuação do Observatório.
          </p>
        </header>

        <div className={styles.list}>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            const contentId = `${uid}-faq-${i}`;

            return (
              <div
                key={`${item.question}-${i}`}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className={styles.left}>
                    <span className={styles.icon} aria-hidden="true">
                      ?
                    </span>
                    <span className={styles.question}>{item.question}</span>
                  </span>

                  <span
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                <div
                  id={contentId}
                  className={`${styles.answerWrap} ${isOpen ? styles.answerOpen : ""}`}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}