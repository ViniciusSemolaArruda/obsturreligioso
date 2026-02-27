"use client"

import { useState } from "react"
import styles from "./Contact.module.css"

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

type Status = "idle" | "sending" | "sent" | "error"

const initial: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
}

function sanitizeForm(f: FormState): FormState {
  return {
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    email: f.email.trim(),
    phone: f.phone.trim(),
    message: f.message.trim(),
  }
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial)
  const [status, setStatus] = useState<Status>("idle")

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (status === "sending") return
    setStatus("sending")

    try {
      const payload = sanitizeForm(form)

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}))

      if (!res.ok || !data.ok) {
        alert(data.error || "Não foi possível enviar sua mensagem. Tente novamente.")
        setStatus("error")
        setTimeout(() => setStatus("idle"), 1200)
        return
      }

      setStatus("sent")
      setForm(initial)
      setTimeout(() => setStatus("idle"), 2000)
    } catch {
      alert("Falha de rede. Verifique sua internet e tente novamente.")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 1200)
    }
  }

  return (
    <section className={styles.section} id="contato">
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.kicker}>Fale Conosco</p>
          <h2 className={styles.title}>O que você quer realizar?</h2>
          <p className={styles.subtitle}>
            Conte um pouco do seu evento ou projeto. A gente responde com clareza e objetividade.
          </p>

          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Atendimento</span>
              <span className={styles.infoValue}>Rio de Janeiro</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Resposta</span>
              <span className={styles.infoValue}>Normalmente em até 24h</span>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit} autoComplete="on">
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Primeiro Nome *</label>
              <input
                className={styles.input}
                value={form.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Primeiro Nome"
                required
                disabled={status === "sending"}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sobrenome</label>
              <input
                className={styles.input}
                value={form.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Sobrenome"
                disabled={status === "sending"}
              />
            </div>

            <div className={styles.fieldFull}>
              <label className={styles.label}>E-mail *</label>
              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                disabled={status === "sending"}
              />
            </div>

            <div className={styles.fieldFull}>
              <label className={styles.label}>Telefone Celular</label>
              <input
                className={styles.input}
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="(21) 9 9999-9999"
                disabled={status === "sending"}
              />
            </div>

            <div className={styles.fieldFull}>
              <label className={styles.label}>Mensagem</label>
              <textarea
                className={styles.textarea}
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
                placeholder="Escreva aqui o que você deseja realizar..."
                rows={5}
                disabled={status === "sending"}
              />
            </div>
          </div>

          <button className={styles.button} type="submit" disabled={status === "sending"}>
            {status === "idle" && "Fale conosco"}
            {status === "sending" && "Enviando..."}
            {status === "sent" && "Enviado ✅"}
            {status === "error" && "Tentar novamente"}
          </button>

          <p className={styles.note}>
            Ao enviar, você concorda em ser contatado pelo Observatório Internacional do Turismo
            Religioso Laico no Brasil e na America Latina para retorno.
          </p>
        </form>
      </div>
    </section>
  )
}