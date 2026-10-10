import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { REGION_LAWYER, getRegion, regionBase, regionLabel, type RegionSlug } from "@/lib/regions"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { LawyerPhoto } from "@/components/lawyer-photo"

export function regionAboutMetadata(slug: RegionSlug): Metadata {
  const r = getRegion(slug)
  const l = getLawyer(REGION_LAWYER)
  if (!r || !l) return {}
  const url = `${regionBase(r)}/about`
  return {
    title: { absolute: `${l.name} ${l.title} | ${siteConfig.name} ${r.name}` },
    description: l.summary.replace(/\n/g, " ").slice(0, 160),
    alternates: { canonical: url },
  }
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
          <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-jisan-ink/40" />
          <span className="min-w-0 break-keep">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** 지역 홈페이지 '소개': 김한솔 변호사 (lib/lawyers.ts 내용만) */
export function RegionAbout({ slug }: { slug: RegionSlug }) {
  const region = getRegion(slug)
  const l = getLawyer(REGION_LAWYER)
  if (!region || !l) notFound()
  const base = regionBase(region)

  return (
    <>
      <section className="bg-jisan-navy px-5 py-10 text-white md:px-12 md:py-16 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 items-end gap-8 md:grid-cols-[15rem_1fr] lg:gap-14">
          <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-2xl bg-[#2a3348] md:w-full">
            <LawyerPhoto src={l.image} name={l.name} sizes="(max-width: 768px) 160px, 240px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/65">{regionLabel(region)}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-[2.75rem]">
              {l.name} <span className="text-lg font-medium text-white/70 md:text-xl">{l.title}</span>
            </h1>
            {l.tagline && <p className="mt-3 max-w-2xl break-keep text-[1.0625rem] leading-relaxed text-white/85">{l.tagline}</p>}
            <p className="mt-2 text-sm text-white/60">주로 맡는 분야 · {l.field}</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 md:px-12 md:py-16 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="min-w-0 space-y-4 break-keep text-[1.0625rem] leading-[1.85] text-jisan-ink/85">
            {l.summary.split("\n").map((p) => (
              <p key={p}>{p}</p>
            ))}
            {l.blogUrl && (
              <a href={l.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-jisan-blue">
                {l.name} 변호사 블로그&nbsp;→
              </a>
            )}
          </div>
          <div className="min-w-0 space-y-8">
            {l.career && l.career.length > 0 && (
              <div>
                <h2 className="mb-3 border-b border-jisan-ink pb-2 text-lg font-bold text-jisan-ink">경력</h2>
                <List items={l.career} />
              </div>
            )}
            {l.highlights.length > 0 && (
              <div>
                <h2 className="mb-3 border-b border-jisan-ink pb-2 text-lg font-bold text-jisan-ink">주요 이력 · 학력</h2>
                <List items={l.highlights} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-jisan-mist px-5 py-12 md:px-12 md:py-14 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="break-keep text-lg font-bold text-jisan-ink md:text-xl">{region.name} 사건, 지금 상황부터 알려 주세요.</p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href={`${base}/consult`} className="rounded-md bg-jisan-blue px-6 py-3 text-center text-[0.9375rem] font-semibold text-white hover:bg-jisan-blue/90">
              상담 신청
            </Link>
            <Link href="/lawyers" className="rounded-md border border-jisan-ink/20 bg-white px-6 py-3 text-center text-[0.9375rem] font-semibold text-jisan-ink">
              다른 구성원 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
