"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { LogoSvg } from "@/components/brand-logo"

export type RegionNavItem = { label: string; href: string }

/**
 * 지역 홈페이지 머리글: 로고 + 상호 + 지역 이름, 메뉴는 소개·분야·변호사·상담.
 * 메인 사이트 메뉴 대신 이 지역 안에서만 움직입니다.
 */
export function RegionHeader({ name, homeHref, nav, consultHref }: { name: string; homeHref: string; nav: RegionNavItem[]; consultHref: string }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-jisan-navy text-white">
      <nav className="max-w-7xl mx-auto flex items-center gap-3 px-4 py-3.5 sm:px-5 md:gap-7 md:px-12 xl:px-14" aria-label={`${siteConfig.shortName} ${name} 메뉴`}>
        <Link href={homeHref} onClick={close} className="mr-auto flex min-w-0 items-center gap-2.5">
          <LogoSvg variant="reverse" className="h-8 w-auto shrink-0" />
          {/* 상호가 길어지면(법인 전환) 좁은 화면에서 상호만 줄임표 */}
          <span className="flex min-w-0 items-baseline gap-2 whitespace-nowrap leading-tight">
            <span className="min-w-0 truncate text-[0.9375rem] font-semibold tracking-tight text-white/85 md:text-base">{siteConfig.name}</span>
            <b className="shrink-0 text-lg font-extrabold tracking-tight md:text-xl">{name}</b>
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap text-[0.9375rem] text-white/75 transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
          <a href={siteConfig.phoneHref} className="hidden whitespace-nowrap text-[0.9375rem] font-bold tabular-nums xl:inline">
            {siteConfig.phone}
          </a>
          <Link href={consultHref} className="whitespace-nowrap bg-white px-5 py-2.5 text-sm font-semibold text-jisan-navy hover:bg-white/90">
            상담 신청
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <a href={siteConfig.phoneHref} className="p-2" aria-label="전화 상담">
            <Phone className="h-5 w-5" />
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="p-2" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="flex flex-col border-t border-white/10 px-6 pb-6 pt-2 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={close} className="py-3 text-base">
              {n.label}
            </Link>
          ))}
          <a href={siteConfig.phoneHref} className="py-3 text-base font-semibold tabular-nums">
            전화 {siteConfig.phone}
          </a>
          <Link href={consultHref} onClick={close} className="mt-3 bg-white py-3 text-center text-sm font-semibold text-jisan-navy">
            상담 신청
          </Link>
        </div>
      )}
    </header>
  )
}
