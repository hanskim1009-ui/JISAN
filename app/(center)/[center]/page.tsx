import type { Metadata } from "next"
import { HREFLANG, type Lang } from "@/lib/langs"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, MessageCircle, Phone, Plus } from "lucide-react"
import { allCenters, centerBase, getCenter } from "@/lib/centers"
import { getLawyer, lawyers as allLawyers } from "@/lib/lawyers"
import { lawyerI18n } from "@/lib/lawyers-i18n"
import { IntroParas } from "@/components/center/intro-paras"
import { centerText, officeAddr, officeName } from "@/lib/center-i18n"
import { openOffices, siteConfig } from "@/lib/site-config"
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
import { PROFILE_TEXT } from "@/lib/center-profile-text"
import { T, L as L_ } from "@/lib/i18n/t"
import { COLUMN_KEYS, clientDict } from "@/lib/i18n/client-keys"
import type { CaseField } from "@/lib/content"

/** 외국어판 센터 → 보여 줄 칼럼 분야 */
const INTL_FIELD: Record<string, CaseField> = { crime: "형사", family: "가사" }

type Props = { params: Promise<{ center: string }> }

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  return allCenters.map((c) => ({ center: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = getCenter((await params).center)
  if (!center) return {}
  const url = centerBase(center)
  return {
    title: { absolute: center.seo.title },
    description: center.seo.description,
    keywords: center.seo.keywords,
    alternates: {
      canonical: url,
      ...(center.alternates ? { languages: Object.fromEntries(Object.entries(center.alternates).map(([l, h]) => [HREFLANG[l as Lang], h])) } : {}),
    },
    openGraph: {
      type: "website",
      locale: ({ en: "en_US", zh: "zh_CN", vi: "vi_VN", ru: "ru_RU", mn: "mn_MN" } as Record<string, string>)[center.lang ?? ""] ?? "ko_KR",
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
  const L = centerText(center.lang)
  const P = PROFILE_TEXT[center.lang ?? "ko"]
  const foreign = Boolean(center.lang && center.lang !== "ko")
  const base = centerBase(center)
  // 업무사례·칼럼은 한국어만 있어 외국어판에서는 숨김
  const cases = foreign ? [] : await getCases({ center: center.slug })
  // 외국어판: 그 언어로 옮긴 칼럼 중 센터 분야 글 (외국인센터는 전부)
  const colOpts = foreign
    ? { lang: center.lang, ...(INTL_FIELD[center.slug.replace(/-[a-z]{2}$/, "")] ? { field: INTL_FIELD[center.slug.replace(/-[a-z]{2}$/, "")] } : {}) }
    : { center: center.slug }
  const columns = await getColumns({ ...colOpts, limit: 6 })
  const columnTotal = (await getColumns(colOpts)).length
  const colDict = foreign ? clientDict(center.lang!, COLUMN_KEYS) : undefined
  const tt = T(center.lang ?? "ko")
  const posts = center.blog ? await getNaverBlogPosts(center.blog.id, 6) : []
  const lawyers = center.lawyers.flatMap((cl) => {
    const l = getLawyer(cl.slug)
    if (!l) return []
    const i = lawyerI18n(cl.slug, center.lang)
    return [{ ...l, note: cl.note, ...(i ? { name: i.name, title: i.title, summary: i.bio } : {}) }]
  })
  /** 주력 변호사가 아닌 나머지 구성원도 모두 보여 줍니다 (사건에 따라 함께 봄) */
  const others = allLawyers
    .filter((l) => !foreign && !center.lawyers.some((cl) => cl.slug === l.slug))
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
          { "@type": "ListItem", position: 2, name: center.name, item: `${siteConfig.siteUrl}${base}` },
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
            <IntroParas paras={center.intro.body} moreLabel={L.showAll} />
          </div>
        </section>
      )}

      {/* 이런 분께 필요합니다 */}
      {center.situations && (
        <section id="situations" className={`${sectionPad} ${bg("situations")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.situations.title}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
              {center.situations.items.map((it, i) => (
                <li
                  key={it}
                  className={`${i >= 4 ? "hidden md:flex" : "flex"} items-start gap-3 rounded-xl border border-[#E2E6ED] bg-white px-4 py-3.5 text-[0.9375rem] text-jisan-ink`}
                >
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
          <AreaBrowser groups={areaGroups} accent={t.accent} lang={center.lang} />
        </div>
      </section>

      {/* 기준표 (처벌 기준, 처분 종류, 요건 비교 등) */}
      {center.table && (
        <section id="table" className={`${sectionPad} ${bg("table")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.table.title}</h2>
            <DataTable table={center.table} className="mt-8" lang={center.lang} />
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
          <h2 className={h2}>{L.processTitle}</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">{L.processLead(center.form.caseType)}</p>
          <div className="mt-8">
            <ProcessTabs processes={pages?.processes ?? center.processes} accent={t.accent} lang={center.lang} />
          </div>
        </div>
      </section>

      {/* 상황별 안내 글 */}
      {guides.length > 0 && (
        <section id="guides" className={`${sectionPad} ${bg("guides")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{L.guides}</h2>
            <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">{L.guidesLead}</p>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {guides.slice(0, 6).map((g, i) => (
                <li key={g.slug} className={i >= 3 ? "hidden md:block" : undefined}>
                  <Link
                    href={g.href}
                    className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-5 md:p-6"
                  >
                    <span className={`text-xs font-bold ${t.accent}`}>{L.guideKicker(center.name)}</span>
                    <span className="mt-2 text-lg font-bold tracking-tight text-jisan-ink md:text-xl">{g.title}</span>
                    <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-jisan-ink/65 md:line-clamp-none">{g.lead}</span>
                    <span className={`mt-auto hidden pt-5 text-sm font-semibold md:block ${t.accent}`}>
                      {L.read} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {guideTotal > 3 && (
              <Link href={`${base}/guide`} className={`mt-6 inline-block text-sm font-semibold ${t.accent} ${guideTotal > 6 ? "" : "md:hidden"}`}>
                {L.allGuidesN(guideTotal)}&nbsp;→
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 업무사례 (이 센터로 지정된 것만) */}
      {cases.length > 0 && (
        <section id="cases" className={`${sectionPad} ${bg("cases")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{L.casesOf(center.name)}</h2>
            <p className="mt-2 mb-6 text-[0.9375rem] text-jisan-ink/70">{L.casesLead}</p>
            <SampleNote show={cases.some((c) => c.sample)} className="mb-4" />
            <CasesTable items={cases} tabs={false} />
            <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">{L.casesNote}</p>
          </div>
        </section>
      )}

      {/* 담당 변호사 */}
      <section id="lawyers" className={`${sectionPad} ${bg("lawyers")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{L.lawyersOf(center.name)}</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">
            {L.lawyersLead(foreign ? siteConfig.nameEn : siteConfig.shortName, allLawyers.length, center.name)}
          </p>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((l) => (
              <li key={l.slug} className="card-lift min-w-0 flex gap-5 rounded-2xl bg-white border border-[#E2E6ED] p-4">
                <div className="relative w-28 md:w-36 shrink-0 aspect-[3/4] overflow-hidden rounded-xl bg-[#2a3348]">
                  <LawyerPhoto src={l.image} name={l.name} imageClassName={l.photoImageClassName} sizes="144px" />
                </div>
                <div className="min-w-0 py-1">
                  <span className="inline-block rounded-full bg-jisan-ink px-2.5 py-0.5 text-xs font-bold text-white">{L.lead}</span>
                  <p className="mt-2 text-lg font-bold text-jisan-ink">
                    <Link href={`${base}/lawyers/${l.slug}`} className="hover:underline underline-offset-4">{l.name}</Link>{" "}
                    <span className="text-sm font-medium text-muted-foreground">{l.title}</span>
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-jisan-ink/80">{l.note}</p>
                  <p className="mt-2 hidden text-sm leading-relaxed text-jisan-ink/70 line-clamp-4 sm:[display:-webkit-box]">{l.summary}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                    <Link href={`${base}/lawyers/${l.slug}`} className={t.accent}>
                      {P.view}&nbsp;→
                    </Link>
                    <a href="#consult" className="text-jisan-ink/60 hover:text-jisan-ink">
                      {L.askThis}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {others.length > 0 && (
            <>
              <h3 className="mt-12 text-lg font-bold text-jisan-ink">{L.coLawyers}</h3>
              <ul className="no-scrollbar -mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {others.map((l) => (
                  <li key={l.slug} className="card-lift w-[42%] min-w-0 shrink-0 snap-start overflow-hidden rounded-2xl bg-white border border-[#E2E6ED] sm:w-auto">
                    <Link href={`${base}/lawyers/${l.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#2a3348]">
                      <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top" sizes="(max-width: 640px) 50vw, 25vw" initialClassName="text-5xl" />
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-bold text-jisan-ink/60">{l.field}</p>
                      <p className="mt-0.5 font-bold text-jisan-ink">
                        {l.name} <span className="text-[0.8125rem] font-medium text-muted-foreground">{l.title}</span>
                      </p>
                      {l.line && <p className="mt-1 text-[0.8125rem] leading-snug text-jisan-ink/70">{l.line}</p>}
                      <p className={`mt-1.5 text-[0.8125rem] font-semibold ${t.accent}`}>{P.view}&nbsp;→</p>
                    </div>
                    </Link>
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
                {L.blogAll}
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
            <h2 className={h2}>{foreign ? tt("칼럼") : `${center.name} 칼럼`}</h2>
            <SampleNote show={columns.some((c) => c.sample)} className="mt-3" />
            <div className="mt-6 border-t border-jisan-ink">
              {columns.map((c, i) => (
                <div key={c.id} className={i >= 3 ? "hidden md:block" : undefined}>
                  <ColumnRow c={c} lang={center.lang} dict={colDict} />
                </div>
              ))}
            </div>
            {foreign ? (
              <Link href={L_(center.lang!, "/column")} className={`mt-6 inline-block text-sm font-semibold ${t.accent}`}>
                {tt("칼럼")}&nbsp;→
              </Link>
            ) : (
              columnTotal > columns.length && (
                <Link href={`/column?center=${center.slug}`} className={`mt-6 inline-block text-sm font-semibold ${t.accent}`}>
                  {center.name} 칼럼 {columnTotal}편 모두 보기&nbsp;→
                </Link>
              )
            )}
          </div>
        </section>
      )}

      {/* 자주 묻는 질문 */}
      <section id="faq" className={`${sectionPad} ${bg("faq")}`}>
        <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
          <div>
            <h2 className={h2}>{L.faq}</h2>
            <p className="mt-3 text-sm text-jisan-ink/65">{L.faqLead}</p>
            <a href="#consult" className="mt-5 inline-block bg-jisan-blue px-5 py-2.5 text-sm font-semibold text-white">
              {L.consult}
            </a>
          </div>
          <div className="min-w-0 space-y-10">
            <FaqList items={center.faqs} />
            {faqCount > 0 && (
              <Link href={`${base}/faq`} className={`inline-block text-sm font-semibold ${t.accent}`}>
                {L.moreFaqN(faqCount)}&nbsp;→
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 상담 */}
      {/* 사무소 안내 (주사무소 + 분사무소) */}
      <section id="offices" className={`${sectionPad} ${bg("offices")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{L.offices}</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">
            {L.officesLead(center.name, openOffices.length)}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {openOffices.map((o) => (
              <li key={o.name} className={`border border-[#E2E6ED] bg-white p-5 ${o.address ? "" : "hidden sm:block"}`}>
                <p className="text-lg font-bold text-jisan-ink">{officeName(o.name, center.lang)}</p>
                <p className="mt-2 text-sm leading-relaxed text-jisan-ink/70">{officeAddr(o, center.lang)}</p>
                <p className="mt-3 text-sm font-semibold tabular-nums text-jisan-ink">{L.callN(o.phone || siteConfig.phone)}</p>
                {o.mapUrl && (
                  <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm font-semibold ${t.accent}`}>
                    {L.map}&nbsp;→
                  </a>
                )}
              </li>
            ))}
          </ul>
          {openOffices.some((o) => !o.address) && (
            <p className="mt-3 text-sm text-jisan-ink/70 sm:hidden">
              {L.noAddrLine(openOffices.filter((o) => !o.address).map((o) => officeName(o.name, center.lang)).join(" · "), siteConfig.phone)}
            </p>
          )}
          <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">{L.officesNote}</p>
        </div>
      </section>

      <ConsultBand center={center} />
    </>
  )
}
