"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/site-config"
import { useActiveSection } from "@/hooks/use-active-section"

const navLinks = [
  { label: "소개", href: "#about" },
  { label: "구성원", href: "#team" },
  { label: "업무분야", href: "#practice" },
  { label: "성공 사례", href: "#cases" },
  { label: "감사인사", href: "#testimonials" },
  { label: "상담문의", href: "#contact" },
  { label: "오시는 길", href: "#map" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 translate-y-0 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-background/80"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.08em] text-foreground"
          >
            법률사무소 지산
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const sectionId = link.href.slice(1)
            const isActive = activeSection === sectionId
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm tracking-[0.08em] transition-colors duration-300 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.kakaoTalkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FEE500]/60 bg-[#FEE500] text-[#191919] px-3 py-2 text-xs font-medium tracking-[0.08em] hover:bg-[#FEE500]/90 transition-colors"
              aria-label="카카오톡 상담"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              카카오톡
            </a>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary text-primary-foreground px-4 py-2 text-xs font-medium tracking-[0.08em] hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              02-6951-4097
            </a>
            <div className="inline-flex items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground leading-tight text-center">
              주말/공휴일<br />24시간 상담
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={siteConfig.kakaoTalkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#FEE500] text-[#191919]"
            aria-label="카카오톡"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.phoneHref}
            className="p-2 rounded-full bg-primary text-primary-foreground"
            aria-label="전화 상담"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        } bg-background border-t border-border`}
      >
        <div className="flex flex-col px-6 py-6 gap-4">
          <Badge variant="outline" className="self-start mb-2 text-xs tracking-[0.08em]">
            주말/공휴일 24시간 상담가능
          </Badge>
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-normal tracking-tight text-foreground hover:text-muted-foreground transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-2">
            <a
              href={siteConfig.kakaoTalkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#FEE500]/60 bg-[#FEE500] text-[#191919] px-4 py-2 text-xs font-medium hover:bg-[#FEE500]/90 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              카카오톡 상담
            </a>
            <a
              href={siteConfig.phoneHref}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium tracking-[0.08em] hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" />
              전화 상담
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
