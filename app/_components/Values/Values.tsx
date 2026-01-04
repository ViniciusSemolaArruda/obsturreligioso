import Image from "next/image";
import styles from "./Values.module.css";

const items = [
  {
    title: "Nossa Missão",
    text: "Atuar como um agente permanente de transformação social, promovendo dignidade, autonomia e oportunidades reais para pessoas em situação de vulnerabilidade. O INSTITUTO EU ACREDITO nasce da convicção de que o desenvolvimento humano acontece quando há acesso a ferramentas adequadas, acompanhamento contínuo e estímulo ao potencial individual. Por isso, investimos em ações integradas que abrangem educação, tecnologia, cultura, esporte e saúde, criando caminhos concretos para a inclusão social e para a construção de um futuro mais justo, sustentável e igualitário.",
    icon: "/icons/missao.png",
  },
  {
    title: "Responsabilidade Social",
    text: "Acreditamos que a redução das desigualdades sociais exige ações práticas, contínuas e comprometidas com a realidade das comunidades atendidas. Desenvolvemos projetos que geram impacto social positivo, oferecendo suporte, conhecimento e oportunidades capazes de romper ciclos históricos de escassez. Nosso trabalho é orientado pela ideia de que o local de nascimento, a condição social ou o contexto familiar não devem limitar sonhos, escolhas ou trajetórias de vida. Atuamos de forma próxima às comunidades, ouvindo, compreendendo e construindo soluções que promovam transformação real e duradoura.",
    icon: "/icons/social.png",
  },
  {
    title: "Ética, Transparência e Sustentabilidade",
    text: "Nossa atuação é pautada pela ética, pela transparência na gestão de recursos e pela responsabilidade social e ambiental. Prestamos contas de cada ação realizada, de cada recurso investido e de cada resultado alcançado, fortalecendo a confiança da sociedade, dos parceiros e dos apoiadores que acreditam em nosso trabalho. Além disso, buscamos constantemente práticas sustentáveis que respeitem o meio ambiente e garantam um legado positivo para as próximas gerações, entendendo que a transformação social só é completa quando também preserva o planeta e promove equilíbrio entre desenvolvimento humano e responsabilidade ambiental.",
    icon: "/icons/transparencia.png",
  },
];

export default function Values() {
  return (
    <section className={styles.section} id="pilares">
      <div className={styles.container}>
        <h2 className={styles.title}>Nossos pilares</h2>
        <p className={styles.subtitle}>
          Valores que orientam, sustentam e fortalecem a atuação do INSTITUTO EU ACREDITO.
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
