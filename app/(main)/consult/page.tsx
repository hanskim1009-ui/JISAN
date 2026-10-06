import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { CASE_TYPES } from "@/lib/practice"
import { ConsultForm } from "@/components/consult-form"
import { SectionHead } from "@/components/main/section-head"

export const metadata: Metadata = {
  title: "상담 신청",
  description: `${siteConfig.name} 상담 신청. 변호사가 내용을 확인하고 연락드립니다. 전화는 24시간, 주말·공휴일에도 받습니다.`,
  alternates: { canonical: "/consult" },
}

/** 메인 사이트 상담 신청: 첫 화면의 상황 링크(/consult?type=가사)로 들어오면 분야가 미리 골라져 있습니다 */
export default async function ConsultPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const defaultCaseType = type && CASE_TYPES.includes(type) ? type : undefined

  const ways = [
    { label: "전화", value: `${siteConfig.phone} · 24시간, 주말·공휴일 포함`, href: siteConfig.phoneHref },
    { label: "카카오톡", value: "채팅으로 상담 예약", href: siteConfig.kakaoTalkUrl, external: true },
    { label: "방문", value: siteConfig.address, href: siteConfig.naverMapUrl, external: true },
  ]

  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead title="상담 신청" as="h1" desc="남겨 주신 내용은 담당 변호사가 보고 연락드립니다." />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="min-w-0">
            <p className="text-[15px] leading-[1.8] text-[#4A505A]">
              체포·구속이나 다음 날 조사처럼 급한 일은 전화가 빠릅니다. 전화는 24시간 받습니다.
            </p>
            <dl className="mt-6 border-t border-jisan-ink text-[15px]">
              {ways.map((w) => (
                <div key={w.label} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-3.5">
                  <dt className="font-semibold text-jisan-ink">{w.label}</dt>
                  <dd>
                    <a
                      href={w.href}
                      {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-[#4A505A] hover:text-brand-accent"
                    >
                      {w.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 bg-brand-paper p-6 md:p-8">
            <ConsultForm idPrefix="consult-page" source="메인 상담 페이지" defaultCaseType={defaultCaseType} />
          </div>
        </div>
      </div>
    </div>
  )
}
