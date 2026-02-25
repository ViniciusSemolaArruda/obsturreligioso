/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect } from "react"

export default function HeaderOffset() {
  useEffect(() => {
    const root = document.documentElement

    const applyOffset = () => {
      const header = document.getElementById("site-header")

      if (!header) {
        // fallback se header ainda não montou
        root.style.setProperty("--scroll-offset", "120px")
        return
      }

      // altura REAL do header (desktop + mobile + menu)
      const rect = header.getBoundingClientRect()
      const realHeight = rect.height

      /**
       * 🔧 AJUSTE FINO GLOBAL:
       * - negativo = sobe mais (recomendado)
       * - positivo = desce mais
       */
      const tweak = -8

      const finalOffset = Math.max(0, Math.round(realHeight + tweak))

      root.style.setProperty("--scroll-offset", `${finalOffset}px`)
    }

    // roda ao carregar
    applyOffset()

    // roda quando a tela muda (mobile, rotate, etc)
    window.addEventListener("resize", applyOffset)
    window.addEventListener("orientationchange", applyOffset)

    // observa mudanças reais do header (ex: menu mobile abre)
    const header = document.getElementById("site-header")
    let resizeObserver: ResizeObserver | null = null

    if (header && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        applyOffset()
      })
      resizeObserver.observe(header)
    }

    // quando fontes carregam (muda altura do header)
    if ("fonts" in document) {
      
      document.fonts.ready.then(() => applyOffset()).catch(() => {})
    }

    return () => {
      window.removeEventListener("resize", applyOffset)
      window.removeEventListener("orientationchange", applyOffset)
      resizeObserver?.disconnect()
    }
  }, [])

  return null
}