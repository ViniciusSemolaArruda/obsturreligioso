import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import HeaderOffset from "./_components/HeaderOffset/HeaderOffset"
import WhatsappConditional from "./_components/WhatsappConditional/WhatsappConditional"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
    template: "%s | Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
  },
  description:
    "Plataforma dedicada ao monitoramento, análise e fortalecimento do turismo religioso no Brasil e no mundo, conectando dados, destinos, instituições e mercados.",
  applicationName: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
  metadataBase: new URL("https://obsturreligioso.vercel.app/"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
    description:
      "Fortalecendo o turismo religioso como vetor de desenvolvimento cultural, social e econômico, no Brasil e no cenário internacional.",
    url: "https://obsturreligioso.vercel.app/",
    siteName: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Observatório Internacional do Turismo Religioso Laico no Brasil e na America Latina",
    description:
      "Monitoramento, inteligência e desenvolvimento do turismo religioso no Brasil e no mundo.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ ESSENCIAL para âncoras funcionarem no mobile */}
        <HeaderOffset />

        {children}

        <WhatsappConditional />
      </body>
    </html>
  );
}