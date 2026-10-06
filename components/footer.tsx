import Link from "next/link"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { LogoSvg } from "@/components/brand-logo"

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "면책공고", href: "/disclaimer" },
  { label: "이메일무단수집거부", href: "/email-refuse" },
]

/** 맨 아래: 깊은 남색 바탕 + 큰 로고와 이름 + 주소·전화·사업자 정보 */
export function Footer() {
  return (
    <footer className="bg-brand-deep text-white/70 px-5 md:px-12 lg:px-14 pt-14 pb-10 md:pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-4 text-white">
              <LogoSvg variant="reverse" className="h-11 w-auto md:h-14" />
              <span className="text-2xl md:text-[2rem] font-bold tracking-[-0.03em]">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm text-white/55">지산은 ‘지혜의 산’이라는 뜻입니다.</p>
          </div>
          <a href={siteConfig.phoneHref} className="md:text-right">
            <span className="block text-[1.75rem] font-bold tabular-nums tracking-tight text-white">{siteConfig.phone}</span>
            <span className="text-[13px] text-white/60">24시간 · 주말·공휴일 포함</span>
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-1.5 border-t border-white/15 pt-6 text-sm md:grid-cols-2">
          <div className="space-y-1">
            {openOffices.map((o) => (
              <p key={o.name}>
                <span className="text-white/90">{o.name}</span> {officeAddress(o)}
              </p>
            ))}
          </div>
          <p className="md:text-right">
            사업자등록번호 {siteConfig.businessRegistration} · 광고책임변호사 {siteConfig.advertisingAttorney}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-[13px] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {siteConfig.feeds.firmYoutubeChannelId && (
              <a href={`https://www.youtube.com/channel/${siteConfig.feeds.firmYoutubeChannelId}`} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                유튜브
              </a>
            )}
            {siteConfig.feeds.firmBlogId && (
              <a href={`https://blog.naver.com/${siteConfig.feeds.firmBlogId}`} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                네이버 블로그
              </a>
            )}
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-white/45">Copyright {new Date().getFullYear()}. {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  )
}
