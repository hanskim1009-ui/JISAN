import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCase, getCases } from "@/lib/content"
import { lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { CasesTable } from "@/components/cases-table"
import { SectionHead } from "@/components/main/section-head"
import { SampleNote } from "@/components/sample-note"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { CASES_TABLE_KEYS, clientDict } from "@/lib/i18n/client-keys"
import { lawyerName } from "@/lib/lawyer-name"

export function casesMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("업무사례"),
    description: t("형사·가사·기업·의료·부동산·민사 업무사례. 의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다."),
    alternates: foreignAlternates(lang, "/cases"),
  }
}

export async function CasesPage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const cases = await getCases({ lang })
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          title={t("업무사례")}
          as="h1"
          desc={t("의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다. 같은 결과를 약속하지 않습니다.")}
        />
        <SampleNote show={cases.some((c) => c.sample)} className="mb-4" lang={lang} />
        {cases.length > 0 ? (
          <CasesTable items={cases} lang={lang} dict={clientDict(lang, CASES_TABLE_KEYS)} />
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">{t("업무사례를 정리하고 있습니다. 의뢰인의 동의를 받은 사건부터 차례로 올립니다.")}</p>
        )}
      </div>
    </div>
  )
}

export async function caseMetadata(lang: Lang, id: string): Promise<Metadata> {
  const t = T(lang)
  const c = await getCase(id, lang)
  if (!c) return {}
  return {
    title: t("{type} {result} 사례", { type: c.caseType, result: c.result }),
    description: `${c.situation} · ${c.stage} · ${c.result}. ${t("{name} 업무사례.", { name: t(siteConfig.name) })}`,
    alternates: foreignAlternates(lang, `/cases/${c.id}`),
  }
}

export async function CasePage({ lang, id }: { lang: Lang; id: string }) {
  const t = T(lang)
  const ko = lang === "ko"
  const c = await getCase(id, lang)
  if (!c) notFound()
  const people = lawyers.filter((l) => c.lawyers.includes(l.slug))
  const rows = [
    ["분야", `${t(c.field)} · ${c.caseType}`],
    ["의뢰인", c.clientRole],
    ["단계", c.stage],
    ["시기", c.decidedOn],
    ["결과", c.result],
  ]

  return (
    <article className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Link href={L(lang, "/cases")} className="text-sm text-[#4A505A] underline underline-offset-4">
          {t("업무사례")}
        </Link>
        <SampleNote show={Boolean(c.sample)} className="mt-3" lang={lang} />
        <h1 className="mt-3 text-[1.75rem] md:text-[2.125rem] font-bold leading-[1.35] tracking-tight text-jisan-ink text-balance">
          {c.situation}
        </h1>
        <dl className="mt-6 border-t-2 border-jisan-ink text-[0.9375rem]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-2.5">
              <dt className="text-[#8A9099]">{t(k)}</dt>
              <dd className={k === "결과" ? "font-bold text-brand-accent" : "text-jisan-ink"}>{v}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-10 text-lg font-bold text-jisan-ink">{t("쟁점")}</h2>
        <p className="mt-2 text-[1rem] leading-[1.85] text-[#2D323A] whitespace-pre-line">{c.issue}</p>
        <h2 className="mt-8 text-lg font-bold text-jisan-ink">{t("한 일")}</h2>
        <p className="mt-2 text-[1rem] leading-[1.85] text-[#2D323A] whitespace-pre-line">{c.work}</p>
        <p className="mt-10 border-t border-[#E4E6E9] pt-4 text-sm text-[#4A505A]">
          {t("담당")}{" "}
          {people.map((l, i) => (
            <span key={l.slug}>
              {i > 0 && ", "}
              <Link href={`${L(lang, "/lawyers")}#${l.slug}`} className="font-semibold text-jisan-ink underline underline-offset-4">
                {lawyerName(l, lang)} {t(l.title)}
              </Link>
            </span>
          ))}
          {ko &&
            c.centers?.map((slug) => (
              <span key={slug}>
                {" · "}
                <Link href={`/${slug}`} className="underline underline-offset-4">
                  {centers.find((x) => x.slug === slug)?.name}
                </Link>
              </span>
            ))}
        </p>
        <p className="mt-3 text-xs text-[#8A9099]">{t("의뢰인의 동의를 받아 누구인지 알 수 없게 고쳐 실었습니다. 같은 결과를 약속하지 않습니다.")}</p>
      </div>
    </article>
  )
}
