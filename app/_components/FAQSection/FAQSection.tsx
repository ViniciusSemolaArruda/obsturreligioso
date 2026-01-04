"use client";

import { useId, useMemo, useState } from "react";
import styles from "./FAQSection.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const uid = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = useMemo(
  () => [
    {
      question:
        "Em quais áreas o Instituto EU ACREDITO atua?",
      answer:
        "O Instituto EU ACREDITO atua de forma integrada nas áreas de Sustentabilidade, Meio Ambiente, Educação, Tecnologia, Desenvolvimento Social, Cultura, Saúde, Esporte e Turismo. Nossos projetos são pensados para gerar impacto real, promovendo dignidade, inclusão, bem-estar e oportunidades para indivíduos e comunidades em situação de vulnerabilidade.",
    },
    {
      question:
        "Qual é o principal objetivo do Instituto EU ACREDITO?",
      answer:
        "Nosso objetivo é atuar como agente de transformação social, investindo no potencial humano e contribuindo para a redução das desigualdades. Acreditamos que o acesso a oportunidades, conhecimento e cuidado é essencial para romper ciclos de escassez e construir um futuro mais justo.",
    },
    {
      question:
        "Quem pode participar ou ser beneficiado pelos projetos?",
      answer:
        "Nossos projetos são voltados principalmente para pessoas e comunidades em situação de vulnerabilidade social. Também atuamos em parceria com instituições, coletivos, escolas, organizações públicas e privadas que compartilham dos mesmos valores de impacto social e responsabilidade.",
    },
    {
      question:
        "Como funcionam as parcerias com o Instituto?",
      answer:
        "As parcerias podem acontecer de diversas formas: apoio institucional, voluntariado, patrocínio de projetos, cooperação técnica ou desenvolvimento de ações conjuntas. Avaliamos cada proposta de acordo com sua relevância social, viabilidade e alinhamento com a missão do Instituto.",
    },
    {
      question:
        "Como o Instituto garante transparência e responsabilidade?",
      answer:
        "Prezamos pela ética e pela transparência em todas as nossas ações. Prestamos contas sobre a aplicação de recursos, o andamento dos projetos e os resultados alcançados, fortalecendo a confiança da sociedade, dos parceiros e dos apoiadores.",
    },
    {
      question:
        "Como posso apoiar ou contribuir com o Instituto EU ACREDITO?",
      answer:
        "Você pode apoiar o Instituto por meio de parcerias, doações, voluntariado ou divulgação dos nossos projetos. Entre em contato conosco para conhecer as formas de contribuição e fazer parte da transformação social que acreditamos.",
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
            Respostas rápidas sobre produção, planejamento e soluções digitais.
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
