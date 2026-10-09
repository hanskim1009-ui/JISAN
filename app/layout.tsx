import React from "react"
import type { Metadata, Viewport } from "next"
import { siteConfig } from "@/lib/site-config"
import { lawyers } from "@/lib/lawyers"

import { LOOK_SWITCH, lookInitScript } from "@/lib/look"
import { LookSwitch } from "@/components/look/look-switch"
import { ScrollReveal } from "@/components/look/scroll-reveal"
import { Analytics } from "@/components/analytics"
import { skyInitScript } from "@/lib/sky"
import "./globals.css"

const siteUrl = siteConfig.siteUrl
const description =
  "형사·가사·기업·의료·부동산·민사 사건을 담당 변호사가 상담부터 재판까지 직접 맡습니다. 상담 전화 24시간, 주말·공휴일 포함."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | 형사·가사·기업·의료·부동산·민사 변호사`,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  keywords: ["형사변호사", "이혼변호사", "기업자문 변호사", "민사변호사", "법률사무소", siteConfig.name],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | 형사·가사·기업·의료·부동산·민사 변호사`,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  /** 검색엔진 소유 확인 (lib/site-config.ts 의 seo 값이 있을 때만) */
  verification: {
    ...(siteConfig.seo.google ? { google: siteConfig.seo.google } : {}),
    ...(siteConfig.seo.yandex ? { yandex: siteConfig.seo.yandex } : {}),
    other: {
      ...(siteConfig.seo.naver ? { "naver-site-verification": siteConfig.seo.naver } : {}),
      ...(siteConfig.seo.bing ? { "msvalidate.01": siteConfig.seo.bing } : {}),
      ...(siteConfig.seo.baidu ? { "baidu-site-verification": siteConfig.seo.baidu } : {}),
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#16213D",
}

function JsonLdScript() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.nameEn,
        url: siteUrl,
        image: `${siteUrl}/og.jpg`,
        telephone: siteConfig.phoneIntl,
        address: {
          "@type": "PostalAddress",
          streetAddress: "서초대로46길 109, 6층",
          addressLocality: "서초구",
          addressRegion: "서울특별시",
          addressCountry: "KR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.mapCoords.lat,
          longitude: siteConfig.mapCoords.lng,
        },
        areaServed: "KR",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
      ...lawyers.map((l) => ({
        "@type": "Attorney",
        name: l.name,
        jobTitle: l.title,
        url: `${siteUrl}/lawyers#${l.slug}`,
        worksFor: { "@id": `${siteUrl}/#organization` },
      })),
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        {LOOK_SWITCH && <script dangerouslySetInnerHTML={{ __html: lookInitScript }} />}
        {/* 첫 화면 하늘(밤낮·계절)을 그리기 전에 정함 */}
        <script dangerouslySetInnerHTML={{ __html: skyInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <JsonLdScript />
        {children}
        <ScrollReveal />
        {LOOK_SWITCH && <LookSwitch />}
        <Analytics />
      </body>
    </html>
  )
}
