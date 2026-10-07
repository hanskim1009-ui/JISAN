import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCases, getColumn, getColumns } from "@/lib/content"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { ColumnBody, ColumnByline, ColumnCard } from "@/components/column-parts"
import { SampleNote } from "@/components/sample-note"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getColumns().map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getColumn((await params).id)
  if (!c) return {}
  const author = getLawyer(c.author)
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/column/${c.id}` },
    openGraph: { type: "article", title: c.title, description: c.summary, publishedTime: c.date, authors: author ? [author.name] : undefined },
  }
}

export default async function ColumnPage({ params }: Props) {
  const c = getColumn((await params).id)
  if (!c) notFound()
  const author = getLawyer(c.author)
  const sameCenter = c.centers?.[0] ? getColumns({ center: c.centers[0] }) : []
  const more = [...sameCenter, ...getColumns({ field: c.field })].filter((x, i, arr) => x.id !== c.id && arr.findIndex((y) => y.id === x.id) === i).slice(0, 3)
  const cases = getCases({ field: c.field, limit: 3 })

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.title,
        description: c.summary,
        datePublished: c.date,
        author: author ? { "@type": "Person", name: author.name, jobTitle: author.title, url: `${siteConfig.siteUrl}/lawyers#${author.slug}` } : undefined,
        publisher: { "@type": "LegalService", name: siteConfig.name, url: siteConfig.siteUrl },
        mainEntityOfPage: `${siteConfig.siteUrl}/column/${c.id}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "칼럼", item: `${siteConfig.siteUrl}/column` },
          { "@type": "ListItem", position: 2, name: c.title, item: `${siteConfig.siteUrl}/column/${c.id}` },
        ],
      },
    ],
  }

  return (
    <article className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-[#4A505A]">
          <Link href="/column" className="underline underline-offset-4">
            칼럼
          </Link>
          <span className="mx-2 text-[#B0B5BC]">/</span>
          <span className="font-bold text-brand-accent">{c.field}</span>
        </p>
        <SampleNote show={Boolean(c.sample)} className="mt-3" />
        <h1 className="mt-3 text-[1.875rem] md:text-[2.375rem] font-bold leading-[1.35] tracking-[-0.03em] text-jisan-ink text-balance">
          {c.title}
        </h1>
        <div className="mt-5 border-y border-[#E4E6E9] py-4">
          <ColumnByline slug={c.author} date={c.date} size="md" />
        </div>
        <div className="mt-8">
          <ColumnBody blocks={c.body} />
        </div>

        {author && (
          <aside className="mt-12 bg-brand-paper p-6">
            <ColumnByline slug={author.slug} size="md" />
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-[#2D323A]">{author.field} 사건을 맡고 있습니다.</p>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link href={`/consult?type=${encodeURIComponent(c.field)}`} className="text-brand-accent underline underline-offset-4">
                {author.name} 변호사에게 상담
              </Link>
              <Link href={`/lawyers#${author.slug}`} className="text-jisan-ink underline underline-offset-4">
                경력 보기
              </Link>
              {author.blogUrl && (
                <a href={author.blogUrl} target="_blank" rel="noopener noreferrer" className="text-jisan-ink underline underline-offset-4">
                  {author.name} 변호사 블로그
                </a>
              )}
            </p>
          </aside>
        )}

        {cases.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-jisan-ink">{c.field} 업무사례</h2>
            <ul className="mt-3 border-t border-jisan-ink">
              {cases.map((x) => (
                <li key={x.id} className="border-b border-[#E4E6E9] py-3 text-[0.9375rem]">
                  <Link href={`/cases/${x.id}`} className="hover:underline underline-offset-4">
                    {x.situation} <b className="ml-1 text-brand-accent">{x.result}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs leading-relaxed text-[#8A9099]">
          이 글은 일반적인 정보를 알려 드리기 위한 것으로, 개별 사건에 대한 법률 자문이 아닙니다. 사건마다 사정이 다르니 상담을 받아 보시기 바랍니다.
        </p>
      </div>

      {more.length > 0 && (
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="mb-5 text-lg font-bold text-jisan-ink">{c.field} 칼럼 더 보기</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {more.map((x) => (
              <ColumnCard key={x.id} c={x} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
