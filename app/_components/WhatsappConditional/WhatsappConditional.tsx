"use client"

import { usePathname } from "next/navigation"
import WhatsappFloat from "../WhatsappFloat/WhatsappFloat"

export default function WhatsappConditional() {
  const pathname = usePathname()

  // ❌ NÃO mostrar no login (nem em rotas admin futuramente)
  if (pathname === "/login") return null

  return <WhatsappFloat />
}