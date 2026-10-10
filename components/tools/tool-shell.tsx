import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionHead } from "@/components/main/section-head"
import { siteConfig } from "@/lib/site-config"
import type { Lang } from "@/lib/langs"
import { L, fmt } from "@/lib/i18n/fmt"
import { toolText } from "@/lib/tools/i18n"
import { ToolConsultLink } from "@/components/tools/consult-link"

/**
 * 계산기·체크리스트 공통 틀 (한국어 /tools/*, 외국어 /{언어}/tools/*).
 * 제목·설명 → 계산기 본문(children) → 참고 안내 → 상담 연결.
 * 문구는 content/tools/i18n/{언어}/common.json 의 shell. 외국어판은 전화 안내 없이 메신저 문의(/{언어}/consult)로만 연결합니다.
 */
export function ToolShell({
  title,
  lead,
  children,
  notice,
  consultType,
  related,
  lang = "ko",
}: {
  title: string
  lead: string
  children: React.ReactNode
  /** 결과 아래 참고 안내 문구 (없으면 공통 문구) */
  notice?: string
  /** 상담 신청 분야 미리 선택 (/consult?type=형사). 한국어판만 */
  consultType?: string
  /** 관련 페이지 링크 */
  related?: { href: string; label: string }[]
  /** 화면 언어 (기본 한국어) */
  lang?: Lang
}) {
  const c = toolText(lang, "common")
  if (!c) notFound()
  const ko = lang === "ko"
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm text-[#6B717B]">
          <Link href={L(lang, "/tools")} className="hover:text-jisan-ink">
            {c.shell.crumb}
          </Link>
        </p>
        <SectionHead title={title} as="h1" desc={lead} />
        <div className="min-w-0">{children}</div>
        <p className="mt-10 rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">{notice ?? c.shell.notice}</p>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-jisan-ink p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-lg font-bold">{c.shell.ctaTitle}</p>
            <p className="mt-1 text-sm text-white/75">
              {ko && c.shell.ctaPhone ? `${c.shell.ctaLead} ${fmt(c.shell.ctaPhone, { phone: siteConfig.phone })}` : c.shell.ctaLead}
            </p>
          </div>
          <ToolConsultLink
            lang={lang}
            consultType={ko ? consultType : undefined}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-[0.9375rem] font-semibold text-jisan-ink hover:bg-white/90"
          >
            {c.shell.ctaButton}
          </ToolConsultLink>
        </div>
        {related && related.length > 0 && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-jisan-ink">{c.shell.related}</p>
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
