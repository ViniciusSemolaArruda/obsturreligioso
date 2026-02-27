// app/_components/ScrollOffsetSetter.tsx
"use client"

import { useEffect } from "react"

export default function ScrollOffsetSetter() {
  useEffect(() => {
    const root = document.documentElement
    let maxH = 0
    let raf = 0

    const apply = () => {
      const header = document.getElementById("site-header")
      if (!header) return

      const h = Math.round(header.getBoundingClientRect().height)

      // ✅ pega sempre o MAIOR header (estado mais alto)
      if (h > maxH) maxH = h

      // ajuste fino: deixe 12~18 se quiser “um respiro”
      const extra = 14
      root.style.setProperty("--scroll-offset", `${maxH + extra}px`)
    }

    const tick = () => {
      apply()
      raf = requestAnimationFrame(tick)
    }

    // mede várias vezes no começo (pega fontes, layout, etc)
    let warmup = 0
    const warm = () => {
      apply()
      warmup += 1
      if (warmup < 20) requestAnimationFrame(warm)
    }
    warm()

    // acompanha resize e mudanças no header
    window.addEventListener("resize", apply)
    window.addEventListener("scroll", apply, { passive: true })

    const header = document.getElementById("site-header")
    let ro: ResizeObserver | null = null
    if (header && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => apply())
      ro.observe(header)
    }

    // ✅ opcional: se seu header muda com classes/estados via JS, isso “pega tudo”
    // (custa muito pouco e evita dor de cabeça)
    raf = requestAnimationFrame(tick)
    // se não quiser rodar sempre, me fala que eu te mando uma versão “leve” sem loop.

    return () => {
      window.removeEventListener("resize", apply)
      window.removeEventListener("scroll", apply)
      if (ro) ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return null
}