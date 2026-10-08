"use client"

import { useState } from "react"
import { Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import type { CenterTone } from "@/lib/centers"
import { centerTones } from "@/components/center/tone"
import { centerText, type Lang } from "@/lib/center-i18n"

const LANG_LABEL: Record<Lang, string> = { ko: "한국어", en: "EN", zh: "中文" }

export type CenterNavItem = { label: string; href: string }

/**
 * 센터 전용 헤더: 로고는 "지산 ○○센터", 메뉴는 센터 안의 항목만.
 * 다른 분야 메뉴와 메인 사이트로 가는 큰 링크는 두지 않습니다.
 */
export function CenterHeader({
  name,
  tone,
  nav,
  homeHref,
  lang,
  alternates,
}: {
  name: string
  tone: CenterTone
  nav: CenterNavItem[]
  homeHref: string
  lang?: Lang
  /** 다른 언어판 주소가 있으면 언어 전환 단추 */
  alternates?: Partial<Record<Lang, string>>
}) {
  const [open, setOpen] = useState(false)
  const L = centerText(lang)
  const foreign = lang && lang !== "ko"
  const langLinks = alternates ? (Object.entries(alternates) as [Lang, string][]) : []
  const switcher = langLinks.length > 1 && (
    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold">
      {langLinks.map(([l, href]) => (
        <a key={l} href={href} lang={l} className={`whitespace-nowrap rounded px-1.5 py-1 ${l === (lang ?? "ko") ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}>
          {LANG_LABEL[l]}
        </a>
      ))}
    </span>
  )
  const t = centerTones[tone]

  return (
    <header className={`sticky top-0 z-50 border-b ${t.header}`}>
      <nav className="max-w-7xl mx-auto flex items-center gap-7 px-6 md:px-12 xl:px-14 py-4" aria-label={L.menu(name)}>
        <a href={homeHref} className="mr-auto leading-tight" onClick={() => setOpen(false)}>
          <span className="block whitespace-nowrap text-lg md:text-xl tracking-tight">
            {/* 외국어판 모바일은 아래 줄 JISAN LAW로 충분해 앞 글자를 숨김 (한 줄 유지) */}
            {foreign ? <span className="hidden sm:inline">JISAN </span> : `${siteConfig.shortName} `}
            <b className="font-extrabold">{name}</b>
          </span>
          <span className={`block text-[0.6562rem] ${t.logoSub}`}>{foreign ? siteConfig.nameEn : siteConfig.name}</span>
        </a>
        <div className="hidden xl:flex items-center gap-5">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={`whitespace-nowrap text-[0.9062rem] transition-colors ${t.headerLink}`}>
              {n.label}
            </a>
          ))}
          {switcher}
          <a href={siteConfig.phoneHref} className="hidden 2xl:inline whitespace-nowrap text-[0.9375rem] font-bold">
            {L.call24} {siteConfig.phone}
          </a>
          <a href="#consult" className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold ${t.headerCta}`}>
            {L.consult}
          </a>
        </div>
        <div className="flex items-center gap-1 xl:hidden">
          {switcher}
          <a href={siteConfig.phoneHref} className="p-2" aria-label={L.callAria}>
            <Phone className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2"
            aria-label={open ? L.menuClose : L.menuOpen}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className={`xl:hidden border-t ${t.divider} px-6 pb-6 pt-2 flex flex-col`}>
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-base">
              {n.label}
            </a>
          ))}
          <a
            href="#consult"
            onClick={() => setOpen(false)}
            className={`mt-3 py-3 text-center text-sm font-semibold ${t.headerCta}`}
          >
            {L.consult}
          </a>
        </div>
      )}
    </header>
  )
}
