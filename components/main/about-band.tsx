import Link from "next/link"
import { lawyers } from "@/lib/lawyers"
import { LogoSvg } from "@/components/brand-logo"

/** 법인 소개 띠: 이름의 뜻 + 구성원이 일해 온 곳 */
export function AboutBand() {
  return (
    <section className="relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14 py-16 md:py-24">
      <LogoSvg variant="tone" className="pointer-events-none absolute -left-16 top-1/2 h-[30rem] w-auto -translate-y-1/2 text-brand-tone opacity-70" />
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <h2 className="font-display text-[2rem] font-light leading-[1.3] tracking-[-0.03em] md:text-[2.75rem]">
          지산은
          <br />
          ‘지혜의 산’이라는
          <br />
          뜻입니다.
        </h2>
        <div className="max-w-xl space-y-4 text-[16px] leading-[1.85] text-white/80">
          <p>
            서울 서초동에서 변호사 {lawyers.length}명이 형사, 가사, 기업, 민사 사건을 맡습니다.
          </p>
          <p>
            변호사들이 일해 온 곳은 서로 다릅니다. 검찰청에서 수사와 공판을 맡았던 변호사, 금융회사와 벤처캐피탈에서 준법감시와
            투자 업무를 한 변호사, 로펌 파트너로 기업 자문을 해 온 변호사, 의료기관 자문을 맡아 온 변호사가 있습니다.
          </p>
          <Link href="/about" className="inline-block border-b border-white/60 pb-0.5 font-semibold text-white hover:border-white">
            법인 소개 →
          </Link>
        </div>
      </div>
    </section>
  )
}
