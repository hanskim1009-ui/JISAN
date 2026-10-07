import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, MessageCircle, Phone, Plus } from "lucide-react"
import { centers, getCenter } from "@/lib/centers"
import { getLawyer, lawyers as allLawyers } from "@/lib/lawyers"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
import { CenterHero } from "@/components/center/center-hero"
import { ConsultBand } from "@/components/center/consult-band"
import { FaqList } from "@/components/center/faq-list"
import { ProcessTabs } from "@/components/center/process-tabs"
import { DataTable } from "@/components/center/data-table"
import { areaCards, getCenterPages, groupBy, guideCards } from "@/lib/center-pages"
import { AreaBrowser } from "@/components/center/area-browser"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { ConsultForm } from "@/components/consult-form"
import { CasesTable } from "@/components/cases-table"
import { BlogList } from "@/components/blog-list"
import { getCases, getColumns } from "@/lib/content"
import { ColumnRow } from "@/components/column-parts"
import { getNaverBlogPosts } from "@/lib/feeds"
import { SampleNote } from "@/components/sample-note"

type Props = { params: Promise<{ center: string }> }

export const dynamicParams = false
export const revalidate = 3600

export function generateStaticParams() {
  return centers.map((c) => ({ center: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = getCenter((await params).center)
  if (!center) return {}
  const url = `/${center.slug}`
  return {
    title: { absolute: center.seo.title },
    description: center.seo.description,
    keywords: center.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: `${siteConfig.shortName} ${center.name}`,
      title: center.seo.title,
      description: center.seo.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${siteConfig.shortName} ${center.name}` }],
    },
  }
}

const sectionPad = "screen px-6 md:px-12 lg:px-20 py-16 md:py-24 scroll-mt-20"
const h2 = "text-2xl md:text-[2rem] font-bold tracking-tight text-jisan-ink leading-tight"

export default async function CenterPage({ params }: Props) {
  const center = getCenter((await params).center)
  if (!center) notFound()
  const t = centerTones[center.tone]
  const cases = getCases({ center: center.slug })
  const columns = getColumns({ center: center.slug, limit: 4 })
  const posts = center.blog ? await getNaverBlogPosts(center.blog.id, 6) : []
  const lawyers = center.lawyers.flatMap((cl) => {
    const l = getLawyer(cl.slug)
    return l ? [{ ...l, note: cl.note }] : []
  })
  /** 주력 변호사가 아닌 나머지 구성원도 모두 보여 줍니다 (사건에 따라 함께 봄) */
  const others = allLawyers
    .filter((l) => !center.lawyers.some((cl) => cl.slug === l.slug))
    .map((l) => ({ ...l, line: (l.career ?? l.structuredResume?.career ?? []).find((c) => !c.includes(siteConfig.name)) }))

  const pages = getCenterPages(center.slug)
  const nameOf = (slug: string) => getCenter(slug)?.name.replace(/센터$/, "")
  const areaGroups = groupBy(areaCards(center.slug, center.areas, nameOf))
  /** 센터 첫 화면에는 상황 버튼과 연결된 글을 먼저, 나머지는 모음 페이지에서 */
  const ownGuides = guideCards(center.slug, nameOf, false)
  const guides = [...ownGuides.filter((g) => g.stage), ...ownGuides.filter((g) => !g.stage)]
  const guideTotal = guideCards(center.slug, nameOf).length
  const faqCount = pages?.moreFaqs.length ?? 0

  /** 섹션 바탕: 보이는 섹션 순서대로 흰색/옅은 색을 번갈아 */
  const shown = [
    center.intro && "intro",
    center.situations && "situations",
    "areas",
    center.table && "table",
    center.points && "points",
    "process",
    guides.length > 0 && "guides",
    cases.length > 0 && "cases",
    "lawyers",
    columns.length > 0 && "column",
    "faq",
    "offices",
  ].filter(Boolean) as string[]
  const bg = (id: string) => (shown.indexOf(id) % 2 === 0 ? "bg-white" : t.alt)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.siteUrl },
          { "@type": "ListItem", position: 2, name: center.name, item: `${siteConfig.siteUrl}/${center.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: center.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 첫 화면: 센터 소개 + 사건 단계 선택 */}
      <CenterHero center={center} />

      {/* 센터 소개 */}
      {center.intro && (
        <section id="intro" className={`${sectionPad} ${bg("intro")}`}>
          <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr]">
            <h2 className={`${h2} whitespace-pre-line`}>{center.intro.title}</h2>
            <div className="space-y-4 text-[1rem] leading-[1.85] text-jisan-ink/80">
              {center.intro.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 이런 분께 필요합니다 */}
      {center.situations && (
        <section id="situations" className={`${sectionPad} ${bg("situations")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.situations.title}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
              {center.situations.items.map((it) => (
                <li key={it} className="flex items-start gap-3 rounded-xl border border-[#E2E6ED] bg-white px-4 py-3.5 text-[0.9375rem] text-jisan-ink">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.accent}`} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 업무분야 */}
      <section id="areas" className={`${sectionPad} ${bg("areas")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{center.areasTitle}</h2>
          <AreaBrowser groups={areaGroups} accent={t.accent} />
        </div>
      </section>

      {/* 기준표 (처벌 기준, 처분 종류, 요건 비교 등) */}
      {center.table && (
        <section id="table" className={`${sectionPad} ${bg("table")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.table.title}</h2>
            <DataTable table={center.table} className="mt-8" />
          </div>
        </section>
      )}

      {/* 대응 원칙 · 중요한 이유 */}
      {center.points && (
        <section id="points" className={`${sectionPad} ${bg("points")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.points.title}</h2>
            <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {center.points.items.map((p, i) => (
                <li key={p.title} className="border-t-2 border-jisan-ink bg-white p-5">
                  <span className={`text-sm font-bold tabular-nums ${t.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-lg font-bold text-jisan-ink">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-jisan-ink/70">{p.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 대응 절차 */}
      <section id="process" className={`${sectionPad} ${bg("process")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>사건 진행 절차</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">{center.form.caseType} 사건, 단계별로 어떻게 대응하는지 알려드립니다.</p>
          <div className="mt-8">
            <ProcessTabs processes={pages?.processes ?? center.processes} accent={t.accent} />
          </div>
        </div>
      </section>

      {/* 상황별 안내 글 */}
      {guides.length > 0 && (
        <section id="guides" className={`${sectionPad} ${bg("guides")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>상황별 안내</h2>
            <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">처음 겪는 일이라 막막할 때, 무엇부터 해야 하는지 정리했습니다.</p>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {guides.slice(0, 6).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={g.href}
                    className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-6"
                  >
                    <span className={`text-xs font-bold ${t.accent}`}>{center.name} 안내</span>
                    <span className="mt-2 text-xl font-bold tracking-tight text-jisan-ink">{g.title}</span>
                    <span className="mt-2 text-sm leading-relaxed text-jisan-ink/65">{g.lead}</span>
                    <span className={`mt-auto pt-5 text-sm font-semibold ${t.accent}`}>
                      읽어 보기 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {guideTotal > 6 && (
              <Link href={`/${center.slug}/guide`} className={`mt-6 inline-block text-sm font-semibold ${t.accent}`}>
                안내 글 {guideTotal}편 모두 보기 →
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 업무사례 (이 센터로 지정된 것만) */}
      {cases.length > 0 && (
        <section id="cases" className={`${sectionPad} ${bg("cases")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.name} 업무사례</h2>
            <p className="mt-2 mb-6 text-[0.9375rem] text-jisan-ink/70">나와 비슷한 사건을 어떻게 해결했는지 확인해 보세요.</p>
            <SampleNote show={cases.some((c) => c.sample)} className="mb-4" />
            <CasesTable items={cases} tabs={false} />
            <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">※ 의뢰인의 동의를 얻은 사건만, 누구인지 알 수 없게 고쳐 공개합니다.</p>
          </div>
        </section>
      )}

      {/* 담당 변호사 */}
      <section id="lawyers" className={`${sectionPad} ${bg("lawyers")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{center.name} 변호사</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">
            {siteConfig.shortName} 변호사는 {lawyers.length + others.length}명입니다. {center.name} 사건은 주력 변호사가 맡고, 민사·가사 문제가 겹치면 해당 분야 변호사가 같이 봅니다.
          </p>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((l) => (
              <li key={l.slug} className="card-lift min-w-0 flex gap-5 rounded-2xl bg-white border border-[#E2E6ED] p-4">
                <div className="relative w-28 md:w-36 shrink-0 aspect-[3/4] overflow-hidden rounded-xl bg-[#2a3348]">
                  <LawyerPhoto src={l.image} name={l.name} imageClassName={l.photoImageClassName} sizes="144px" />
                </div>
                <div className="min-w-0 py-1">
                  <span className="inline-block rounded-full bg-jisan-ink px-2.5 py-0.5 text-xs font-bold text-white">주력</span>
                  <p className="mt-2 text-lg font-bold text-jisan-ink">
                    {l.name} <span className="text-sm font-medium text-muted-foreground">{l.title}</span>
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-jisan-ink/80">{l.note}</p>
                  <p className="mt-2 text-sm leading-relaxed text-jisan-ink/70 line-clamp-4">{l.summary}</p>
                  <a href="#consult" className={`mt-3 inline-block text-sm font-semibold ${t.accent}`}>
                    이 변호사에게 상담
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {others.length > 0 && (
            <>
              <h3 className="mt-12 text-lg font-bold text-jisan-ink">함께 사건을 보는 변호사</h3>
              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {others.map((l) => (
                  <li key={l.slug} className="card-lift min-w-0 overflow-hidden rounded-2xl bg-white border border-[#E2E6ED]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#2a3348]">
                      <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top" sizes="(max-width: 640px) 50vw, 25vw" initialClassName="text-5xl" />
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-bold text-jisan-ink/60">{l.field}</p>
                      <p className="mt-0.5 font-bold text-jisan-ink">
                        {l.name} <span className="text-[0.8125rem] font-medium text-muted-foreground">{l.title}</span>
                      </p>
                      {l.line && <p className="mt-1 text-[0.8125rem] leading-snug text-jisan-ink/70">{l.line}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* 담당 변호사 블로그 */}
      {posts.length > 0 && center.blog && (
        <section id="blog" className={`${sectionPad} ${t.band}`}>
          <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
            <div>
              <h2 className="text-2xl md:text-[2rem] font-bold tracking-tight leading-tight">{center.blog.title}</h2>
              <a
                href={`https://blog.naver.com/${center.blog.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
              >
                블로그 전체 보기
              </a>
            </div>
            <BlogList posts={posts} dark={center.tone === "dark"} />
          </div>
        </section>
      )}

      {/* 이 센터 칼럼 (홈페이지 안 글) */}
      {columns.length > 0 && (
        <section id="column" className={`${sectionPad} ${bg("column")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.name} 칼럼</h2>
            <SampleNote show={columns.some((c) => c.sample)} className="mt-3" />
            <div className="mt-6 border-t border-jisan-ink">
              {columns.map((c) => (
                <ColumnRow key={c.id} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 자주 묻는 질문 */}
      <section id="faq" className={`${sectionPad} ${bg("faq")}`}>
        <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
          <div>
            <h2 className={h2}>자주 묻는 질문</h2>
            <p className="mt-3 text-sm text-jisan-ink/65">상담 전에 가장 많이 물어보시는 질문을 모았습니다.</p>
            <a href="#consult" className="mt-5 inline-block bg-jisan-blue px-5 py-2.5 text-sm font-semibold text-white">
              상담 신청
            </a>
          </div>
          <div className="min-w-0 space-y-10">
            <FaqList items={center.faqs} />
            {faqCount > 0 && (
              <Link href={`/${center.slug}/faq`} className={`inline-block text-sm font-semibold ${t.accent}`}>
                주제별 질문 {faqCount}개 더 보기 →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 상담 */}
      {/* 사무소 안내 (주사무소 + 분사무소) */}
      <section id="offices" className={`${sectionPad} ${bg("offices")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>사무소 안내</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">
            {center.name} 사건은 {openOffices.length}곳 사무소 어디서나 상담받으실 수 있습니다. 가까운 곳으로 오세요.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {openOffices.map((o) => (
              <li key={o.name} className="border border-[#E2E6ED] bg-white p-5">
                <p className="text-lg font-bold text-jisan-ink">{o.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-jisan-ink/70">{officeAddress(o)}</p>
                <p className="mt-3 text-sm font-semibold tabular-nums text-jisan-ink">전화 {o.phone || siteConfig.phone}</p>
                {o.mapUrl && (
                  <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm font-semibold ${t.accent}`}>
                    지도 보기 →
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">상담 전화는 24시간, 주말·공휴일에도 받습니다.</p>
        </div>
      </section>

      <ConsultBand center={center} />
    </>
  )
}
