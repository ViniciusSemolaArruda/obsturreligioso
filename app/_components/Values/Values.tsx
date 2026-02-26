import Image from "next/image";
import styles from "./Values.module.css";

const items = [
  {
  title: "Missão",
  text:
    "O Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina tem como missão fortalecer e posicionar o turismo religioso como vetor estratégico de desenvolvimento cultural, social e econômico. Atua na valorização da diversidade de crenças, na promoção do diálogo inter-religioso e na integração entre destinos, instituições e mercados nacionais e internacionais. O Observatório estimula a cooperação entre territórios, fomenta boas práticas, incentiva a qualificação de serviços e contribui para que o Brasil e a América Latina sejam reconhecidos como referências globais no segmento. Também busca incentivar a inovação, a profissionalização do setor e a criação de políticas públicas que fortaleçam o turismo religioso de forma estruturada, sustentável, inclusiva e laica.",
  icon: "/icons/missao.png",
},
{
  title: "Justificativa",
  text:
    "O turismo religioso movimenta milhões de pessoas e gera impactos econômicos expressivos todos os anos, porém ainda carece de organização, dados estruturados e inteligência de mercado, especialmente no contexto do pluralismo religioso. O Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina surge para suprir essa lacuna, produzindo pesquisas, sistematizando informações e oferecendo suporte estratégico a governos, destinos, instituições e organizações do setor. Dessa forma, contribui para decisões mais eficientes, para o fortalecimento sustentável do segmento e para a valorização da diversidade religiosa na América Latina. Além disso, promove maior integração entre atores públicos e privados, impulsionando planejamento, investimentos e desenvolvimento regional.",
  icon: "/icons/social.png",
},
{
  title: "Objetivo",
  text:
    "O principal objetivo do Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina é expandir e qualificar o segmento por meio da produção e difusão de conhecimento, do fortalecimento de redes institucionais e da promoção de experiências turísticas estruturadas e inclusivas. O Observatório incentiva a realização de eventos, palestras, workshops, feiras, simpósios e congressos voltados ao turismo religioso sob uma perspectiva laica, plural e internacional, promovendo o intercâmbio entre o Brasil, a América Latina e o cenário global. Também busca apoiar destinos na estruturação de produtos turísticos religiosos, no planejamento estratégico e no fortalecimento da economia local de forma sustentável.",
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