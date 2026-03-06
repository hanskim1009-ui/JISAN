import React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"

const siteUrl = "https://www.jisanlaw.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "법률사무소 지산 | Jisan Law | 형사·민사·기업 변호",
    template: "%s | 법률사무소 지산",
  },
  description:
    "형사 사건을 핵심으로 기업, 민사, 건설·부동산, 회생·파산 전반에 걸친 법률 서비스를 제공합니다. 검사 출신 변호사가 주말·공휴일 24시간 상담합니다. 서울 서초구.",
  keywords: [
    "형사 변호사",
    "서초 변호사",
    "법률사무소 지산",
    "형사 사건",
    "기업 변호",
    "민사 소송",
  ],
  authors: [{ name: "법률사무소 지산" }],
  creator: "법률사무소 지산",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "법률사무소 지산",
    title: "법률사무소 지산 | 형사·민사·기업 종합 법률 서비스",
    description:
      "당신의 일상이 다시 평온해지도록, 법률 그 이상의 마음으로 함께합니다. 형사 사건을 핵심으로 24시간 상담.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "법률사무소 지산",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "법률사무소 지산 | Jisan Law",
    description: "형사·민사·기업 종합 법률 서비스. 검사 출신 변호사 24시간 상담.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#1e2a4a",
}

function JsonLdScript() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${siteUrl}/#organization`,
        name: "법률사무소 지산",
        alternateName: "Jisan Law",
        url: siteUrl,
        telephone: "+82-2-6951-4907",
        address: {
          "@type": "PostalAddress",
          streetAddress: "서초대로46길 109, 6층",
          addressLocality: "서울시 서초구",
          addressCountry: "KR",
        },
        areaServed: "KR",
        priceRange: "$$",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "Attorney",
        name: "김한솔",
        jobTitle: "검사출신 대표 변호사",
        worksFor: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Attorney",
        name: "구본우",
        jobTitle: "대표 변호사",
        worksFor: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Attorney",
        name: "박종진",
        jobTitle: "파트너 변호사",
        worksFor: { "@id": `${siteUrl}/#organization` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <JsonLdScript />
        {children}
      </body>
    </html>
  )
}
