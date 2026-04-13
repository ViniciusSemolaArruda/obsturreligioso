import Image from "next/image"
import styles from "./ESGSlide.module.css"

const esgItems = [
  {
    letter: "E",
    title: "Ambiental",
    text: "O Observatório se conecta à dimensão ambiental ao promover o uso estratégico de dados, incentivar práticas responsáveis no turismo e fortalecer iniciativas alinhadas à preservação, sustentabilidade e redução de impactos ambientais.",
  },
  {
    letter: "S",
    title: "Social",
    text: "A proposta valoriza comunidades locais, fortalece a identidade cultural, amplia a visibilidade dos territórios de fé e contribui para o desenvolvimento social por meio da geração de oportunidades, inclusão e preservação da diversidade.",
  },
  {
    letter: "G",
    title: "Governança",
    text: "A atuação baseada em dados, relatórios, indicadores e monitoramento reforça transparência, organização e compromisso institucional, favorecendo uma gestão mais profissional, confiável e alinhada às boas práticas de governança.",
  },
]

export default function ESGSection() {
  return (
    <section className={styles.section} id="esg">
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.logoArea}>
            <div className={styles.logoBox}>
              <Image
                src="/ESG.png"
                alt="Logo ESG"
                fill
                className={styles.logo}
                priority
              />
            </div>
          </div>

          <div className={styles.heroContent}>
            <span className={styles.badge}>ESG</span>
            <h2 className={styles.title}>
              ESG no Observatório do Turismo Religioso
            </h2>
            <p className={styles.subtitle}>
              O projeto está alinhado a uma visão contemporânea de
              sustentabilidade, integrando impacto ambiental, valorização social
              e compromisso com boas práticas de governança.
            </p>
          </div>
        </div>

        <div className={styles.cards}>
          {esgItems.map((item) => (
            <article key={item.letter} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.letter}>{item.letter}</div>
                <div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardLabel}>
                    Pilar {item.letter} do ESG
                  </p>
                </div>
              </div>

              <p className={styles.cardText}>{item.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.bottomBox}>
          <p className={styles.bottomText}>
            Seguindo as orientações da ONU estabelecidas no Acordo de Paris de
            2015, que contou com a participação de 195 países, o Observatório
            Internacional do Turismo Religioso Laico no Brasil e na América
            Latina está alinhado às diretrizes globais de sustentabilidade,
            promovendo o uso estratégico de dados, a valorização cultural e o
            desenvolvimento do turismo de forma responsável, contribuindo
            indiretamente para as normativas relacionadas ao crédito de carbono
            e à redução de impactos ambientais.
          </p>
        </div>
      </div>
    </section>
  )
}