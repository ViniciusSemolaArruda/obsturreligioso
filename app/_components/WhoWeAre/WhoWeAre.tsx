import Image from "next/image";
import styles from "./WhoWeAre.module.css";

export default function WhoWeAre() {
  return (
    <section className={styles.section} id="quem-somos">
      <div className={styles.container}>
        {/* ESQUERDA — texto */}
        <div className={styles.left}>
          <h2 className={styles.heading}>
            <span className={styles.headingLight}>Quem</span>{" "}
            <span className={styles.headingStrong}>somos</span>
          </h2>

          <p className={styles.lead}>
            <strong>
              Somos uma instituição dedicada à produção, organização e difusão de
              dados estratégicos sobre o turismo religioso, conectando fé,
              desenvolvimento econômico, cultura e inovação.
            </strong>
          </p>

          <p className={styles.text}>
            O <strong>Observatório do Turismo Religioso Internacional</strong> nasce
            a partir da constatação de que o turismo religioso é um dos maiores
            segmentos do turismo mundial, movimentando entre{" "}
            <strong>330 e 350 milhões de pessoas por ano</strong> e representando
            aproximadamente <strong>12% a 15% das viagens internacionais</strong>.
            No Brasil, o setor gera cerca de <strong>18 milhões de viagens
            anuais</strong> e uma receita aproximada de{" "}
            <strong>R$ 15 bilhões por ano</strong>, consolidando-se como um vetor
            estratégico de desenvolvimento.
          </p>

          <p className={styles.text}>
            Atuamos como um centro de inteligência que monitora fluxos, tendências,
            destinos, rotas, perfis de peregrinos e impactos econômicos, oferecendo
            informações qualificadas para governos, destinos, instituições
            religiosas, investidores e profissionais do setor.
          </p>

          <p className={styles.text}>
            Nosso trabalho considera a diversidade do turismo religioso no Brasil,
            que se distribui principalmente entre o Sudeste, Nordeste, Norte, Sul e
            Centro-Oeste, e também sua dimensão global, com forte presença na Ásia,
            Europa, Américas, África e Oceania, conectando o país às principais rotas
            internacionais de peregrinação.
          </p>

          <p className={styles.text}>
            Além do impacto cultural e espiritual, reconhecemos o papel do turismo
            religioso como gerador de empregos diretos e indiretos em áreas como
            hotelaria, transporte, gastronomia, comércio, eventos e tecnologia,
            fortalecendo economias locais e regionais.
          </p>

          <p className={styles.cta}>
            <strong>
              O Observatório do Turismo Religioso Internacional existe para
              transformar dados em inteligência, fé em desenvolvimento e destinos em
              oportunidades sustentáveis.
            </strong>
          </p>
        </div>

        {/* DIREITA — imagem */}
        <div className={styles.right}>
          <div className={styles.rightSticky}>
            <Image
              src="/novaLOGO3.png"
              alt="Observatório do Turismo Religioso Internacional"
              width={1400}
              height={900}
              priority
              className={styles.art}
            />
          </div>
        </div>
      </div>
    </section>
  );
}