"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import { L, makeT, type Dict } from "@/lib/i18n/fmt"
import { LogoSvg } from "@/components/brand-logo"
import { LangSwitch } from "@/components/intl/intl-header"

export type CenterLink = { slug: string; name: string; href: string }
export type HeaderFlags = { showCases: boolean; showDiary: boolean; showColumns: boolean; lang?: Lang; dict?: Dict; centerLinks?: CenterLink[] }

/** 메인 사이트 헤더: 남색 바탕 + 흰 로고 + 메뉴 + '업무영역' 펼침 메뉴 (외국어 사이트도 같은 틀) */
export function SiteHeader({ showCases, showDiary, showColumns, lang = "ko", dict, centerLinks = [] }: HeaderFlags) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const t = makeT(dict)
  const ko = lang === "ko"

  const nameOf = (slug: string) => {
    const l = lawyers.find((x) => x.slug === slug)
    return l ? t(l.name) : ""
  }
  /** 센터 링크는 서버에서 이름·주소만 받음. 외국어 사이트는 그 언어로 옮긴 센터(외국인·형사·가사)만 */
  const centerOf = (slug: string) => centerLinks.find((c) => c.slug === slug)
  const fieldCenters = (slugs: string[]) =>
    slugs.flatMap((s) => centerOf(s) ?? []).filter((c, i, a) => a.findIndex((x) => x.href === c.href) === i)
  const foreigner = centerOf("foreigner")

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false)
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousedown", onClick)
    }
  }, [megaOpen])

  const before = [
    { label: t("법인 소개"), href: L(lang, "/about") },
    { label: t("구성원"), href: L(lang, "/lawyers") },
  ]
  const after = [
    ...(!ko && foreigner ? [{ label: foreigner.name, href: foreigner.href }] : []),
    ...(showCases ? [{ label: t("업무사례"), href: L(lang, "/cases") }] : []),
    ...(showColumns ? [{ label: t("칼럼"), href: L(lang, "/column") }] : []),
    ...(showDiary ? [{ label: t("감사일기"), href: L(lang, "/diary") }] : []),
    { label: t("오시는 길"), href: L(lang, "/#map") },
  ]
  const navLink = "text-[0.9375rem] text-white/75 hover:text-white transition-colors whitespace-nowrap"
  const close = () => {
    setMobileOpen(false)
    setMegaOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand text-white border-b border-white/10">
        <div ref={megaRef} className="relative px-5 md:px-12 lg:px-14">
          <nav className="max-w-7xl mx-auto flex items-center gap-7 py-4" aria-label={t("주 메뉴")}>
            <Link href={L(lang, "/")} className="mr-auto flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[1.0625rem] font-bold tracking-tight text-white" onClick={close}>
              <LogoSvg variant="reverse" className="h-6 w-auto" />
              {ko ? siteConfig.name : siteConfig.nameEn}
            </Link>

            <div className="hidden xl:flex items-center gap-7">
              {before.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                className={`${navLink} inline-flex items-center gap-1 ${megaOpen ? "text-white font-semibold" : ""}`}
                aria-expanded={megaOpen}
                aria-controls="field-menu"
                onClick={() => setMegaOpen((v) => !v)}
              >
                {t("업무영역")} <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              {after.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <LangSwitch current={lang} className="-mx-2" />
              <Link href={L(lang, "/consult")} className="whitespace-nowrap border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-brand transition-colors">
                {t("상담 신청")}
              </Link>
            </div>

            <div className="flex items-center gap-1 xl:hidden">
              {!ko && <LangSwitch current={lang} />}
              <a href={siteConfig.phoneHref} className="p-2 text-white" aria-label={t("전화 상담")}>
                <Phone className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 text-white"
                aria-label={mobileOpen ? t("메뉴 닫기") : t("메뉴 열기")}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {megaOpen && (
            <div id="field-menu" className="hidden xl:block absolute left-0 right-0 top-full bg-white text-jisan-ink border-b border-[#E4E6E9] px-14 shadow-[0_12px_24px_rgba(20,25,31,0.06)]">
              <div className="max-w-7xl mx-auto grid grid-cols-6 gap-6 py-8">
                {fields.map((f) => (
                  <div key={f.name}>
                    <p className="border-b border-jisan-ink pb-2 text-lg font-bold text-jisan-ink">{t(f.name)}</p>
                    <ul className="mt-2 text-sm text-[#4A505A]">
                      {f.items.map((it) => (
                        <li key={it} className="py-1">
                          {t(it)}
                        </li>
                      ))}
                    </ul>
                    {fieldCenters(f.centers).length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-x-3 text-sm font-semibold">
                        {fieldCenters(f.centers).map((c) => (
                          <Link key={c.href} href={c.href} onClick={close} className="text-brand-accent underline underline-offset-4">
                            {c.name}
                          </Link>
                        ))}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-[#8A9099]">
                      {t("담당 변호사")} {f.lawyers.map(nameOf).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 bg-white text-jisan-ink max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="flex flex-col px-5 py-4">
              {[...before, ...after].map((l) => (
                <Link key={l.href} href={l.href} onClick={close} className="border-b border-[#E4E6E9] py-3 text-base text-jisan-ink">
                  {l.label}
                </Link>
              ))}
              {(ko ? centerLinks.length > 0 : centerLinks.length > 1) && (
                <>
                  <p className="mt-5 text-sm font-bold text-jisan-ink">{t("센터")}</p>
                  {fieldCenters(centerLinks.map((c) => c.slug)).filter((c) => ko || c !== foreigner).map((c) => (
                    <Link key={c.href} href={c.href} onClick={close} className="border-b border-[#E4E6E9] py-3 text-base text-jisan-ink">
                      {c.name}
                    </Link>
                  ))}
                </>
              )}
              <Link href={L(lang, "/consult")} onClick={close} className="mt-5 bg-brand py-3 text-center text-sm font-semibold text-white">
                {t("상담 신청")}
              </Link>
              {ko && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-jisan-ink/60">
                  <LangSwitch current="ko" dark={false} align="left" />
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
