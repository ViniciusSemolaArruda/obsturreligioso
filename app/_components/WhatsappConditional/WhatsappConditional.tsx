"use client"

import { usePathname } from "next/navigation"
import WhatsappFloat from "../WhatsappFloat/WhatsappFloat"

export default function WhatsappConditional() {
  const pathname = usePathname()

  // ❌ Esconder no login e em TODA área admin
  if (
    pathname === "/login" ||
    pathname.startsWith("/admin")
  ) {
    return null
  }

  return <WhatsappFloat />
}