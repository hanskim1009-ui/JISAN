import Link from "next/link"
import { SectionHead } from "@/components/main/section-head"
import { siteConfig } from "@/lib/site-config"

/**
 * 계산기·체크리스트 공통 틀 (한국어 메인 사이트 /tools/*).
 * 제목·설명 → 계산기 본문(children) → 참고 안내 → 상담 연결.
 */
export function ToolShell({
  title,
  lead,
  children,
  notice = "결과는 일반적인 기준에 따른 참고용입니다. 실제 사건은 구체적인 사정에 따라 크게 달라질 수 있으니, 결정을 내리기 전에 변호사와 상의하세요.",
  consultType,
  related,
}: {
  title: string
  lead: string
  children: React.ReactNode
  /** 결과 아래 참고 안내 문구 */
  notice?: string
  /** 상담 신청 분야 미리 선택 (/consult?type=형사) */
  consultType?: string
  /** 관련 페이지 링크 */
  related?: { href: string; label: string }[]
}) {
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm text-[#6B717B]">
          <Link href="/tools" className="hover:text-jisan-ink">
            계산기·자가진단
          </Link>
        </p>
        <SectionHead title={title} as="h1" desc={lead} />
        <div className="min-w-0">{children}</div>
        <p className="mt-10 rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">{notice}</p>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-jisan-ink p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-lg font-bold">내 사건에 맞춰 다시 따져 보고 싶다면</p>
            <p className="mt-1 text-sm text-white/75">변호사가 사건 내용을 확인하고 연락드립니다. 전화 {siteConfig.phone} (24시간)</p>
          </div>
          <Link
            href={consultType ? `/consult?type=${encodeURIComponent(consultType)}` : "/consult"}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-[0.9375rem] font-semibold text-jisan-ink hover:bg-white/90"
          >
            상담 신청
          </Link>
        </div>
        {related && related.length > 0 && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-jisan-ink">함께 보면 좋은 페이지</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="inline-block rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] hover:border-jisan-ink hover:text-jisan-ink">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
