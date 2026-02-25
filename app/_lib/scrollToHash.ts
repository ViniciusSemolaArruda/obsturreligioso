"use client"

export function scrollToHash(hash: string, liftPx = 10) {
  const id = hash.replace("#", "")
  if (!id) return

  // ✅ #inicio sempre topo real
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }

  const el = document.getElementById(id)
  if (!el) return

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--scroll-offset")
    .trim()

  const offset = (Number.parseFloat(raw) || 0) - liftPx

  const y = window.scrollY + el.getBoundingClientRect().top - offset
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
}