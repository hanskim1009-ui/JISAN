import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionHead } from "@/components/main/section-head"
import { siteConfig } from "@/lib/site-config"
import type { Lang } from "@/lib/langs"
import { L, fmt } from "@/lib/i18n/fmt"
import { toolText } from "@/lib/tools/i18n"
import { ToolConsultLink } from "@/components/tools/consult-link"
import { toolCopyright } from "@/lib/tools/copyright"
import { toolFaq } from "@/lib/tools/faq"
import { JsonLd } from "@/components/json-ld"

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
  crumbs = [],
  toolId,
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
  /** '계산기' 다음에 이어지는 위치 표시 (예: 구형 예상 계산기 › 상해) */
  crumbs?: { href: string; label: string }[]
  /** 도구 id (registry). 주면 그 도구의 자주 묻는 질문(content/tools/faq)을 붙임 */
  toolId?: string
}) {
  const c = toolText(lang, "common")
  if (!c) notFound()
  const ko = lang === "ko"
  const faq = toolId ? toolFaq(lang, toolId) : []
  const trail = [{ href: L(lang, "/tools"), label: c.shell.crumb }, ...crumbs]
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          ...trail.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: `${siteConfig.siteUrl}${b.href}` })),
          { "@type": "ListItem", position: trail.length + 1, name: title },
        ],
      },
      ...(faq.length
        ? [{ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  }
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm text-[#6B717B]">
          <Link href={L(lang, "/tools")} className="hover:text-jisan-ink">
            {c.shell.crumb}
          </Link>
          {crumbs.map((b) => (
            <span key={b.href}>
              <span aria-hidden className="mx-1.5">
                ›
              </span>
              <Link href={b.href} className="hover:text-jisan-ink">
                {b.label}
              </Link>
            </span>
          ))}
        </p>
        <SectionHead title={title} as="h1" desc={lead} />
        <div className="min-w-0">{children}</div>
        {faq.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{c.shell.faqTitle}</h2>
            <dl className="mt-2 divide-y divide-[#E9ECF0]">
              {faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-semibold text-jisan-ink">{f.q}</dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#2B3038]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
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
        <p className="mt-6 text-xs leading-relaxed text-[#8A9099]">{toolCopyright(lang)}</p>
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
