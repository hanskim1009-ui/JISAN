import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCase, getCases } from "@/lib/content"
import { lawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centers } from "@/lib/centers"
import { SampleNote } from "@/components/sample-note"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = true
export const revalidate = 300

export async function generateStaticParams() {
  return (await getCases()).map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCase((await params).id)
  if (!c) return {}
  return {
    title: `${c.caseType} ${c.result} 사례`,
    description: `${c.situation} · ${c.stage} · ${c.result}. ${siteConfig.name} 업무사례.`,
    alternates: { canonical: `/cases/${c.id}` },
  }
}

export default async function CasePage({ params }: Props) {
  const c = await getCase((await params).id)
  if (!c) notFound()
  const people = lawyers.filter((l) => c.lawyers.includes(l.slug))
  const rows = [
    ["분야", `${c.field} · ${c.caseType}`],
    ["의뢰인", c.clientRole],
    ["단계", c.stage],
    ["시기", c.decidedOn],
    ["결과", c.result],
  ]

  return (
    <article className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/cases" className="text-sm text-[#4A505A] underline underline-offset-4">
          업무사례
        </Link>
        <SampleNote show={Boolean(c.sample)} className="mt-3" />
        <h1 className="mt-3 text-[1.75rem] md:text-[2.125rem] font-bold leading-[1.35] tracking-tight text-jisan-ink text-balance">
          {c.situation}
        </h1>
        <dl className="mt-6 border-t-2 border-jisan-ink text-[0.9375rem]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-[#E4E6E9] py-2.5">
              <dt className="text-[#8A9099]">{k}</dt>
              <dd className={k === "결과" ? "font-bold text-brand-accent" : "text-jisan-ink"}>{v}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-10 text-lg font-bold text-jisan-ink">쟁점</h2>
        <p className="mt-2 text-[1rem] leading-[1.85] text-[#2D323A] whitespace-pre-line">{c.issue}</p>
        <h2 className="mt-8 text-lg font-bold text-jisan-ink">한 일</h2>
        <p className="mt-2 text-[1rem] leading-[1.85] text-[#2D323A] whitespace-pre-line">{c.work}</p>
        <p className="mt-10 border-t border-[#E4E6E9] pt-4 text-sm text-[#4A505A]">
          담당{" "}
          {people.map((l, i) => (
            <span key={l.slug}>
              {i > 0 && ", "}
              <Link href={`/lawyers#${l.slug}`} className="font-semibold text-jisan-ink underline underline-offset-4">
                {l.name} {l.title}
              </Link>
            </span>
          ))}
          {c.centers?.map((slug) => (
            <span key={slug}>
              {" · "}
              <Link href={`/${slug}`} className="underline underline-offset-4">
                {centers.find((x) => x.slug === slug)?.name}
              </Link>
            </span>
          ))}
        </p>
        <p className="mt-3 text-xs text-[#8A9099]">의뢰인의 동의를 받아 누구인지 알 수 없게 고쳐 실었습니다. 같은 결과를 약속하지 않습니다.</p>
      </div>
    </article>
  )
}
