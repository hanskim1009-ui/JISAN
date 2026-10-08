import type { Metadata } from "next"
import { intlHome } from "@/lib/intl-home"
import { homeAlternates } from "@/lib/langs"
import { IntlHomePage } from "@/components/intl/intl-home-page"

const t = intlHome.ru

export const metadata: Metadata = {
  title: { absolute: t.seoTitle },
  description: t.seoDesc,
  alternates: { canonical: "/ru", languages: homeAlternates() },
  openGraph: { type: "website", locale: t.locale, url: "/ru", siteName: t.firm, title: t.seoTitle, description: t.seoDesc, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t.firm }] },
  twitter: { card: "summary_large_image", title: t.seoTitle, description: t.seoDesc },
}

export default function Page() {
  return <IntlHomePage lang="ru" t={t} />
}
