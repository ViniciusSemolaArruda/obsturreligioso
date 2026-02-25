//app\noticias\data.ts
export type NewsPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  cover: string
  dateISO: string
  author: string
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "quote"; text: string; cite?: string }
    | { type: "list"; items: string[] }
  >
}

export const NEWS: NewsPost[] = [
  {
    slug: "patrimonio-fe-turismo-america-latina",
    title: "Patrimônio, fé e turismo: destinos em alta na América Latina",
    excerpt:
      "Uma leitura estratégica sobre destinos religiosos e como eles estão movimentando o turismo e a economia local.",
    category: "América Latina",
    readTime: "7 min de leitura",
    cover: "/event5.png",
    dateISO: "2026-02-24",
    author: "Redação Observatório",
    content: [
      {
        type: "p",
        text: "O turismo religioso tem crescido em diferentes regiões da América Latina, impulsionado por rotas tradicionais, festivais e experiências imersivas que conectam fé, cultura e economia.",
      },
      {
        type: "h2",
        text: "O que está impulsionando a alta",
      },
      {
        type: "list",
        items: [
          "Melhoria de infraestrutura e acessibilidade",
          "Calendários oficiais com festivais e celebrações",
          "Experiências guiadas e roteiros temáticos",
          "Integração entre patrimônio material e imaterial",
        ],
      },
      {
        type: "quote",
        text: "Quando o destino organiza dados, calendário e oferta turística, a fé vira também planejamento e desenvolvimento regional.",
        cite: "Equipe de Análise",
      },
      {
        type: "p",
        text: "Além do fluxo de visitantes, o impacto econômico se manifesta em hotelaria, gastronomia, mobilidade, artesanato e serviços locais.",
      },
    ],
  },
  {
    slug: "sincretismo-identidade-cultural-nordeste",
    title: "Sincretismo e Identidade Cultural no Nordeste Brasileiro",
    excerpt:
      "Como tradições e expressões culturais moldam rotas de turismo religioso e experiências de peregrinação.",
    category: "Brasil",
    readTime: "8 min de leitura",
    cover: "/event1.png",
    dateISO: "2026-02-22",
    author: "Redação Observatório",
    content: [
      { type: "p", text: "O sincretismo é parte estruturante de identidades culturais no Brasil, com reflexos em festas, ritos e patrimônios vivos." },
      { type: "h2", text: "Território, memória e turismo" },
      { type: "p", text: "Quando o turismo respeita o contexto local, ele fortalece comunidades e promove educação patrimonial." },
    ],
  },
]

export function getPostBySlug(slug: string) {
  return NEWS.find((p) => p.slug === slug) ?? null
}

export function getTrending(limit = 5) {
  return NEWS.slice(0, limit)
}