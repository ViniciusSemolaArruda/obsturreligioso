"use client"

import { useState } from "react"

type Status = "idle" | "sending" | "sent" | "error"

export default function NewsletterCardInline({
  classNameCard,
  classNameTitle,
  classNameText,
  classNameForm,
  classNameInput,
  classNameButton,
}: {
  classNameCard: string
  classNameTitle: string
  classNameText: string
  classNameForm: string
  classNameInput: string
  classNameButton: string
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return

    setStatus("sending")

    try {
      const cleanEmail = email.trim()

      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      })

      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        alert(data.error || "Não foi possível se inscrever.")
        setStatus("error")
        setTimeout(() => setStatus("idle"), 1200)
        return
      }

      setStatus("sent")
      setEmail("")
      setTimeout(() => setStatus("idle"), 2000)
    } catch {
      alert("Erro de conexão. Tente novamente.")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 1200)
    }
  }

  return (
    <section className={classNameCard}>
      <div className={classNameTitle}>Receba nossas notícias</div>
      <div className={classNameText}>
        Inscreva-se para receber análises e estudos sobre turismo religioso.
      </div>

      <form className={classNameForm} onSubmit={handleSubmit}>
        <input
          className={classNameInput}
          placeholder="Seu e-mail"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "sending"}
        />

        <button className={classNameButton} type="submit" disabled={status === "sending"}>
          {status === "idle" && "Inscrever-se"}
          {status === "sending" && "Inscrevendo..."}
          {status === "sent" && "Inscrito ✅"}
          {status === "error" && "Tentar novamente"}
        </button>
      </form>
    </section>
  )
}