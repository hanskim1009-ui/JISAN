import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

const footerLinks = [
  { label: "소개", href: "#about" },
  { label: "구성원", href: "#team" },
  { label: "업무분야", href: "#practice" },
  { label: "성공 사례", href: "#cases" },
  { label: "소식", href: "#news" },
  { label: "상담문의", href: "#contact" },
  { label: "오시는 길", href: "#map" },
]

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "면책공고", href: "/disclaimer" },
  { label: "이메일무단수집거부", href: "/email-refuse" },
]

export function Footer() {
  return (
    <footer className="px-6 py-12 md:px-12 lg:px-20 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-10 md:mb-14">
        <div className="md:col-span-5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.08em] text-foreground"
          >
            법률사무소 지산
          </Link>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-xs">
            {siteConfig.address}
            <br />
            전화 {siteConfig.phone}
            <br />
            주말/공휴일 24시간 상담가능
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-xs tracking-[0.08em] text-muted-foreground/80 mb-4">
            바로가기
          </p>
          <div className="flex flex-col gap-2.5">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-10">
          <p className="text-xs tracking-[0.08em] text-muted-foreground/80 mb-4">
            사무소 정보
          </p>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>사업자 등록 번호 : {siteConfig.businessRegistration}</p>
            <p>광고책임 변호사 : {siteConfig.advertisingAttorney}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-4 border-t border-border">
        {legalLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 border-t border-border gap-3">
        <p className="text-sm tracking-[0.06em] text-muted-foreground/80">
          © {new Date().getFullYear()} 법률사무소 지산. All rights reserved.
        </p>
        <p className="text-sm tracking-[0.06em] text-muted-foreground/80">
          Seoul · Seocho
        </p>
      </div>
      </div>
    </footer>
  )
}

