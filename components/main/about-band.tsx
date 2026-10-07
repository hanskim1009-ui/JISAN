import Link from "next/link"
import { Nanum_Pen_Script } from "next/font/google"
import { siteConfig } from "@/lib/site-config"
import { InkMountains } from "@/components/main/ink-mountains"

/** 변호사 일동이 쓴 인사말을 손글씨처럼 */
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false })

/** 법인 소개 띠: 변호사 일동의 짧은 인사말 + 수묵 산 */
export function AboutBand() {
  return (
    <section className="screen relative overflow-hidden bg-brand text-white px-5 md:px-12 lg:px-14 pt-16 pb-56 md:py-24">
      {/* 수묵 겹산: 넓은 화면은 오른쪽 전체, 좁은 화면은 글 아래쪽에 */}
      <InkMountains idPrefix="ink-m" crop="560 250 880 650" moon={false} className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full md:hidden" />
      <InkMountains idPrefix="ink-d" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" />
      <div data-reveal className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-white/60">법인 소개</p>
          <h2 className="mt-3 text-[2rem] font-bold leading-[1.3] tracking-[-0.035em] md:text-[2.5rem]">
            의뢰인에게는
            <br />
            한 번뿐인 사건입니다
          </h2>
          <div className={`${pen.className} mt-7 space-y-3 text-[1.5rem] leading-[1.55] text-white/90 md:text-[1.75rem]`}>
            <p>변호사에게는 매주 만나는 일이어도, 의뢰인에게는 대부분 처음이자 한 번뿐인 일입니다.</p>
            <p>
              그래서 저희는 지금 당장 선임을 결정하라고 하지 않습니다. 할 수 있는 일과 어려운 일부터 말씀드리고, 사건을 맡은 뒤에는
              담당 변호사가 직접 연락을 주고받습니다.
            </p>
          </div>
          <p className={`${pen.className} mt-5 text-right text-[1.5rem] text-white/75 md:text-[1.75rem]`}>{siteConfig.name} 변호사 일동</p>
          <Link href="/about" className="mt-6 inline-block border-b border-white/60 pb-0.5 font-semibold text-white hover:border-white">
            법인 소개 더보기&nbsp;→
          </Link>
        </div>
      </div>
    </section>
  )
}
