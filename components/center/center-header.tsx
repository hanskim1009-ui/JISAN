"use client"

import { useState } from "react"
import { Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import type { CenterTone } from "@/lib/centers"
import { centerTones } from "@/components/center/tone"

export type CenterNavItem = { label: string; href: string }

/**
 * 센터 전용 헤더: 로고는 "지산 ○○센터", 메뉴는 센터 안의 항목만.
 * 다른 분야 메뉴와 메인 사이트로 가는 큰 링크는 두지 않습니다.
 */
export function CenterHeader({ name, tone, nav }: { name: string; tone: CenterTone; nav: CenterNavItem[] }) {
  const [open, setOpen] = useState(false)
  const t = centerTones[tone]

  return (
    <header className={`sticky top-0 z-50 border-b ${t.header}`}>
      <nav className="max-w-7xl mx-auto flex items-center gap-7 px-6 md:px-12 xl:px-14 py-4" aria-label={`${name} 메뉴`}>
        <a href="#top" className="mr-auto leading-tight" onClick={() => setOpen(false)}>
          <span className="block text-lg md:text-xl tracking-tight">
            {siteConfig.shortName} <b className="font-extrabold">{name}</b>
          </span>
          <span className={`block text-[10.5px] ${t.logoSub}`}>{siteConfig.name}</span>
        </a>
        <div className="hidden xl:flex items-center gap-5">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={`whitespace-nowrap text-[14.5px] transition-colors ${t.headerLink}`}>
              {n.label}
            </a>
          ))}
          <a href={siteConfig.phoneHref} className="hidden 2xl:inline whitespace-nowrap text-[15px] font-bold">
            24시간 {siteConfig.phone}
          </a>
          <a href="#consult" className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold ${t.headerCta}`}>
            상담 신청
          </a>
        </div>
        <div className="flex items-center gap-1 xl:hidden">
          <a href={siteConfig.phoneHref} className="p-2" aria-label="전화 상담">
            <Phone className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
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
            상담 신청
          </a>
        </div>
      )}
    </header>
  )
}
