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
              desenvolvimento econômico, cultura e inovação em escala nacional e
              internacional.
            </strong>
          </p>

          <p className={styles.text}>
            O{" "}
            <strong>
              Observatório Internacional do Turismo Religioso Laico no Brasil e na
              América Latina
            </strong>{" "}
            nasce a partir da constatação de que o turismo religioso é um dos
            maiores segmentos do turismo mundial, movimentando entre{" "}
            <strong>330 e 350 milhões de pessoas por ano</strong> e representando
            aproximadamente <strong>12% a 15% das viagens internacionais</strong>.
            No Brasil, o setor é responsável por cerca de{" "}
            <strong>18 milhões de viagens anuais</strong> e uma receita estimada em{" "}
            <strong>R$ 15 bilhões por ano</strong>, consolidando-se como um vetor
            estratégico de desenvolvimento econômico, cultural e social.
          </p>

          <p className={styles.text}>
            O{" "}
            <strong>
              Observatório Internacional do Turismo Religioso Laico no Brasil e na
              América Latina
            </strong>{" "}
            atua como um centro de inteligência que monitora fluxos turísticos,
            tendências, destinos, rotas de peregrinação, perfis de peregrinos e
            impactos econômicos do setor, fornecendo informações qualificadas para
            governos, instituições, destinos turísticos, organizações religiosas,
            investidores e profissionais do segmento.
          </p>

          <p className={styles.text}>
            Nossa atuação considera a diversidade do turismo religioso no Brasil,
            distribuído entre as regiões Sudeste, Nordeste, Norte, Sul e
            Centro-Oeste, bem como sua dimensão global, com forte presença na Ásia,
            Europa, Américas, África e Oceania, conectando o país às principais
            rotas internacionais de fé e peregrinação.
          </p>

          <p className={styles.text}>
            Além do impacto cultural, espiritual e sociocultural, reconhecemos o
            papel do turismo religioso como um importante gerador de empregos
            diretos e indiretos nos setores de hotelaria, transporte, gastronomia,
            comércio, eventos, tecnologia e serviços, contribuindo para o
            fortalecimento das economias locais e regionais.
          </p>

          <p className={styles.cta}>
            <strong>
              O Observatório Internacional do Turismo Religioso Laico no Brasil e
              na América Latina existe para transformar dados em inteligência,
              conhecimento em estratégia e o turismo religioso em uma ferramenta
              sustentável de desenvolvimento, integração cultural e planejamento
              territorial.
            </strong>
          </p>
        </div>

        {/* DIREITA — imagem */}
        <div className={styles.right}>
          <div className={styles.rightSticky}>
            <Image
              src="/novaLOGO3.png"
              alt="Observatório Internacional do Turismo Religioso Laico no Brasil e na América Latina"
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