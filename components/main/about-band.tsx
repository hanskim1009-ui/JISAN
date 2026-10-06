import Link from "next/link"
import { lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { LogoSvg } from "@/components/brand-logo"

/** 법인 소개 띠: 법인 이름 + 사실만 적은 개요표 */
export function AboutBand() {
  const rows = [
    ["위치", siteConfig.address],
    ["구성원", `변호사 ${lawyers.length}명`],
    ["업무", "형사 · 가사 · 기업 · 민사"],
    ["상담", `${siteConfig.phone} · 24시간, 주말·공휴일 포함`],
    ["이름", "‘지혜의 산’이라는 뜻"],
  ]
  return (
    <section className="relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14 py-16 md:py-24">
      <LogoSvg variant="tone" className="pointer-events-none absolute -left-16 top-1/2 h-[30rem] w-auto -translate-y-1/2 text-brand-tone opacity-70" />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div>
          <h2 className="text-[2rem] font-bold leading-[1.3] tracking-[-0.035em] md:text-[2.75rem]">{siteConfig.name}</h2>
          <Link href="/about" className="mt-6 inline-block border-b border-white/60 pb-0.5 font-semibold text-white hover:border-white">
            법인 소개 →
          </Link>
        </div>
        <dl className="border-t border-white/25 text-[15px]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-white/15 py-3.5">
              <dt className="text-white/55">{k}</dt>
              <dd className="text-white/90">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
