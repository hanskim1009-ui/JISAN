"use client"

import { useState } from "react"
import { Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import type { CenterTone } from "@/lib/centers"
import { centerTones } from "@/components/center/tone"
import { centerText, type Lang } from "@/lib/center-i18n"
import { LangMenu } from "@/components/lang-menu"


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
  const switcher = alternates && Object.keys(alternates).length > 1 && (
    <LangMenu current={lang ?? "ko"} hrefs={alternates} dark={tone === "dark"} />
  )
  const t = centerTones[tone]

  return (
    <header className={`sticky top-0 z-50 border-b ${t.header}`}>
      <nav className={`max-w-7xl ${foreign ? "2xl:max-w-screen-2xl" : ""} mx-auto flex items-center gap-3 md:gap-7 px-5 md:px-12 xl:px-14 py-4`} aria-label={L.menu(name)}>
        <a href={homeHref} className={`mr-auto min-w-0 leading-tight ${foreign ? "2xl:shrink-0" : "xl:shrink-0"}`} onClick={() => setOpen(false)}>
          {/* 센터 이름이 긴 언어(베트남어·러시아어·몽골어)는 좁은 화면에서 두 줄까지, 넓은 화면에서는 한 줄 */}
          <span className={`block tracking-tight ${foreign ? "text-[1rem] sm:text-lg md:text-xl 2xl:whitespace-nowrap" : "whitespace-nowrap text-lg md:text-xl"}`}>
            {/* 외국어판 모바일은 아래 줄 JISAN LAW로 충분해 앞 글자를 숨김 (한 줄 유지) */}
            {foreign ? null : `${siteConfig.shortName} `}
            <b className="font-extrabold">{name}</b>
          </span>
          <span className={`block text-[0.6562rem] ${t.logoSub}`}>{foreign ? siteConfig.nameEn : siteConfig.name}</span>
        </a>
        {/* 외국어판은 메뉴 글이 길어 더 넓은 화면(2xl)부터 가로 메뉴 */}
        <div className={`hidden items-center gap-5 ${foreign ? "2xl:flex" : "xl:flex"}`}>
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={`whitespace-nowrap text-[0.9062rem] transition-colors ${t.headerLink}`}>
              {n.label}
            </a>
          ))}
          {switcher}
          <a href={siteConfig.phoneHref} className={`hidden whitespace-nowrap text-[0.9375rem] font-bold ${foreign ? "" : "2xl:inline"}`}>
            {L.call24} {siteConfig.phone}
          </a>
          <a href="#consult" className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold ${t.headerCta}`}>
            {L.consult}
          </a>
        </div>
        <div className={`flex items-center gap-1 ${foreign ? "2xl:hidden" : "xl:hidden"}`}>
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
        <div className={`${foreign ? "2xl:hidden" : "xl:hidden"} border-t ${t.divider} px-6 pb-6 pt-2 flex flex-col`}>
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
