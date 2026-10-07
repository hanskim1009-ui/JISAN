import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { centers, getCenter } from "@/lib/centers"
import { getCenterPages, groupBy, guideCards } from "@/lib/center-pages"
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
  const groups = groupBy(guideCards(center.slug, (s) => getCenter(s)?.name.replace(/센터$/, "")))
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
        <div className="max-w-7xl mx-auto">
          {groups.length > 1 && (
            <nav
              aria-label="안내 글 묶음"
              className="no-scrollbar sticky top-[4.625rem] z-10 -mx-6 mb-8 flex gap-2 overflow-x-auto bg-white/95 px-6 py-3 backdrop-blur md:static md:mx-0 md:mb-10 md:flex-wrap md:overflow-visible md:bg-transparent md:p-0"
            >
              {groups.map((g, i) => (
                <a
                  key={g.group}
                  href={`#g${i}`}
                  className="shrink-0 whitespace-nowrap rounded-full border border-[#D5DAE1] bg-white px-4 py-2 text-[0.875rem] font-semibold text-jisan-ink/75 hover:border-jisan-ink/50"
                >
                  {g.group} <span className="ml-1 text-[0.75rem] tabular-nums text-jisan-ink/40">{g.items.length}</span>
                </a>
              ))}
            </nav>
          )}
          <div className="space-y-14">
            {groups.map((g, i) => (
              <section key={g.group} id={`g${i}`} className="scroll-mt-36 md:scroll-mt-28">
                {groups.length > 1 && <h2 className="mb-5 text-xl font-bold tracking-tight text-jisan-ink">{g.group}</h2>}
                <ul data-reveal className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link href={c.href} className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-4 md:p-6">
                        <span className="text-[1.0625rem] font-bold tracking-tight text-jisan-ink md:text-lg">{c.title}</span>
                        <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-jisan-ink/65 md:mt-2 md:line-clamp-none">{c.lead}</span>
                        <span className={`mt-auto hidden pt-5 text-sm font-semibold md:block ${t.accent}`}>
                          읽어 보기 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
      <ConsultBand center={center} />
    </>
  )
}
