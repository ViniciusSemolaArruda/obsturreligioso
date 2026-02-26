"use client"

import { useId, useMemo, useState } from "react"
import styles from "./ImageDropzone.module.css"

type Props = {
  value: File | null
  onChange: (file: File | null) => void
  maxMB?: number
}

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export default function ImageDropzone({ value, onChange, maxMB = 2 }: Props) {
  const inputId = useId()
  const [drag, setDrag] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const previewUrl = useMemo(() => {
    if (!value) return null
    const url = URL.createObjectURL(value)
    return url
  }, [value])

  // cleanup objectURL
  useMemo(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function validate(file: File) {
    if (!ACCEPT.includes(file.type)) return `Formato inválido. Use JPG, PNG, WEBP ou GIF.`
    const maxBytes = maxMB * 1024 * 1024
    if (file.size > maxBytes) return `Imagem muito grande. Máx ${maxMB}MB.`
    return null
  }

  function pick(file: File) {
    const v = validate(file)
    if (v) {
      setErr(v)
      onChange(null)
      return
    }
    setErr(null)
    onChange(file)
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) pick(file)
    e.target.value = "" // permite escolher o mesmo arquivo de novo
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)

    const file = e.dataTransfer.files?.[0]
    if (file) pick(file)
  }

  return (
    <div className={styles.wrap}>
      <label
        htmlFor={inputId}
        className={`${styles.zone} ${drag ? styles.drag : ""} ${value ? styles.has : ""}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDrag(false)
        }}
        onDrop={onDrop}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className={styles.input}
          onChange={onInput}
        />

        {!value ? (
          <div className={styles.empty}>
            <div className={styles.icon}>🖼️</div>
            <div className={styles.title}>Clique ou arraste a imagem aqui</div>
            <div className={styles.sub}>
              Recomendado: <b>1200 × 675</b> • Máx <b>{maxMB}MB</b> (JPG, PNG, WEBP, GIF)
            </div>
          </div>
        ) : (
          <div className={styles.preview}>
            <div className={styles.thumb}>
              <img src={previewUrl ?? ""} alt="Prévia" className={styles.img} />
            </div>

            <div className={styles.meta}>
              <div className={styles.name}>{value.name}</div>
              <div className={styles.details}>
                {(value.size / 1024 / 1024).toFixed(2)}MB • {value.type}
              </div>

              <div className={styles.actions}>
                <span className={styles.hint}>Clique no card para trocar</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setErr(null)
                    onChange(null)
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </label>

      {err && <div className={styles.error}>{err}</div>}
    </div>
  )
}