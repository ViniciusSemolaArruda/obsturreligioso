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
              Somos uma instituição sem fins lucrativos movida pela convicção de que a
              transformação social nasce da ação consciente e do investimento no potencial humano.
            </strong>
          </p>

          <p className={styles.text}>
            No <strong>Instituto Eu Acredito</strong>, atuamos como um agente transformador na vida
            de indivíduos em situação de vulnerabilidade, promovendo <strong>dignidade</strong> e{" "}
            <strong>autonomia</strong> por meio de oportunidades integradas que abrangem os pilares
            do desenvolvimento humano.
          </p>

          <p className={styles.text}>
            Nossa existência se justifica pela urgência de reduzir as desigualdades sociais.
            Acreditamos que, ao oferecer as ferramentas certas, podemos <strong>romper ciclos de
            escassez</strong> e construir um futuro em que o <strong>CEP de nascimento</strong> não
            determine o destino de uma criança, de uma família ou de uma comunidade.
          </p>

          <p className={styles.text}>
            Para gerar impacto real, trabalhamos em frentes multidisciplinares:{" "}
            <strong>Educação e Tecnologia</strong>, unindo ensino e inovação para preparar nossos
            assistidos para os desafios da era digital; <strong>Cultura e Esporte</strong>, como
            caminhos de expressão, disciplina, saúde e convivência; e <strong>Saúde</strong>, com
            ações de bem-estar e acesso, entendendo que o equilíbrio físico e mental é base para
            qualquer evolução.
          </p>

          <p className={styles.text}>
            Nosso compromisso é guiado por responsabilidade social, transparência e ética.
            Prestamos contas de cada recurso e de cada passo dado, porque a confiança da sociedade
            e de nossos parceiros é o nosso maior patrimônio — sempre buscando equilíbrio com o
            planeta por meio de práticas de responsabilidade ambiental.
          </p>

          <p className={styles.cta}>
            <strong>
              No Instituto Eu Acredito, o amanhã se constrói hoje — mas sem esquecer do ontem.
            </strong>
          </p>
        </div>

        {/* DIREITA — imagem */}
        <div className={styles.right}>
          <div className={styles.rightSticky}>
            <Image
              src="/novaLOGO2.png"
              alt="Instituto Eu Acredito"
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
