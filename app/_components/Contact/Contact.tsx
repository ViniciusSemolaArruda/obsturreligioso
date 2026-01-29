"use client";

import { useState } from "react";
import styles from "./Contact.module.css";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const initial: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Aqui você pode ligar com seu endpoint /api/contact depois.
    await new Promise((r) => setTimeout(r, 600));

    setStatus("sent");
    setForm(initial);
    setTimeout(() => setStatus("idle"), 2000);
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
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sobrenome</label>
              <input
                className={styles.input}
                value={form.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Sobrenome"
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
              />
            </div>

            <div className={styles.fieldFull}>
              <label className={styles.label}>Telefone Celular</label>
              <input
                className={styles.input}
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="(21) 9 9999-9999"
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
              />
            </div>
          </div>

          <button className={styles.button} type="submit" disabled={status === "sending"}>
            {status === "idle" && "Fale conosco"}
            {status === "sending" && "Enviando..."}
            {status === "sent" && "Enviado ✅"}
          </button>

          <p className={styles.note}>
            Ao enviar, você concorda em ser contatado pelO Observatório Internacional do Turismo Religioso para retorno.
          </p>
        </form>
      </div>
    </section>
  );
}
