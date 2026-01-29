import Image from "next/image";
import styles from "./Values.module.css";

const items = [
  {
    title: "Missão",
    text:
      "O Observatório do Turismo Religioso Internacional tem como missão fortalecer e posicionar o turismo religioso como vetor estratégico de desenvolvimento cultural, social e econômico. Atua na valorização da fé, na promoção da pluralidade religiosa e na integração entre destinos, instituições e mercados nacionais e internacionais. O Observatório estimula a cooperação entre territórios, fomenta boas práticas, incentiva a qualificação de serviços e contribui para que o Brasil seja reconhecido como referência global no segmento. Também busca incentivar a inovação, a profissionalização do setor e a criação de políticas públicas que fortaleçam o turismo religioso de forma estruturada, sustentável e inclusiva.",
    icon: "/icons/missao.png",
  },
  {
    title: "Justificativa",
    text:
      "O turismo religioso movimenta milhões de pessoas e bilhões em receitas todos os anos, porém ainda carece de organização, dados estruturados e inteligência de mercado. O Observatório surge para suprir essa lacuna, produzindo pesquisas, sistematizando informações e oferecendo suporte estratégico a governos, destinos e instituições. Dessa forma, contribui para decisões mais eficientes e para o fortalecimento sustentável do setor. Além disso, promove maior integração entre atores públicos e privados, impulsionando planejamento, investimentos e desenvolvimento regional.",
    icon: "/icons/social.png",
  },
  {
    title: "Objetivo",
    text:
      "O principal objetivo do Observatório do Turismo Religioso Internacional é expandir as fronteiras do segmento por meio da produção e difusão de conhecimento, do fortalecimento de redes e da promoção de experiências turísticas qualificadas. O Observatório estimula a realização de eventos, palestras, workshops, feiras, simpósios e congressos, sempre orientados pela pluralidade religiosa e pelo intercâmbio entre Brasil e cenário internacional. Também busca apoiar destinos na estruturação de produtos turísticos e no fortalecimento da economia local.",
    icon: "/icons/transparencia.png",
  },
];

export default function Values() {
  return (
    <section className={styles.section} id="pilares">
      <div className={styles.container}>
        <h2 className={styles.title}>Nossos pilares</h2>
        <p className={styles.subtitle}>
          Valores que orientam, sustentam e fortalecem a atuação do Observatório do Turismo Religioso Internacional.
        </p>

        <div className={styles.grid}>
          {items.map((it) => (
            <article key={it.title} className={styles.card}>
              <div className={styles.iconSlot} aria-hidden="true">
                <Image
                  src={it.icon}
                  alt=""
                  width={64}
                  height={64}
                  className={styles.icon}
                />
              </div>

              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardText}>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}