import Link from "next/link"
import { lawyers } from "@/lib/lawyers"
import { openOffices, siteConfig } from "@/lib/site-config"
import { LogoSvg } from "@/components/brand-logo"

/** 법인 소개 띠: 인사말 짧게 + 사실만 적은 개요표 */
export function AboutBand() {
  const rows = [
    ["사무소", openOffices.map((o) => o.name).join(" · ")],
    ["구성원", `변호사 ${lawyers.length}명`],
    ["업무", "형사 · 가사 · 기업 · 민사"],
    ["상담", `${siteConfig.phone} · 24시간, 주말·공휴일 포함`],
    ["이름", "‘지혜의 산’이라는 뜻"],
  ]
  return (
    <section className="relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14 py-16 md:py-24">
      <LogoSvg variant="tone" className="pointer-events-none absolute -left-16 top-1/2 h-[30rem] w-auto -translate-y-1/2 text-brand-tone opacity-70" />
      <div data-reveal className="relative max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-white/60">법인 소개</p>
          <h2 className="mt-3 text-[2rem] font-bold leading-[1.3] tracking-[-0.035em] md:text-[2.5rem]">
            의뢰인에게는
            <br />
            한 번뿐인 사건입니다
          </h2>
          <div className="mt-6 space-y-3 text-[16px] leading-[1.85] text-white/80">
            <p>변호사에게는 매주 만나는 일이어도, 의뢰인에게는 대부분 처음이자 한 번뿐인 일입니다.</p>
            <p>
              그래서 저희는 지금 당장 선임을 결정하라고 하지 않습니다. 할 수 있는 일과 어려운 일부터 말씀드리고, 사건을 맡은 뒤에는
              담당 변호사가 직접 연락을 주고받습니다.
            </p>
          </div>
          <p className="mt-5 text-sm text-white/60">{siteConfig.name} 변호사 일동</p>
          <Link href="/about" className="mt-6 inline-block border-b border-white/60 pb-0.5 font-semibold text-white hover:border-white">
            법인 소개 더보기 →
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
