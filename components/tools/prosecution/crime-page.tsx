import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ToolShell } from "@/components/tools/tool-shell"
import { JsonLd } from "@/components/json-ld"
import { SingleCrimeCalculator } from "@/components/tools/prosecution/prosecution-calculator"
import { OG_LOCALE, type Lang } from "@/lib/langs"
import { L, fmt } from "@/lib/i18n/fmt"
import { toolAlternates } from "@/lib/tools/i18n"
import { formatWon, isPenaltySentence, type ProsecutionIntl } from "@/lib/tools/prosecution"
import type { Crime, Tier } from "@/lib/tools/prosecution-types"
import { formatWonIntl } from "@/lib/tools/tool-num-fmt"
import { crimeToolAvailable } from "@/lib/tools/tool-data-i18n"
import { crimePageCrime, crimePageLangs, crimePageLangsFor, crimePageSet, crimesByGroup, relatedCrimes, type CrimePageSet } from "@/lib/tools/prosecution-page"

const crimePath = (id: string) => `/tools/prosecution/${id}`

/** "{name}({law})" 에서 조문이 없으면 괄호째 뺌 */
const fill = (s: string, v: Record<string, string>) => fmt(s, v).replace(/\s*\(\)|（）/g, "")

function intlOf(set: CrimePageSet): ProsecutionIntl | undefined {
  if (set.lang === "ko" || !set.num) return undefined
  return { lang: set.lang, ui: set.ui, num: set.num, dataBase: L(set.lang, "/tools/prosecution/data"), consultHref: L(set.lang, "/consult") }
}

/** 처리 기준 한 칸의 벌금 표기 (기본 금액 기준) */
function fineText(set: CrimePageSet, tier: Tier): string | undefined {
  const f = tier.fine
  if (!f || f.base <= 0) return undefined
  const base = f.max !== undefined ? Math.min(f.base, f.max) : f.base
  const amount = set.num ? formatWonIntl(base, set.num) : formatWon(base)
  if (f.perUnit) return fmt(set.text.fineFrom, { amount })
  if (f.atLeast) return set.num ? fmt(set.ui.result.fineAtLeast, { amount }) : `${amount} 이상`
  return amount
}

/** 이 죄명에서 나올 수 있는 처리 단계 이름 (무거운 순, 겹치면 한 번) */
function levelNames(set: CrimePageSet, crime: Crime): string[] {
  const levels: Record<string, string> = set.ui.levels
  return [...new Set(crime.tiers.map((t) => levels[t.level] ?? t.level))]
}

function faqOf(set: CrimePageSet, crime: Crime): { q: string; a: string }[] {
  const t = set.text
  const v = { name: crime.name, law: crime.law, statutory: crime.statutory }
  const out: { q: string; a: string }[] = []
  if (crime.statutory) out.push({ q: fmt(t.faq.statutoryQ, v), a: crime.law ? fmt(t.faq.statutoryA, v) : crime.statutory })
  if (crime.consultOnly) out.push({ q: fmt(t.faq.consultQ, v), a: t.faq.consultA })
  else if (crime.tiers.length > 0) out.push({ q: fmt(t.faq.outcomeQ, v), a: fmt(t.faq.outcomeA, { levels: levelNames(set, crime).join(t.listSep) }) })
  return out
}

export function crimePageMetadata(lang: Lang, id: string): Metadata {
  const found = crimePageCrime(lang, id)
  if (!found) return {}
  const { set, crime } = found
  const v = { name: crime.name, law: crime.law }
  const title = fmt(crime.consultOnly ? set.text.meta.titleConsult : set.text.meta.title, v)
  const description = fill(crime.consultOnly ? set.text.meta.descriptionConsult : set.text.meta.description, v)
  return {
    title,
    description,
    alternates: toolAlternates(lang, crimePath(id), crimePageLangsFor(id)),
    openGraph: { title, description, url: L(lang, crimePath(id)), type: "article", ...(lang !== "ko" ? { locale: OG_LOCALE[lang] } : {}) },
  }
}

