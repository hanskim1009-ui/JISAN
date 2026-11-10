import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageCircle, Phone } from "lucide-react"
import { CASE_GROUPS, RESULT_GROUPS, getCase, getCases, getColumns, pickVaried, type CaseItem } from "@/lib/content"
import { lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { CasesTable } from "@/components/cases-table"
import { CasesBrowser, type CaseRow } from "@/components/cases-browser"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { SectionHead } from "@/components/main/section-head"
import { SampleNote } from "@/components/sample-note"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { CASES_TABLE_KEYS, clientDict } from "@/lib/i18n/client-keys"
import { lawyerName } from "@/lib/lawyer-name"

/** 업무사례 아래에 늘 붙는 안내 (광고 규정: 의뢰인이 특정되지 않게, 결과를 약속하지 않게) */
const CASE_NOTE = "의뢰인이 누구인지 알 수 없도록 사실관계 일부를 고쳐 실었습니다. 사건마다 사정이 달라 같은 결과를 약속하지 않습니다."

export function casesMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("업무사례"),
    description: t("성범죄·음주운전·마약·사기 등 형사 사건을 어떤 쟁점으로 어떻게 풀었는지, 죄명과 결과별로 찾아볼 수 있습니다."),
    alternates: foreignAlternates(lang, "/cases"),
  }
}

const toRow = (c: CaseItem): CaseRow => ({
  id: c.id,
  group: c.group ?? c.field,
  resultGroup: c.resultGroup ?? "기타",
  caseType: c.caseType,
  stage: c.stage,
  result: c.result,
  title: c.situation,
  summary: c.summary ?? "",
})

export async function CasesPage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const cases = await getCases({ lang })
  // 처음 보이는 순서는 갈래를 돌아가며 섞음 (한 갈래만 이어지지 않게). 갈래를 고르면 그 안에서는 원래 순서
  const rows = pickVaried(cases, cases.length).map(toRow)
  const has = (k: "group" | "resultGroup") => new Set(rows.map((r) => r[k]))
  // 갈래 순서는 정해 둔 순서대로, 목록에 없는 값(가사·민사 등 다른 분야)은 뒤에
  const order = (known: readonly string[], present: Set<string>) => [...known.filter((g) => present.has(g)), ...[...present].filter((g) => !known.includes(g))]
  const site = siteConfig.siteUrl
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} 업무사례`,
    url: `${site}/cases`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cases.length,
      itemListElement: cases.slice(0, 50).map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${site}/cases/${c.id}`, name: caseHeadline(c) })),
    },
  }
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      {cases.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />}
      <div className="max-w-7xl mx-auto">
        <SectionHead title={t("업무사례")} as="h1" desc={t("담당 변호사가 직접 맡았던 사건입니다. 죄명과 결과로 골라 보실 수 있습니다.")} />
        <SampleNote show={cases.some((c) => c.sample)} className="mb-4" lang={lang} />
        {cases.length > 0 ? (
          <CasesBrowser items={rows} groups={order(CASE_GROUPS, has("group"))} results={order(RESULT_GROUPS, has("resultGroup"))} />
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">{t("업무사례를 정리하고 있습니다.")}</p>
        )}
        {cases.length > 0 && (
          <p className="mt-8 max-w-3xl text-[0.8125rem] leading-relaxed text-[#8A9099]">
            {t(CASE_NOTE)} {t("변호사가 지금 사무소에 오기 전에 맡았던 사건도 들어 있습니다.")} {t("광고책임변호사 {name}", { name: siteConfig.advertisingAttorney })}
          </p>
        )}
      </div>
    </div>
  )
}

/** 검색 결과·공유에 쓰는 제목: "준강간 불송치(혐의없음) 사례" */
const caseHeadline = (c: CaseItem) => `${c.caseType} ${c.result} 사례`

export async function caseMetadata(lang: Lang, id: string): Promise<Metadata> {
  const t = T(lang)
  const c = await getCase(id, lang)
  if (!c) return {}
  return {
    title: `${caseHeadline(c)}: ${c.situation}`,
    description: c.summary ?? `${c.situation} · ${c.stage} · ${c.result}. ${t("{name} 업무사례.", { name: t(siteConfig.name) })}`,
    alternates: foreignAlternates(lang, `/cases/${c.id}`),
    openGraph: { type: "article", title: `${caseHeadline(c)}: ${c.situation}`, description: c.summary },
  }
}

