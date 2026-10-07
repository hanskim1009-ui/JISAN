import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { centers, getCenter } from "@/lib/centers"
import { getCenterPages } from "@/lib/center-pages"
import { siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
import { SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"

type Props = { params: Promise<{ center: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return centers.filter((c) => (getCenterPages(c.slug)?.guides.length ?? 0) > 0).map((c) => ({ center: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = getCenter((await params).center)
  if (!center) return {}
  const title = `${center.name} 상황별 안내 | ${siteConfig.shortName}`
  return { title: { absolute: title }, description: `${center.name}에서 정리한 상황별 대응 안내 글 모음`, alternates: { canonical: `/${center.slug}/guide` } }
}

/** 상황별 안내 글 모음: /센터/guide */
export default async function GuideIndex({ params }: Props) {
  const center = getCenter((await params).center)
  const pages = center && getCenterPages(center.slug)
  if (!center || !pages || pages.guides.length === 0) notFound()
  const t = centerTones[center.tone]
  return (
    <>
      <SubHero
        center={center}
        crumbs={[{ label: center.name, href: `/${center.slug}` }, { label: "상황별 안내" }]}
        kicker={`${center.name} 상황별 안내`}
        title="처음 겪는 일이라 막막할 때"
        lead="지금 겪고 있는 상황과 가까운 글부터 읽어 보세요. 무엇을 먼저 하고, 무엇을 하지 말아야 하는지 순서대로 정리했습니다."
      />
      <div className="bg-white px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <ul data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/${center.slug}/guide/${g.slug}`} className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-6">
                <span className="text-lg font-bold tracking-tight text-jisan-ink">{g.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-jisan-ink/65">{g.lead}</span>
                <span className={`mt-auto pt-5 text-sm font-semibold ${t.accent}`}>
                  읽어 보기 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ConsultBand center={center} />
    </>
  )
}
