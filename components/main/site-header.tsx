"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { practiceAreas } from "@/lib/practice"

const links = [
  { label: "법인 소개", href: "/#about" },
  { label: "구성원", href: "/lawyers" },
]
const linksAfter = [
  { label: "업무분야", href: "/#practice" },
  { label: "오시는 길", href: "/#map" },
]

/** 메인 사이트 헤더: 상단 상담 띠 + 메뉴 + 센터 메가메뉴 */
export function SiteHeader() {
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

  const navLink = "text-[15px] text-jisan-ink/80 hover:text-jisan-ink transition-colors"

  return (
    <>
      <div className="bg-jisan-navy text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-20 py-2 text-[13px]">
          <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2">
            <span className="font-semibold">365일 24시간 상담</span>
            <span className="text-white/80">{siteConfig.phone}</span>
          </a>
          <a
            href={siteConfig.kakaoTalkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-white/80 hover:text-white"
          >
            카카오톡 상담
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div ref={megaRef} className="relative">
          <nav className="max-w-7xl mx-auto flex items-center gap-8 px-6 md:px-12 lg:px-20 py-4" aria-label="주 메뉴">
            <Link href="/" className="mr-auto leading-tight" onClick={() => setMobileOpen(false)}>
              <span className="block font-serif text-lg md:text-xl font-semibold text-jisan-ink tracking-tight">
                {siteConfig.name}
              </span>
              <span className="block text-[10px] tracking-[0.24em] text-muted-foreground">{siteConfig.nameEn}</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                className={`${navLink} inline-flex items-center gap-1 ${megaOpen ? "text-jisan-blue font-semibold" : ""}`}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
              >
                센터 <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              {linksAfter.map((l) => (
                <Link key={l.href} href={l.href} className={navLink}>
                  {l.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                className="rounded-md bg-jisan-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-jisan-blue/90"
              >
                상담 신청
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <a href={siteConfig.phoneHref} className="p-2 rounded-full bg-jisan-blue text-white" aria-label="전화 상담">
                <Phone className="h-4 w-4" />
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
            <div
              id="mega-menu"
              className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-border shadow-[0_12px_24px_rgba(20,30,60,0.08)]"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10 px-12 lg:px-20 py-8">
                <div>
                  <p className="text-xs tracking-[0.12em] text-muted-foreground mb-4">센터</p>
                  <ul className="space-y-4">
                    {centers.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${c.slug}`} className="group block" onClick={() => setMegaOpen(false)}>
                          <span className="block text-[15px] font-semibold text-jisan-ink group-hover:text-jisan-blue">
                            {c.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">{c.summary}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <p className="text-xs tracking-[0.12em] text-muted-foreground mb-4">업무분야</p>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-4">
                    {practiceAreas.map((p) => (
                      <li key={p.name}>
                        <Link href="/#practice" className="group block" onClick={() => setMegaOpen(false)}>
                          <span className="block text-[15px] font-semibold text-jisan-ink group-hover:text-jisan-blue">
                            {p.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">{p.tag}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-jisan-mist p-5 text-sm text-jisan-ink/70">
                  급한 상황이라면
                  <a href={siteConfig.phoneHref} className="block my-1 text-2xl font-bold text-jisan-ink">
                    {siteConfig.phone}
                  </a>
                  체포·구속, 출석 요구는 전화가 가장 빠릅니다.
                </div>
              </div>
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="flex flex-col px-6 py-6 gap-1">
              {[...links, ...linksAfter].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-base text-jisan-ink"
                >
                  {l.label}
                </Link>
              ))}
              <p className="mt-4 mb-1 text-xs tracking-[0.12em] text-muted-foreground">센터</p>
              {centers.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-base font-semibold text-jisan-ink"
                >
                  {c.name}
                </Link>
              ))}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={siteConfig.kakaoTalkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FEE500] text-[#191919] py-3 text-sm font-semibold"
                >
                  <MessageCircle className="h-4 w-4" />
                  카카오톡
                </a>
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-jisan-blue text-white py-3 text-sm font-semibold"
                >
                  상담 신청
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
