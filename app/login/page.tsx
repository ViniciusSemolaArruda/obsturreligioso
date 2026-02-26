"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./Login.module.css"

type LoginResponse = {
  ok?: boolean
  error?: string
}

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      })

      let data: LoginResponse = {}
      try {
        data = (await res.json()) as LoginResponse
      } catch {
        data = {}
      }

      if (!res.ok || !data.ok) {
        alert(data.error || "Credenciais inválidas.")
        setLoading(false)
        return
      }

      router.push("/admin")
    } catch (error) {
      console.error(error)
      alert("Erro de conexão com o servidor.")
    } finally {
      setLoading(false)
    }
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
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
                disabled={loading}
              />

              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                disabled={loading}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  )
}