import Link from "next/link"
import { Check, ChevronRight, Phone } from "lucide-react"
import type { Center } from "@/lib/centers"
import type { AreaPage, CenterPages, Section } from "@/lib/center-pages"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
import { RidgeCanvas } from "@/components/look/ridge-canvas"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { DataTable } from "@/components/center/data-table"
import { FaqList } from "@/components/center/faq-list"

const h2 = "text-[1.375rem] md:text-[1.625rem] font-bold tracking-tight text-jisan-ink leading-snug text-balance"
const para = "text-[16px] leading-[1.9] text-jisan-ink/80"

/** 상세 페이지 첫 화면: 경로 표시 + 제목 + 한두 문장 + 상담 버튼, 아래에 센터 색 능선 */
export function SubHero({
  center,
  crumbs,
  kicker,
  title,
  lead,
}: {
  center: Center
  crumbs: { label: string; href?: string }[]
  kicker: string
  title: string
  lead: string
}) {
  const t = centerTones[center.tone]
  const dark = center.tone === "dark"
  return (
    <section className={`relative overflow-hidden ${t.hero}`}>
      <RidgeCanvas palette={dark ? "navy" : "warm"} className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] max-h-[220px] w-full opacity-80" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-10 pb-24 md:pt-14 md:pb-32">
        <nav aria-label="현재 위치" className={`flex flex-wrap items-center gap-1 text-[13px] ${dark ? "text-white/60" : "text-[#5A554C]"}`}>
          {crumbs.map((c, i) => (
            <span key={c.label} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {c.href ? (
                <Link href={c.href} className="hover:underline underline-offset-4">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p style={{ animationDelay: "0.1s" }} className={`anim-rise mt-8 text-sm font-bold ${dark ? "text-white/70" : t.accent}`}>
          {kicker}
        </p>
        <h1 style={{ animationDelay: "0.2s" }} className={`anim-rise mt-2 max-w-4xl text-[2rem] leading-[1.25] md:text-[2.75rem] text-balance ${t.heroTitle}`}>
          {title}
        </h1>
        <p style={{ animationDelay: "0.3s" }} className={`anim-rise mt-5 max-w-2xl text-base md:text-[17px] leading-relaxed ${t.heroSub}`}>
          {lead}
        </p>
        <div style={{ animationDelay: "0.4s" }} className="anim-rise mt-8 flex flex-wrap gap-2.5">
          <a href="#consult" className={`rounded-full px-6 py-3 text-[15px] font-semibold ${t.primaryBtn}`}>
            상담 신청
          </a>
          <a href={siteConfig.phoneHref} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tabular-nums ${t.ghostBtn}`}>
            <Phone className="h-4 w-4" /> {siteConfig.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

/** 넓은 화면 왼쪽: 센터 안의 다른 상세 페이지로 이동 */
export function SideNav({ center, pages, current }: { center: Center; pages: CenterPages; current: string }) {
  const t = centerTones[center.tone]
  const link = (href: string, label: string, active: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block rounded-lg px-3 py-2 text-[14.5px] leading-snug transition-colors ${
          active ? "bg-jisan-ink text-white font-semibold" : "text-jisan-ink/75 hover:bg-jisan-mist hover:text-jisan-ink"
        }`}
      >
        {label}
      </Link>
    </li>
  )
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-8">
        <div>
          <p className="mb-2 px-3 text-xs font-bold text-jisan-ink/50">{center.name} 업무분야</p>
          <ul className="space-y-0.5">{pages.areaPages.map((a) => link(`/${center.slug}/${a.slug}`, a.areaName, current === a.slug))}</ul>
        </div>
        {pages.guides.length > 0 && (
          <div>
            <p className="mb-2 px-3 text-xs font-bold text-jisan-ink/50">상황별 안내</p>
            <ul className="space-y-0.5">{pages.guides.map((g) => link(`/${center.slug}/guide/${g.slug}`, g.title, current === `guide/${g.slug}`))}</ul>
          </div>
        )}
        <div className="rounded-2xl border border-[#E2E6ED] p-4">
          <p className="text-sm font-bold text-jisan-ink">24시간 상담 전화</p>
          <a href={siteConfig.phoneHref} className={`mt-1 block text-lg font-bold tabular-nums ${t.accent}`}>
            {siteConfig.phone}
          </a>
          <p className="mt-1 text-xs leading-relaxed text-jisan-ink/60">주말·공휴일에도 받습니다.</p>
        </div>
      </div>
    </aside>
  )
}

/** 본문 소제목 + 문단 + 항목 */
export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.title} className="scroll-mt-24">
          <h2 className={h2}>{s.title}</h2>
          <div className="mt-4 space-y-4">
            {s.body?.map((p) => (
              <p key={p} className={para}>
                {p}
              </p>
            ))}
            {s.bullets && s.bullets.length > 0 && (
              <ul className="space-y-2 rounded-2xl bg-jisan-mist/50 p-5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-jisan-ink/85">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-jisan-ink/40" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </>
  )
}

/** 업무분야 상세 페이지 본문 전체 */
export function AreaArticle({ center, page }: { center: Center; page: AreaPage }) {
  const t = centerTones[center.tone]
  const leads = center.lawyers.flatMap((cl) => {
    const l = getLawyer(cl.slug)
    return l ? [{ ...l, note: cl.note }] : []
  })
  return (
    <article className="min-w-0 max-w-3xl space-y-16">
      {page.situations && (
        <section className="rounded-2xl bg-jisan-mist/60 p-6 md:p-7">
          <h2 className="text-lg font-bold text-jisan-ink">{page.situations.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {page.situations.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-jisan-ink">
                <Check className={`mt-1 h-4 w-4 shrink-0 ${t.accent}`} aria-hidden />
                {it}
              </li>
            ))}
          </ul>
        </section>
      )}

      {page.law && page.law.items.length > 0 && (
        <section>
          <h2 className={h2}>{page.law.title}</h2>
          <div className="mt-5 space-y-3">
            {page.law.items.map((l) => (
              <div key={l.name} className="rounded-xl border-l-4 border-jisan-ink/70 bg-white px-5 py-4 shadow-[0_1px_0_#E2E6ED,0_0_0_1px_#E2E6ED]">
                <p className="text-sm font-bold text-jisan-ink">{l.name}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-jisan-ink/75">{l.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">조문은 요지만 옮겼습니다. 정확한 문언은 국가법령정보센터에서 확인하실 수 있습니다.</p>
        </section>
      )}

      {page.table && (
        <section>
          <h2 className={h2}>{page.table.title}</h2>
          <DataTable table={page.table} className="mt-5" />
        </section>
      )}

      <Sections sections={page.sections} />

      {page.factors && ((page.factors.plus?.length ?? 0) > 0 || (page.factors.minus?.length ?? 0) > 0) && (
        <section>
          <h2 className={h2}>{page.factors.title}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {page.factors.plus && page.factors.plus.length > 0 && (
              <div className="rounded-2xl border border-[#E2E6ED] p-5">
                <p className="text-sm font-bold text-[#B4490A]">불리하게 작용하는 사정</p>
                <ul className="mt-3 space-y-2">
                  {page.factors.plus.map((x) => (
                    <li key={x} className="text-[15px] leading-relaxed text-jisan-ink/80">
                      · {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {page.factors.minus && page.factors.minus.length > 0 && (
              <div className="rounded-2xl border border-[#E2E6ED] p-5">
                <p className={`text-sm font-bold ${t.accent}`}>유리하게 작용하는 사정</p>
                <ul className="mt-3 space-y-2">
                  {page.factors.minus.map((x) => (
                    <li key={x} className="text-[15px] leading-relaxed text-jisan-ink/80">
                      · {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {page.steps && page.steps.items.length > 0 && (
        <section>
          <h2 className={h2}>{page.steps.title}</h2>
          <ol className="mt-6 space-y-0">
            {page.steps.items.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
                {i < page.steps!.items.length - 1 && <span aria-hidden className="absolute left-[15px] top-9 bottom-0 w-px bg-[#D5DAE2]" />}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jisan-ink text-sm font-bold tabular-nums text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[16px] font-bold text-jisan-ink">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-jisan-ink/75">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {page.checklist && page.checklist.items.length > 0 && (
        <section className="rounded-2xl border border-dashed border-jisan-ink/25 p-6 md:p-7">
          <h2 className="text-lg font-bold text-jisan-ink">{page.checklist.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {page.checklist.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-jisan-ink/85">
                <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded border border-jisan-ink/40" />
                {it}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-jisan-ink/55">자료가 다 없어도 괜찮습니다. 있는 것만 가지고 오셔도 상담할 수 있습니다.</p>
        </section>
      )}

      {leads.length > 0 && (
        <section>
          <h2 className={h2}>이 사건을 맡는 변호사</h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {leads.map((l) => (
              <li key={l.slug} className="flex items-center gap-4 rounded-2xl border border-[#E2E6ED] p-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#2a3348]">
                  <LawyerPhoto src={l.image} name={l.name} imageClassName={l.photoImageClassName} sizes="64px" initialClassName="text-2xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-jisan-ink">
                    {l.name} <span className="text-sm font-medium text-muted-foreground">{l.title}</span>
                  </p>
                  {l.note && <p className="mt-0.5 text-[13px] leading-snug text-jisan-ink/70">{l.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page.faqs && page.faqs.length > 0 && (
        <section>
          <h2 className={h2}>자주 묻는 질문</h2>
          <div className="mt-4">
            <FaqList items={page.faqs} />
          </div>
        </section>
      )}
    </article>
  )
}

/** 같은 센터의 다른 업무분야 (모든 화면 너비에서 보이는 하단 이동) */
export function RelatedAreas({ center, pages, current }: { center: Center; pages: CenterPages; current: string }) {
  const others = pages.areaPages.filter((a) => a.slug !== current)
  if (others.length === 0) return null
  return (
    <section className="bg-jisan-mist/50 px-6 md:px-12 lg:px-20 py-14 md:py-16">
      <div data-reveal className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-jisan-ink">{center.name}의 다른 업무분야</h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => (
            <li key={a.slug}>
              <Link href={`/${center.slug}/${a.slug}`} className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-5">
                <span className="font-bold text-jisan-ink">{a.areaName}</span>
                <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-jisan-ink/65">{a.lead}</span>
                <span className="mt-auto pt-3 text-sm font-semibold text-jisan-ink/70 group-hover:text-jisan-ink">자세히 보기 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
