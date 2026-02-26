"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function HashScroller() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return

    const hash = window.location.hash
    if (!hash) return

    const id = decodeURIComponent(hash.replace("#", ""))
    const el = document.getElementById(id)
    if (!el) return

    // espera o layout estabilizar (fonts/header)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const root = document.documentElement
        const raw = getComputedStyle(root).getPropertyValue("--scroll-offset").trim()
        const offset = Number(raw.replace("px", "")) || 0

        const y = el.getBoundingClientRect().top + window.scrollY - offset - 8
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
      })
    })
  }, [pathname])

  return null
}