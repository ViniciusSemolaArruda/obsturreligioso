//app\_components\Tradition\TraditionCard\TraditionFilterCards.tsx
"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import styles from "./TraditionFilterCards.module.css"

export type Tradition =
  | "Catolicismo"
  | "Cristianismo"
  | "Islamismo"
  | "Judaísmo"
  | "Hinduísmo"
  | "Budismo"
  | "Espiritismo"
  | "Matriz Africana"
  | "Povos Originários"
  | "Quilambolas"
  | "Ciganos"

type Item = {
  key: Tradition | "Todos"
  label: string
  icon: string // caminho dentro do /public
}

const ITEMS: Item[] = [
  { key: "Todos", label: "Todos", icon: "/icons/menu-aberto.png" },
  { key: "Catolicismo", label: "Catolicismo", icon: "/icons/cruz.png" },
  {
    key: "Cristianismo",
    label: "Cristianismo",
    icon: "/icons/cristianismo.png",
  },
  { key: "Islamismo", label: "Islamismo", icon: "/icons/islamismo.png" }, // ✅ seu arquivo
  { key: "Judaísmo", label: "Judaísmo", icon: "/icons/judaismo.png" },
  { key: "Hinduísmo", label: "Hinduísmo", icon: "/icons/hinduismo.png" },
  { key: "Budismo", label: "Budismo", icon: "/icons/buda.png" },
  { key: "Espiritismo", label: "Espiritismo", icon: "/icons/meditacao.png" },
  {
    key: "Matriz Africana",
    label: "Matriz Africana",
    icon: "/icons/mulher-africana.png",
  },
    {
    key: "Povos Originários",
    label: "Povos Originários",
    icon: "/icons/escudo.png",
  },
  {
    key: "Quilambolas",
    label: "Quilambolas",
    icon: "/icons/african-drum.png",
  },
  {
    key: "Ciganos",
    label: "Ciganos",
    icon: "/icons/cigano.png",
  },
  
]

export default function TraditionFilterCards({
  value,
  onChange,
}: {
  value: Tradition | "Todos"
  onChange: (v: Tradition | "Todos") => void
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canRight, setCanRight] = useState(false)
  const [canLeft, setCanLeft] = useState(false)

  const updateArrows = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => updateArrows()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateArrows)

    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateArrows)
    }
  }, [])

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(260, Math.floor(el.clientWidth * 0.6))
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  const cards = useMemo(() => ITEMS, [])

  return (
    <div className={styles.wrap} aria-label="Filtro por tradição">
      {/* fade esquerda */}
      <div
        className={[
          styles.fade,
          styles.fadeLeft,
          canLeft ? styles.fadeOn : "",
        ].join(" ")}
        aria-hidden="true"
      />

      <div className={styles.scroller} ref={scrollerRef}>
        {cards.map(({ key, label, icon }) => {
          const active = value === key
          return (
            <button
              key={key}
              type="button"
              className={[styles.card, active ? styles.active : ""].join(" ")}
              onClick={() => onChange(key)}
              aria-pressed={active}
              title={label}
            >
              <span className={styles.iconWrap}>
                <Image
                  src={icon}
                  alt={label}
                  width={24}
                  height={24}
                  className={styles.icon}
                  priority={key === "Todos" || key === "Islamismo"}
                />
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* fade direita */}
      <div
        className={[
          styles.fade,
          styles.fadeRight,
          canRight ? styles.fadeOn : "",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* botão > */}
      <button
        type="button"
        className={styles.nextBtn}
        onClick={() => scrollByCards("right")}
        aria-label="Ver mais tradições"
        disabled={!canRight}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}