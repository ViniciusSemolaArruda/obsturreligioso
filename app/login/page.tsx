"use client"

import { useState } from "react"
import styles from "./Login.module.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // TODO: aqui você vai integrar sua autenticação do admin (API / next-auth / etc.)
    console.log("login:", { email, password })
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label="Área de login">
        <h1 className={styles.title}>Área Administrativa</h1>
        <p className={styles.subtitle}>
          Entre com seu e-mail e senha para acessar.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            E-mail
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Senha
            <div className={styles.passwordRow}>
              <input
                className={styles.input}
                type={show ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />

              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <button className={styles.submit} type="submit">
            Entrar
          </button>

          
        </form>
      </section>
    </main>
  )
}