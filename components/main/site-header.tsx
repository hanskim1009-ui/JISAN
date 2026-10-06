"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"
import { LogoSvg } from "@/components/brand-logo"

export type HeaderFlags = { showCases: boolean; showDiary: boolean; showMedia: boolean }

const lawyerName = (slug: string) => lawyers.find((l) => l.slug === slug)?.name ?? ""
const centerOf = (slug: string) => centers.find((c) => c.slug === slug)

/** 메인 사이트 헤더: 남색 바탕 + 흰 로고 + 메뉴 + '업무영역' 펼침 메뉴 */
export function SiteHeader({ showCases, showDiary, showMedia }: HeaderFlags) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)

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
    { label: "법인 소개", href: "/about" },
    { label: "구성원", href: "/lawyers" },
  ]
  const after = [
    ...(showCases ? [{ label: "업무사례", href: "/cases" }] : []),
    ...(showDiary ? [{ label: "감사일기", href: "/diary" }] : []),
    ...(showMedia ? [{ label: "유튜브·블로그", href: "/#media" }] : []),
    { label: "오시는 길", href: "/#map" },
  ]
  const navLink = "text-[15px] text-white/75 hover:text-white transition-colors"
  const close = () => {
    setMobileOpen(false)
    setMegaOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand text-white border-b border-white/10">
        <div ref={megaRef} className="relative px-5 md:px-12 lg:px-14">
          <nav className="max-w-7xl mx-auto flex items-center gap-7 py-4" aria-label="주 메뉴">
            <Link href="/" className="mr-auto flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-white" onClick={close}>
              <LogoSvg variant="reverse" className="h-6 w-auto" />
              {siteConfig.name}
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
                업무영역 <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              {after.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <Link href="/consult" className="border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-brand transition-colors">
                상담 신청
              </Link>
            </div>

            <div className="flex items-center gap-1 xl:hidden">
              <a href={siteConfig.phoneHref} className="p-2 text-white" aria-label="전화 상담">
                <Phone className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 text-white"
                aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {megaOpen && (
            <div id="field-menu" className="hidden xl:block absolute left-0 right-0 top-full bg-white text-jisan-ink border-b border-[#E4E6E9] px-14 shadow-[0_12px_24px_rgba(20,25,31,0.06)]">
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 py-8">
                {fields.map((f) => (
                  <div key={f.name}>
                    <p className="border-b border-jisan-ink pb-2 font-display text-lg font-medium text-jisan-ink">{f.name}</p>
                    <ul className="mt-2 text-sm text-[#4A505A]">
                      {f.items.map((it) => (
                        <li key={it} className="py-1">
                          {it}
                        </li>
                      ))}
                    </ul>
                    {f.centers.length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-x-3 text-sm font-semibold">
                        {f.centers.map((slug) => (
                          <Link key={slug} href={`/${slug}`} onClick={close} className="text-brand-accent underline underline-offset-4">
                            {centerOf(slug)?.name}
                          </Link>
                        ))}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-[#8A9099]">담당 변호사 {f.lawyers.map(lawyerName).join(" · ")}</p>
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
              <p className="mt-5 text-sm font-bold text-jisan-ink">센터</p>
              {centers.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} onClick={close} className="border-b border-[#E4E6E9] py-3 text-base text-jisan-ink">
                  {c.name}
                </Link>
              ))}
              <Link href="/consult" onClick={close} className="mt-5 bg-brand py-3 text-center text-sm font-semibold text-white">
                상담 신청
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
