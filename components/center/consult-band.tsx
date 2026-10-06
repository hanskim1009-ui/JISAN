import { MessageCircle, Phone } from "lucide-react"
import type { Center } from "@/lib/centers"
import { siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
import { ConsultForm } from "@/components/consult-form"

/** 센터 페이지 맨 아래 상담 구역 (센터 메인과 상세 페이지가 같이 씀) */
export function ConsultBand({ center, title, source }: { center: Center; title?: string; source?: string }) {
  const t = centerTones[center.tone]
  return (
    <section id="consult" className={`${t.band} px-6 md:px-12 lg:px-20 py-16 md:py-24 scroll-mt-20`}>
      <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-balance">{title ?? center.closing}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed opacity-80">
            주말·공휴일 포함 24시간 상담합니다. 남겨 주신 내용은 담당 변호사가 직접 확인하고 연락드립니다.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={siteConfig.phoneHref} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${t.bandBtn}`}>
              <Phone className="h-4 w-4" /> 전화 {siteConfig.phone}
            </a>
            <a
              href={siteConfig.kakaoTalkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 py-3 text-sm font-semibold text-[#191919]"
            >
              <MessageCircle className="h-4 w-4" /> 카카오톡 상담
            </a>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 md:p-8 text-foreground">
          <h3 className="mb-6 text-base font-semibold text-jisan-ink">{center.name} 상담 신청</h3>
          <ConsultForm idPrefix={center.slug} fixedCaseType={center.form.caseType} stageOptions={center.form.stageOptions} source={source ?? center.name} />
        </div>
      </div>
    </section>
  )
}
