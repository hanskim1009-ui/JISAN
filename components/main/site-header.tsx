"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { fields } from "@/lib/practice"
import { lawyers } from "@/lib/lawyers"

export type HeaderFlags = { showCases: boolean; showDiary: boolean; showMedia: boolean }

const lawyerName = (slug: string) => lawyers.find((l) => l.slug === slug)?.name ?? ""
const centerOf = (slug: string) => centers.find((c) => c.slug === slug)

/** 메인 사이트 헤더: 상단 연락 띠 + 메뉴 + '맡는 일' 펼침 메뉴 */
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
  const navLink = "text-[15px] text-[#4A505A] hover:text-jisan-ink transition-colors"
  const close = () => {
    setMobileOpen(false)
    setMegaOpen(false)
  }

  return (
    <>
      <div className="bg-jisan-stone border-b border-[#E4E6E9] text-[13px] text-[#4A505A] px-5 md:px-12 lg:px-14">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-2">
          <a href={siteConfig.phoneHref} className="text-jisan-ink">
            <b>24시간 상담 {siteConfig.phone}</b>
            <span className="hidden sm:inline text-[#4A505A]"> · 주말·공휴일 포함</span>
          </a>
          <span className="flex gap-4">
            <a href={siteConfig.kakaoTalkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-jisan-ink">
              카카오톡 상담
            </a>
            <Link href="/#map" className="hidden sm:inline hover:text-jisan-ink">
              오시는 길
            </Link>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E4E6E9]">
        <div ref={megaRef} className="relative px-5 md:px-12 lg:px-14">
          <nav className="max-w-7xl mx-auto flex items-center gap-7 py-4" aria-label="주 메뉴">
            <Link href="/" className="mr-auto flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-jisan-ink" onClick={close}>
              <LogoMark />
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
                className={`${navLink} inline-flex items-center gap-1 ${megaOpen ? "text-jisan-ink font-semibold" : ""}`}
                aria-expanded={megaOpen}
                aria-controls="field-menu"
                onClick={() => setMegaOpen((v) => !v)}
              >
                맡는 일 <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              {after.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <Link href="/#consult" className="bg-jisan-logo px-5 py-2.5 text-sm font-semibold text-white hover:bg-jisan-logo/90">
                상담 신청
              </Link>
            </div>

            <div className="flex items-center gap-1 xl:hidden">
              <a href={siteConfig.phoneHref} className="p-2 text-jisan-ink" aria-label="전화 상담">
                <Phone className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 text-jisan-ink"
                aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {megaOpen && (
            <div id="field-menu" className="hidden xl:block absolute left-0 right-0 top-full bg-white border-b border-[#E4E6E9] px-14 shadow-[0_12px_24px_rgba(20,25,31,0.06)]">
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 py-8">
                {fields.map((f) => (
                  <div key={f.name}>
                    <p className="border-b border-jisan-ink pb-2 text-base font-bold text-jisan-ink">{f.name}</p>
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
                          <Link key={slug} href={`/${slug}`} onClick={close} className="text-jisan-logo underline underline-offset-4">
                            {centerOf(slug)?.name}
                          </Link>
                        ))}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-[#8A9099]">맡는 변호사 {f.lawyers.map(lawyerName).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-[#E4E6E9] bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto">
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
              <Link href="/#consult" onClick={close} className="mt-5 bg-jisan-logo py-3 text-center text-sm font-semibold text-white">
                상담 신청
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

/** 실제 로고 (public/images/logo.png) */
export function LogoMark({ className = "h-6 w-auto" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/logo.png" alt="" aria-hidden className={className} />
}
