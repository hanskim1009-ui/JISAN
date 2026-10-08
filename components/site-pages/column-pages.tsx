import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCases, getColumn, getColumns } from "@/lib/content"
import { centers } from "@/lib/centers"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { SectionHead } from "@/components/main/section-head"
import { ColumnBody, ColumnByline, ColumnCard, ColumnRow } from "@/components/column-parts"
import { ColumnBrowser, type ColumnLite } from "@/components/column-browser"
import { SampleNote } from "@/components/sample-note"
import { foreignAlternates } from "@/components/site-pages/meta"
import type { Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { COLUMN_KEYS, clientDict } from "@/lib/i18n/client-keys"
import { lawyerName } from "@/lib/lawyer-name"

export function columnsMetadata(lang: Lang): Metadata {
  const t = T(lang)
  return {
    title: t("칼럼"),
    description: t("형사·가사·기업·의료·부동산·민사 사건을 맡는 변호사들이 직접 쓴 글입니다. 센터별로 모아 볼 수 있습니다."),
    alternates: foreignAlternates(lang, "/column"),
  }
}

export async function ColumnsPage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const dict = clientDict(lang, COLUMN_KEYS)
  const list = await getColumns({ lang })
  /** 목록에는 본문을 빼고 보냄 (글이 많아도 가볍게) */
  const items: ColumnLite[] = list.map(({ id, title, summary, field, centers, author, date, sample }) => ({ id, title, summary, field, centers, author, date, sample }))
  // 외국어 사이트에는 센터별 단추를 두지 않음 (센터가 번역돼 있지 않음)
  const centerList = lang === "ko" ? centers.map((c) => ({ slug: c.slug, name: c.name })) : []
  return (
    <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          title={t("칼럼")}
          as="h1"
          desc={lang === "ko" ? "사건을 맡는 변호사가 직접 씁니다. 센터별로 골라 보거나 찾는 말로 검색해 보세요." : t("사건을 맡는 변호사가 직접 씁니다. 찾는 말로 검색해 보세요.")}
        />
        <SampleNote show={list.some((c) => c.sample)} className="mb-4" lang={lang} />
        {list.length > 0 ? (
          <Suspense
            fallback={
              <div className="border-t border-jisan-ink">
                {list.slice(0, 20).map((c) => (
                  <ColumnRow key={c.id} c={c} lang={lang} dict={dict} />
                ))}
              </div>
            }
          >
            <ColumnBrowser items={items} centers={centerList} lang={lang} dict={dict} />
          </Suspense>
        ) : (
          <p className="py-10 text-[0.9375rem] text-[#4A505A]">{t("첫 칼럼을 준비하고 있습니다.")}</p>
        )}
      </div>
    </div>
  )
}

export async function columnMetadata(lang: Lang, id: string): Promise<Metadata> {
  const c = await getColumn(id, lang)
  if (!c) return {}
  const author = getLawyer(c.author)
  return {
    title: c.title,
    description: c.summary,
    alternates: foreignAlternates(lang, `/column/${c.id}`),
    openGraph: { type: "article", title: c.title, description: c.summary, publishedTime: c.date, authors: author ? [lawyerName(author, lang)] : undefined },
  }
}

export async function ColumnPage({ lang, id }: { lang: Lang; id: string }) {
  const t = T(lang)
  const ko = lang === "ko"
  const dict = clientDict(lang, COLUMN_KEYS)
  const c = await getColumn(id, lang)
  if (!c) notFound()
  const author = getLawyer(c.author)
  const authorName = author ? lawyerName(author, lang) : ""
  const sameCenter = c.centers?.[0] ? await getColumns({ center: c.centers[0], lang }) : []
  const more = [...sameCenter, ...(await getColumns({ field: c.field, lang }))].filter((x, i, arr) => x.id !== c.id && arr.findIndex((y) => y.id === x.id) === i).slice(0, 3)
  const cases = await getCases({ field: c.field, limit: 3, lang })
  const site = siteConfig.siteUrl

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.title,
        description: c.summary,
        datePublished: c.date,
        inLanguage: lang,
        author: author ? { "@type": "Person", name: authorName, jobTitle: t(author.title), url: `${site}${L(lang, "/lawyers")}#${author.slug}` } : undefined,
        publisher: { "@type": "LegalService", name: ko ? siteConfig.name : siteConfig.nameEn, url: site },
        mainEntityOfPage: `${site}${L(lang, "/column")}/${c.id}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("칼럼"), item: `${site}${L(lang, "/column")}` },
          { "@type": "ListItem", position: 2, name: c.title, item: `${site}${L(lang, "/column")}/${c.id}` },
        ],
      },
    ],
  }

  return (
    <article className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-[#4A505A]">
          <Link href={L(lang, "/column")} className="underline underline-offset-4">
            {t("칼럼")}
          </Link>
          <span className="mx-2 text-[#B0B5BC]">/</span>
          <span className="font-bold text-brand-accent">{t(c.field)}</span>
        </p>
        <SampleNote show={Boolean(c.sample)} className="mt-3" lang={lang} />
        <h1 className="mt-3 text-[1.875rem] md:text-[2.375rem] font-bold leading-[1.35] tracking-[-0.03em] text-jisan-ink text-balance">
          {c.title}
        </h1>
        <div className="mt-5 border-y border-[#E4E6E9] py-4">
          <ColumnByline slug={c.author} date={c.date} size="md" dict={dict} />
        </div>
        <div className="mt-8">
          <ColumnBody blocks={c.body} />
        </div>

        {author && (
          <aside className="mt-12 bg-brand-paper p-6">
            <ColumnByline slug={author.slug} size="md" dict={dict} />
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-[#2D323A]">{t("{field} 사건을 맡고 있습니다.", { field: t(author.field) })}</p>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link href={`${L(lang, "/consult")}?type=${encodeURIComponent(t(c.field))}`} className="text-brand-accent underline underline-offset-4">
                {t("{name} 변호사에게 상담", { name: authorName })}
              </Link>
              <Link href={`${L(lang, "/lawyers")}#${author.slug}`} className="text-jisan-ink underline underline-offset-4">
                {t("경력 보기")}
              </Link>
              {ko && author.blogUrl && (
                <a href={author.blogUrl} target="_blank" rel="noopener noreferrer" className="text-jisan-ink underline underline-offset-4">
                  {author.name} 변호사 블로그
                </a>
              )}
            </p>
          </aside>
        )}

        {cases.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-jisan-ink">{t("{field} 업무사례", { field: t(c.field) })}</h2>
            <ul className="mt-3 border-t border-jisan-ink">
              {cases.map((x) => (
                <li key={x.id} className="border-b border-[#E4E6E9] py-3 text-[0.9375rem]">
                  <Link href={`${L(lang, "/cases")}/${x.id}`} className="hover:underline underline-offset-4">
                    {x.situation} <b className="ml-1 text-brand-accent">{x.result}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs leading-relaxed text-[#8A9099]">
          {t("이 글은 일반적인 정보를 알려 드리기 위한 것으로, 개별 사건에 대한 법률 자문이 아닙니다. 사건마다 사정이 다르니 상담을 받아 보시기 바랍니다.")}
        </p>
      </div>

      {more.length > 0 && (
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="mb-5 text-lg font-bold text-jisan-ink">{t("{field} 칼럼 더 보기", { field: t(c.field) })}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {more.map((x) => (
              <ColumnCard key={x.id} c={x} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
