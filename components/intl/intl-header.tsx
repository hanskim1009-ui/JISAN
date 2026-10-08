"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { LogoSvg } from "@/components/brand-logo"
import type { IntlHome, IntlLang } from "@/lib/intl-home"
import type { Lang } from "@/lib/langs"
import { LangMenu } from "@/components/lang-menu"

/** 언어 바꾸기 (지구본 펼침 목록, 여섯 언어) */
export function LangSwitch({ current, dark = true, className = "", align = "right" }: { current: Lang; dark?: boolean; className?: string; align?: "left" | "right" }) {
  return <LangMenu current={current} dark={dark} className={className} align={align} />
}

/** 외국어 메인 헤더: 한 페이지 안의 칸으로 이동 + 외국인센터 + 언어 바꾸기 */
export function IntlHeader({ lang, t }: { lang: IntlLang; t: IntlHome }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: t.nav.foreigner, href: `/${lang}/foreigner` },
    { label: t.nav.lawyers, href: "#lawyers" },
    { label: t.nav.practice, href: "#practice" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.offices, href: "#offices" },
  ]
  const navLink = "text-[0.9375rem] text-white/75 hover:text-white transition-colors"
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand text-white">
      <div className="px-5 md:px-12 lg:px-14">
        <nav className="mx-auto flex max-w-7xl items-center gap-6 py-4" aria-label="Main">
          <Link href={`/${lang}`} className="mr-auto flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[1.0625rem] font-bold tracking-tight text-white" onClick={close}>
            <LogoSvg variant="reverse" className="h-6 w-auto" />
            {t.firm}
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={navLink}>
                {l.label}
              </Link>
            ))}
            <LangSwitch current={lang} />
            <Link href="#contact" className="border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand">
              {t.consult}
            </Link>
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <LangSwitch current={lang} />
            <a href={siteConfig.phoneHref} className="p-1.5 text-white" aria-label={t.offices.phone}>
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-2 text-white"
              aria-label={open ? t.menuClose : t.menuOpen}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-white text-jisan-ink xl:hidden">
          <div className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="border-b border-[#E4E6E9] py-3 text-base text-jisan-ink">
                {l.label}
              </Link>
            ))}
            <Link href="#contact" onClick={close} className="mt-5 bg-brand py-3 text-center text-sm font-semibold text-white">
              {t.consult}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