/** 비슷한 사건: 같은 죄명 먼저, 모자라면 같은 갈래에서 */
function related(c: CaseItem, all: CaseItem[], n = 4) {
  const others = all.filter((x) => x.id !== c.id)
  const key = (x: CaseItem) => x.caseType.split(/[ ·(]/)[0]
  const same = others.filter((x) => key(x) === key(c))
  const group = others.filter((x) => (c.group ? x.group === c.group : x.field === c.field) && !same.includes(x))
  // 결과가 한 가지로만 보이지 않게, 같은 죄명 안에서도 결과가 다른 사건을 섞음
  const mixed = [...same].sort((a, b) => Number(a.resultGroup === c.resultGroup) - Number(b.resultGroup === c.resultGroup))
  return [...mixed, ...group].slice(0, n)
}

export async function CasePage({ lang, id }: { lang: Lang; id: string }) {
  const t = T(lang)
  const ko = lang === "ko"
  const c = await getCase(id, lang)
  if (!c) notFound()
  const all = await getCases({ lang })
  const people = lawyers.filter((l) => c.lawyers.includes(l.slug))
  const center = centers.find((x) => x.slug === c.centers?.[0])
  const more = related(c, all)
  const columns = ko && center ? await getColumns({ center: center.slug, limit: 3, lang }) : []
  const consultHref = `${L(lang, "/consult")}?type=${encodeURIComponent(c.field)}`
  const rows = [
    ["사건", c.caseType],
    ["의뢰인", c.clientRole],
    ["단계", c.agency ? `${c.stage} · ${c.agency}` : c.stage],
    ...(c.decidedOn ? [["시기", c.decidedOn]] : []),
    ["결과", c.result],
  ]
  const site = siteConfig.siteUrl
  const url = `${site}${L(lang, "/cases")}/${c.id}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${caseHeadline(c)}: ${c.situation}`,
        description: c.summary,
        ...(c.publishedOn ? { datePublished: c.publishedOn, dateModified: c.publishedOn } : {}),
        inLanguage: lang,
        mainEntityOfPage: url,
        articleSection: c.group ?? c.field,
        author: people.map((l) => ({ "@type": "Person", name: lawyerName(l, lang), jobTitle: t(l.title), url: `${site}${L(lang, "/lawyers")}#${l.slug}` })),
        publisher: { "@type": "LegalService", name: ko ? siteConfig.name : siteConfig.nameEn, url: site },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("업무사례"), item: `${site}${L(lang, "/cases")}` },
          ...(c.group ? [{ "@type": "ListItem", position: 2, name: c.group, item: `${site}/cases?group=${encodeURIComponent(c.group)}` }] : []),
          { "@type": "ListItem", position: c.group ? 3 : 2, name: c.situation, item: url },
        ],
      },
    ],
  }
  const h2 = "mt-10 text-lg font-bold text-jisan-ink"
  const para = "mt-2 text-[1rem] leading-[1.85] text-[#2D323A] whitespace-pre-line"

  return (
    <article className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <nav aria-label={t("위치")} className="text-sm text-[#4A505A]">
          <Link href={L(lang, "/cases")} className="underline underline-offset-4">
            {t("업무사례")}
          </Link>
          {c.group && (
            <>
              <span className="mx-1.5 text-[#C2C6CC]">/</span>
              <Link href={`${L(lang, "/cases")}?group=${encodeURIComponent(c.group)}`} className="underline underline-offset-4">
                {c.group}
              </Link>
            </>
          )}
        </nav>
        <SampleNote show={Boolean(c.sample)} className="mt-3" lang={lang} />
        <p className="mt-5 text-[0.9375rem] font-semibold text-brand-accent">
          {c.caseType} · {c.result}
        </p>
        <h1 className="mt-1.5 text-[1.75rem] md:text-[2.125rem] font-bold leading-[1.35] tracking-tight text-jisan-ink text-balance">{c.situation}</h1>
        {c.summary && <p className="mt-4 text-[1.0625rem] leading-[1.8] text-[#2D323A]">{c.summary}</p>}

        <dl className="mt-6 border-t-2 border-jisan-ink text-[0.9375rem]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-2.5">
              <dt className="text-[#8A9099]">{t(k)}</dt>
              <dd className={k === "결과" ? "font-bold text-brand-accent" : "text-jisan-ink"}>{v}</dd>
            </div>
          ))}
        </dl>

        {c.facts && (
          <>
            <h2 className={h2}>{t("사건 경위")}</h2>
            <p className={para}>{c.facts}</p>
          </>
        )}
        <h2 className={c.facts ? "mt-8 text-lg font-bold text-jisan-ink" : h2}>{t("쟁점")}</h2>
        <p className={para}>{c.issue}</p>
        <h2 className="mt-8 text-lg font-bold text-jisan-ink">{t("변호인이 한 일")}</h2>
        {c.workItems && c.workItems.length > 0 ? (
          <ol className="mt-3 space-y-2.5">
            {c.workItems.map((w, i) => (
              <li key={i} className="grid grid-cols-[1.5rem_1fr] text-[1rem] leading-[1.8] text-[#2D323A]">
                <span className="font-semibold tabular-nums text-[#8A9099]">{i + 1}</span>
                <span>{w}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className={para}>{c.work}</p>
        )}
        {c.outcome && (
          <>
            <h2 className="mt-8 text-lg font-bold text-jisan-ink">{t("결과")}</h2>
            <p className={para}>{c.outcome}</p>
          </>
        )}

        {/* 담당 변호사 */}
        {people.map((l) => {
          const career = (l.career ?? l.structuredResume?.career ?? []).filter((x) => !x.startsWith("현)")).slice(0, 2)
          return (
            <aside key={l.slug} className="mt-12 grid grid-cols-[5.5rem_1fr] gap-5 border-y border-[#E4E6E9] py-6 sm:grid-cols-[7rem_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#C9CCD1]">
                <LawyerPhoto src={l.image} name={lawyerName(l, lang)} imageClassName={l.photoImageClassName} sizes="112px" initialClassName="text-3xl" />
              </div>
              <div className="min-w-0 self-center">
                <p className="text-[0.8125rem] text-[#8A9099]">{t("이 사건을 맡은 변호사")}</p>
                <p className="mt-0.5 text-lg font-bold text-jisan-ink">
                  {lawyerName(l, lang)} <span className="text-sm font-normal text-[#4A505A]">{t(l.title)}</span>
                </p>
                {career.length > 0 && <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[#4A505A]">{career.map((x) => t(x)).join(" · ")}</p>}
                <Link href={`${L(lang, "/lawyers")}#${l.slug}`} className="mt-2 inline-block text-sm font-semibold text-jisan-ink underline underline-offset-4">
                  {t("프로필 보기")}
                </Link>
              </div>
            </aside>
          )
        })}

        {/* 상담 연결: 글 끝에 한 번만 */}
        <section className="mt-8 rounded-2xl bg-brand px-6 py-7 text-white md:px-8 md:py-8">
          <h2 className="text-xl font-bold tracking-[-0.02em]">{t("비슷한 일을 겪고 계신가요")}</h2>
          <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-white/80">
            {t("사건 경위를 들으면 지금 단계에서 할 수 있는 일과 어려운 일부터 말씀드립니다. 전화는 밤과 주말에도 받습니다.")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href={consultHref} className="rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-brand hover:bg-white/90">
              {t("상담 신청")}
            </Link>
            {ko && (
              <>
                <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-[0.9375rem] font-semibold tabular-nums hover:bg-white/10">
                  <Phone className="h-4 w-4" /> {siteConfig.phone}
                </a>
                <a
                  href={siteConfig.kakaoTalkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-2.5 text-[0.9375rem] font-semibold text-[#191919]"
                >
                  <MessageCircle className="h-4 w-4" /> {t("카카오톡 상담")}
                </a>
              </>
            )}
          </div>
        </section>

        {more.length > 0 && (
          <section className="mt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-bold text-jisan-ink">{t("비슷한 사건")}</h2>
              {c.group && (
                <Link href={`${L(lang, "/cases")}?group=${encodeURIComponent(c.group)}`} className="text-sm text-jisan-ink underline underline-offset-4">
                  {t("{group} 사례 전체", { group: c.group })}
                </Link>
              )}
            </div>
            <div className="mt-3">
              <CasesTable items={more} tabs={false} lang={lang} dict={clientDict(lang, CASES_TABLE_KEYS)} />
            </div>
          </section>
        )}

        {columns.length > 0 && center && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-bold text-jisan-ink">{t("함께 읽을 글")}</h2>
              <Link href={`/${center.slug}`} className="text-sm text-jisan-ink underline underline-offset-4">
                {center.name}
              </Link>
            </div>
            <ul className="mt-3 border-t border-jisan-ink">
              {columns.map((x) => (
                <li key={x.id} className="border-b border-[#E4E6E9] py-3 text-[0.9375rem]">
                  <Link href={`${L(lang, "/column")}/${x.id}`} className="text-jisan-ink hover:underline underline-offset-4">
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs leading-relaxed text-[#8A9099]">
          {t(CASE_NOTE)} {t("광고책임변호사 {name}", { name: siteConfig.advertisingAttorney })}
        </p>
      </div>
    </article>
  )
}
