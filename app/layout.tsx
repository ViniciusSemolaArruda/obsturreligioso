import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderOffset from "./_components/HeaderOffset/HeaderOffset";
import WhatsappFloat from "./_components/WhatsappFloat/WhatsappFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Instituto EU ACREDITO",
    template: "%s | Instituto EU ACREDITO",
  },
  description:
    "Instituição sem fins lucrativos dedicada à transformação social, promovendo dignidade, oportunidades e impacto real em diferentes segmentos da sociedade.",
  applicationName: "Instituto EU ACREDITO",
  metadataBase: new URL("https://capadociaproducoes.vercel.app/"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Instituto EU ACREDITO",
    description:
      "Acreditamos que a transformação social nasce da ação consciente e do investimento no potencial humano. Projetos com transparência, ética e impacto real.",
    url: "https://capadociaproducoes.vercel.app/",
    siteName: "Instituto EU ACREDITO",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instituto EU ACREDITO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instituto EU ACREDITO",
    description:
      "Instituição sem fins lucrativos dedicada à transformação social com ética, transparência e impacto real.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Ajusta automaticamente o scroll-padding-top com base na altura do header */}
        <HeaderOffset />

        {children}

        {/* Botão flutuante do WhatsApp (fixo na tela) */}
        <WhatsappFloat />
      </body>
    </html>
  );
}
