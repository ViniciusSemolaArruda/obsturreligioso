import Image from "next/image"
import Link from "next/link"
import styles from "./Footer.module.css"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} id="contato">
      <div className={styles.container}>
        {/* TEXTO CENTRAL */}
        <p className={styles.centerText}>
          O Turismo Religioso laico, é o porto seguro do segmento, onde o sagrado
          de cada um ancora, o respeito e os direitos organicamente transcendem,
          e as culturas se desenvolvem e se perpetuam.
        </p>

        {/* LINHA COM 2 COLUNAS */}
        <div className={styles.columns}>
          {/* CONTATO - ESQUERDA */}
          <div className={styles.colLeft}>
            <p className={styles.label}>Contato</p>

            {/* 👇 cada um em linha separada */}
            <div className={styles.contactBlock}>
              <a
                className={styles.link}
                href="mailto:contato.capadociaeventos@gmail.com"
              >
                contato.capadociaeventos@gmail.com
              </a>

              <a
                className={styles.link}
                href="https://wa.me/5521976586293"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: (21) 97658-6293
              </a>
            </div>
          </div>

          {/* REDES + LOGIN - DIREITA */}
          <div className={styles.colRight}>
            <p className={styles.label}>Institucional</p>

            <div className={styles.rightBlock}>
              <Link
                href="https://www.instagram.com/obs.turreligioso_laico_do_bras/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram INSTITUTO EU ACREDITO"
              >
                <Image
                  src="/icons/instagram.png"
                  alt="Instagram"
                  width={22}
                  height={22}
                  className={styles.socialIcon}
                />
                <span>Instagram</span>
              </Link>

              {/* 👇 LOGIN elegante e discreto */}
              <Link href="/login" className={styles.loginLink}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {year} Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina. Todos
          os direitos reservados.
        </span>
      </div>
    </footer>
  )
}