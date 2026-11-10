import { Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ConsultForm } from "@/components/consult-form"

/** 메인 중간의 짧은 상담 신청: 이름·연락처·분야만. 자세한 내용은 연락드려서 듣습니다 */
export function QuickConsult() {
  return (
    <section id="quick-consult" className="bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20 scroll-mt-20">
      <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div className="lg:pt-4">
          <h2 className="text-[1.625rem] md:text-[2rem] font-bold leading-[1.35] tracking-[-0.03em] text-jisan-ink">연락처만 남기셔도 됩니다</h2>
          <p className="mt-4 max-w-lg text-[1.0625rem] leading-[1.8] text-[#2D323A]">
            사건 내용을 글로 정리하기 어려우면 이름과 연락처만 남겨 주세요. 담당 변호사 쪽에서 먼저 연락드려 이야기를 듣겠습니다.
          </p>
          <a href={siteConfig.phoneHref} className="mt-6 inline-flex flex-wrap items-center gap-2 text-lg font-bold tabular-nums text-jisan-ink">
            <Phone className="h-4 w-4" /> {siteConfig.phone}
            <span className="text-sm font-normal text-[#4A505A]">24시간, 주말·공휴일 포함</span>
          </a>
        </div>
        <div className="rounded-2xl bg-white p-6 md:p-7 shadow-[0_10px_30px_-22px_rgb(8_22_40/0.5)]">
          <ConsultForm compact idPrefix="quick" source="메인 빠른 상담" />
        </div>
      </div>
    </section>
  )
}
