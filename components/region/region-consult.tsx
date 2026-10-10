import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion, regionBase, type RegionSlug } from "@/lib/regions"
import { siteConfig } from "@/lib/site-config"
import { ConsultForm } from "@/components/consult-form"
import { VisitOffices } from "@/components/region/visit-offices"

export function regionConsultMetadata(slug: RegionSlug): Metadata {
  const r = getRegion(slug)
  if (!r) return {}
  return {
    title: { absolute: `상담 신청 | ${siteConfig.name} ${r.name}` },
    description: `${r.name} 지역 형사·가사 사건 상담 신청. 변호사가 내용을 확인하고 연락드립니다. 전화는 24시간, 주말·공휴일에도 받습니다.`,
    alternates: { canonical: `${regionBase(r)}/consult` },
  }
}

/** 지역 상담 신청: 메인 상담 폼을 그대로 쓰고, 접수 출처에 "지역:수원"처럼 지역을 남깁니다 */
export function RegionConsult({ slug }: { slug: RegionSlug }) {
  const region = getRegion(slug)
  if (!region) notFound()

  return (
    <div className="px-5 py-12 md:px-12 md:py-16 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-jisan-ink md:text-[2.375rem]">상담 신청</h1>
        <p className="mt-2 break-keep text-sm text-[#4A505A]">{region.name} 지역 사건 내용을 남겨 주시면 변호사가 직접 확인하고 연락드립니다.</p>
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="min-w-0 space-y-8">
            <p className="break-keep text-[0.9375rem] leading-[1.8] text-[#4A505A]">
              {region.consultLead} 체포나 다음 날 조사처럼 급한 일은 전화가 빠릅니다.
            </p>
            <dl className="border-t border-jisan-ink text-[0.9375rem]">
              <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-3.5">
                <dt className="font-semibold text-jisan-ink">전화</dt>
                <dd>
                  <a href={siteConfig.phoneHref} className="tabular-nums text-[#4A505A] hover:text-jisan-blue">
                    {siteConfig.phone} · 24시간, 주말·공휴일 포함
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-3.5">
                <dt className="font-semibold text-jisan-ink">카카오톡</dt>
                <dd>
                  <a href={siteConfig.kakaoTalkUrl} target="_blank" rel="noopener noreferrer" className="text-[#4A505A] hover:text-jisan-blue">
                    채팅으로 상담 예약
                  </a>
                </dd>
              </div>
            </dl>
            <VisitOffices region={region} />
          </div>
          <div className="min-w-0 bg-brand-paper p-6 md:p-8">
            <ConsultForm idPrefix={`region-${region.slug}`} source={`지역:${region.name}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