/** 죄명 안내 페이지: 법정형·근거 조문 → 그 죄명 계산기 → 처리 기준 한눈에 → 자주 묻는 질문 → 같은 분야 죄명 */
export function CrimePage({ lang, id }: { lang: Lang; id: string }) {
  const found = crimePageCrime(lang, id)
  if (!found) notFound()
  const { set, crime } = found
  const t = set.text
  const u = set.ui
  const intl = intlOf(set)
  const v = { name: crime.name, law: crime.law }
  const faq = faqOf(set, crime)
  const related = relatedCrimes(set, crime)
  const calcHref = L(lang, "/tools/prosecution")

  // 위치 표시(BreadcrumbList)는 ToolShell 이 넣음
  const jsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null

  const shellRelated =
    lang === "ko"
      ? [
          { href: "/tools/sentencing", label: u.meta.relatedSentencing },
          { href: "/tools/police-summons", label: u.meta.relatedPoliceSummons },
          { href: "/crime", label: u.meta.relatedCrimeCenter },
        ]
      : [
          ...(crimeToolAvailable("sentencing", lang) ? [{ href: L(lang, "/tools/sentencing"), label: u.meta.relatedSentencing }] : []),
          { href: L(lang, "/crime"), label: u.meta.relatedCrimeCenter },
        ]

  return (
    <ToolShell
      lang={lang}
      title={fmt(crime.consultOnly ? t.meta.titleConsult : t.meta.title, v)}
      lead={fmt(crime.consultOnly ? t.leadConsult : t.lead, v)}
      notice={u.meta.notice}
      consultType="형사"
      crumbs={[{ href: calcHref, label: t.crumb }]}
      related={shellRelated}
    >
      {jsonLd && <JsonLd data={jsonLd} />}
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#E2E6ED] bg-[#E2E6ED] text-[0.9375rem]">
        {crime.statutory && <Fact label={t.facts.statutory} value={crime.statutory} />}
        {crime.law && <Fact label={t.facts.law} value={crime.law} />}
        <Fact label={t.facts.group} value={[set.group(crime.group), crime.lawName && crime.lawName !== "형법" ? set.law(crime.lawName) : ""].filter(Boolean).join(" · ")} />
      </dl>

      <section className="mt-12">
        <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{t.calcTitle}</h2>
        <div className="mt-6">
          <SingleCrimeCalculator crime={crime} intl={intl} />
        </div>
      </section>

      {!crime.consultOnly && !crime.ref && crime.tiers.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{t.tiersTitle}</h2>
          <p className="mt-3 text-sm text-[#6B717B]">{t.tiersLead}</p>
          <ol className="mt-4 space-y-3">
            {crime.tiers.map((tier, i) => {
              const levels: Record<string, string> = u.levels
              const fine = fineText(set, tier)
              return (
                <li key={i} className="rounded-2xl border border-[#E2E6ED] bg-white p-5">
                  <p className="font-semibold text-jisan-ink">{levels[tier.level] ?? tier.level}</p>
                  {(tier.sentence || fine) && (
                    <dl className="mt-2 space-y-1 text-[0.9375rem] text-[#2B3038]">
                      {tier.sentence && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-[#6B717B]">{isPenaltySentence(tier) ? t.sentence : t.criterion}</dt>
                          <dd className="min-w-0 [overflow-wrap:anywhere]">{tier.sentence}</dd>
                        </div>
                      )}
                      {fine && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-[#6B717B]">{t.fine}</dt>
                          <dd className="min-w-0 [overflow-wrap:anywhere]">{fine}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {tier.note && <p className="mt-2 text-sm leading-relaxed text-[#4A505A]">{tier.note}</p>}
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {crime.notes && crime.notes.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{t.notesTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-[#2B3038]">
            {crime.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">{t.faqTitle}</h2>
          <dl className="mt-4 divide-y divide-[#E9ECF0]">
            {faq.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold text-jisan-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#2B3038]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-bold text-jisan-ink">{t.related}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((c) => (
              <li key={c.id} className="min-w-0 max-w-full">
                <Link
                  href={L(lang, crimePath(c.id))}
                  prefetch={false}
                  className="inline-block max-w-full rounded-full border border-[#D5DAE1] px-4 py-2 text-sm text-[#4A505A] [overflow-wrap:anywhere] hover:border-jisan-ink hover:text-jisan-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href={L(lang, "/tools/prosecution/crimes")} className="text-[#4A505A] underline underline-offset-4 hover:text-jisan-ink">
              {t.allCrimes}
            </Link>
          </p>
        </section>
      )}
    </ToolShell>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 bg-white px-5 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-semibold text-[#6B717B]">{label}</dt>
      <dd className="min-w-0 text-jisan-ink [overflow-wrap:anywhere]">{value}</dd>
    </div>
  )
}

/* ---------- 죄명 모음 ---------- */

export function crimeIndexMetadata(lang: Lang): Metadata {
  const set = crimePageSet(lang)
  if (!set) return {}
  const n = set.crimes.length.toLocaleString(set.num?.locale ?? "ko-KR")
  return {
    title: set.text.index.title,
    description: fmt(set.text.index.description, { n }),
    alternates: toolAlternates(lang, "/tools/prosecution/crimes", crimePageLangs()),
  }
}

/** 죄명 모음 (/tools/prosecution/crimes): 묶음별 죄명 링크. 검색엔진이 죄명 페이지를 찾아가는 길이기도 함 */
export function CrimeIndexPage({ lang }: { lang: Lang }) {
  const set = crimePageSet(lang)
  if (!set) notFound()
  const t = set.text
  const calcHref = L(lang, "/tools/prosecution")
  return (
    <ToolShell
      lang={lang}
      title={t.index.title}
      lead={t.index.lead}
      notice={set.ui.meta.notice}
      consultType="형사"
      crumbs={[{ href: calcHref, label: t.crumb }]}
    >
      <p>
        <Link href={calcHref} className="inline-flex rounded-full bg-jisan-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-jisan-ink/90">
          {t.index.openCalc}
        </Link>
      </p>
      <div className="mt-10 space-y-10">
        {crimesByGroup(set).map(([g, list]) => (
          <section key={g}>
            <h2 className="border-b border-jisan-ink pb-3 text-lg font-bold text-jisan-ink">
              {set.group(g)} <span className="text-sm font-normal text-[#8A9099]">{list.length}</span>
            </h2>
            {/* 1,700여 개 링크라 항목마다 클래스를 달지 않고 목록에서 한 번에 꾸밈 (페이지 크기) */}
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-3 [&_a]:text-[#2B3038] [&_a]:[overflow-wrap:anywhere] [&_a:hover]:text-jisan-ink [&_a:hover]:underline [&_li]:min-w-0">
              {list.map((c) => (
                <li key={c.id}>
                  <a href={L(lang, crimePath(c.id))}>{c.name}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ToolShell>
  )
}
