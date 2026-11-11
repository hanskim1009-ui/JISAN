import type { Metadata } from "next"
import { HREFLANG, type Lang } from "@/lib/langs"
import Link from "next/link"
import { getVisaUi, visaList } from "@/lib/visa"
import { toolsFor } from "@/components/tools/pages/tools-list"
import { toolText } from "@/lib/tools/i18n"
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
import { Fragment } from "react"
import { LeadHero } from "@/components/center/lead-hero"
import { LeadSection, TeamFigure } from "@/components/center/prosecutor-section"
import { Fold } from "@/components/center/fold"
import { leadFor } from "@/lib/lead-lawyers"
import { searchHints } from "@/lib/prosecutor"
import { HeroSearch } from "@/components/main/hero-search"
import { stageGuideHref } from "@/lib/center-pages"
import { BlogList } from "@/components/blog-list"
import { getCases, getColumns, pickVaried } from "@/lib/content"
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
  /** 형사 계열 센터: 대표변호사 첫 화면 + 검사 경력 구역 + 짧아진 순서 */
  const leadLawyer = foreign ? undefined : leadFor(center.slug)
  const lead = Boolean(leadLawyer)
  /** 외국인센터: 체류자격별 안내로 연결 (그 언어 번역이 있을 때) */
  const centerLang = (center.lang ?? "ko") as Lang
  const visaUi = center.slug.startsWith("foreigner") && visaList(centerLang).length > 0 ? getVisaUi(centerLang) : undefined
  const visaHref = centerLang === "ko" ? "/visa" : `/${centerLang}/visa`
  /** 형사·외국인센터: 계산기 목록으로 연결 (그 언어로 계산기가 있을 때) */
  const kindOf = center.slug.replace(/-[a-z]{2}$/, "")
  const toolList = kindOf === "crime" || kindOf === "foreigner" ? toolsFor(centerLang) : []
  const toolsCommon = toolText(centerLang, "common")
  const toolsCard =
    toolList.length > 0 && toolsCommon
      ? {
          href: centerLang === "ko" ? "/tools" : `/${centerLang}/tools`,
          title: toolsCommon.list.title,
          sub: toolList
            .filter((x) => ["prosecution", "sentencing", "police-summons", "drunk-driving"].includes(x.id))
            .map((x) => toolsCommon.tools[x.id]?.title ?? "")
            .filter(Boolean)
            .slice(0, 3)
            .join(" · "),
        }
      : null
  const base = centerBase(center)
  // 업무사례·칼럼은 한국어만 있어 외국어판에서는 숨김
  const centerCases = foreign ? [] : await getCases({ center: center.slug })
  // 형사센터처럼 여러 갈래가 모이는 곳은 갈래를 섞어서, 한 갈래뿐인 센터는 앞에서부터 8건
  const cases = pickVaried(centerCases, lead ? 6 : 8)
  const caseGroups = [...new Set(centerCases.map((c) => c.group).filter(Boolean))]
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

  /**
   * 구역 순서. 앞 변호사가 정해진 센터(lib/lead-lawyers.ts)는 누가 맡는지와 사례를 앞에, 긴 목록은 뒤에 접어 둡니다.
   * 그 밖의 센터는 원래 순서 그대로.
   */
  const order = lead
    ? ["hero", "stages", "lead", "cases", "points", "process", "quick", "areas", "table", "guides", "lawyers", "intro", "blog", "column", "faq", "offices", "consult"]
    : ["hero", "intro", "situations", "areas", "table", "points", "process", "guides", "cases", "lawyers", "blog", "column", "faq", "offices", "consult"]
  /** 섹션 바탕: 보이는 섹션 순서대로 흰색/옅은 색을 번갈아 */
  const exists: Record<string, boolean> = {
    intro: Boolean(center.intro),
    situations: Boolean(center.situations),
    areas: true,
    table: Boolean(center.table),
    points: Boolean(center.points),
    process: true,
    guides: guides.length > 0,
    cases: cases.length > 0,
    lawyers: true,
    column: columns.length > 0,
    faq: true,
    offices: true,
  }
  const shown = order.filter((k) => exists[k])
  const bg = (id: string) => (shown.indexOf(id) % 2 === 0 ? "bg-white" : t.alt)
  /** 형사 계열은 구역마다 화면 한 장을 채우지 않고 내용만큼만 (페이지 길이 줄이기) */
  const pad = lead ? "px-6 md:px-12 lg:px-20 py-14 md:py-20 scroll-mt-20" : sectionPad
  const areaTotal = areaGroups.reduce((n, g) => n + g.items.length, 0)

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

  /** 구역 조각. 아래 order 순서대로 그립니다 */
  const S: Record<string, React.ReactNode> = {
    hero: leadLawyer ? <LeadHero center={center} lead={leadLawyer} /> : <CenterHero center={center} />,
    stages: lead && (
        <section id="stages" className="border-b border-[#E4E6E9] bg-white px-6 py-10 md:px-12 md:py-12 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-lg font-bold text-jisan-ink">{center.stageTitle}</h2>
            {/* 찾기 상자는 아래 상황 버튼과 같은 모양·같은 폭으로 (lib/prosecutor.ts searchHints 가 있는 센터만) */}
            {searchHints[center.slug] && (
              <>
                <div className="mt-4">
                  <HeroSearch light field scope={[base, ...(pages?.includeCenters ?? []).map((s) => `/${s}`)]} placeholder={searchHints[center.slug]} source="center_search" />
                </div>
                <p className="mt-6 text-[0.8125rem] font-medium text-[#8A9099]">자주 찾는 상황</p>
              </>
            )}
            <ul className={`${searchHints[center.slug] ? "mt-2.5" : "mt-4"} grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3`}>
              {center.stages.map((st) => {
                const guide = stageGuideHref(center.slug, st.label)
                return (
                  <li key={st.label}>
                    <a
                      href={guide ?? st.href}
                      className={`group flex h-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-[0.9375rem] font-semibold transition-colors ${
                        st.urgent ? "border-[#E2620F] text-[#B4490A] hover:bg-[#E2620F]/5" : "border-[#E2E6ED] text-jisan-ink hover:border-jisan-blue"
                      }`}
                    >
                      {st.label}
                      <span aria-hidden className="shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100">
                        →
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ),
    lead: leadLawyer && <LeadSection center={center} lead={leadLawyer} bg={t.alt} />,
    quick: lead && (
        <section id="quick" className={`scroll-mt-20 px-6 py-14 md:px-12 md:py-16 lg:px-20 ${t.band}`}>
          <div data-reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_26rem] lg:gap-16">
            <div className="lg:pt-3">
              <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-[2rem]">연락처만 남기셔도 됩니다</h2>
              <p className="mt-4 max-w-lg text-[1.0625rem] leading-[1.8] opacity-80">
                사건 내용을 글로 정리하기 어려우면 이름과 연락처, 지금 단계만 남겨 주세요. 담당 변호사 쪽에서 먼저 연락드려 이야기를 듣겠습니다.
              </p>
              <a href={siteConfig.phoneHref} className="mt-6 inline-block text-xl font-bold tabular-nums">
                {siteConfig.phone} <span className="text-sm font-normal opacity-70">24시간, 주말·공휴일 포함</span>
              </a>
            </div>
            <div className="rounded-2xl bg-white p-6 text-foreground md:p-7">
              <ConsultForm compact idPrefix={`${center.slug}-quick`} fixedCaseType={center.form.caseType} stageOptions={center.form.stageOptions} source={`${center.name} · 중간 상담`} />
            </div>
          </div>
        </section>
      ),
    intro: center.intro && (
        <section id="intro" className={`${pad} ${bg("intro")}`}>
          <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr]">
            <h2 className={`${h2} whitespace-pre-line`}>{center.intro.title}</h2>
            <IntroParas paras={center.intro.body} moreLabel={L.showAll} />
          </div>
        </section>
      ),
    situations: center.situations && (
        <section id="situations" className={`${pad} ${bg("situations")}`}>
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
      ),
    areas: (
<section id="areas" className={`${pad} ${bg("areas")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{center.areasTitle}</h2>
          {lead ? (
            <Fold height="31rem" label={`업무분야 ${areaTotal}개 모두 보기`}>
              <AreaBrowser groups={areaGroups} accent={t.accent} lang={center.lang} />
            </Fold>
          ) : (
            <AreaBrowser groups={areaGroups} accent={t.accent} lang={center.lang} />
          )}
        </div>
      </section>
      ),
    table: center.table && (
        <section id="table" className={`${pad} ${bg("table")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.table.title}</h2>
            {lead ? (
              <Fold height="19rem" label={`${center.table.title} 전체 보기`}>
                <DataTable table={center.table} className="mt-8" lang={center.lang} />
              </Fold>
            ) : (
              <DataTable table={center.table} className="mt-8" lang={center.lang} />
            )}
          </div>
        </section>
      ),
    points: center.points && (
        <section id="points" className={`${pad} ${bg("points")}`}>
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
      ),
    process: (
<section id="process" className={`${pad} ${bg("process")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>{L.processTitle}</h2>
          <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">{L.processLead(center.form.caseType)}</p>
          <div className="mt-8">
            {lead ? (
              <Fold height="26rem" label="절차 전체 보기">
                <ProcessTabs processes={pages?.processes ?? center.processes} accent={t.accent} lang={center.lang} />
              </Fold>
            ) : (
              <ProcessTabs processes={pages?.processes ?? center.processes} accent={t.accent} lang={center.lang} />
            )}
          </div>
        </div>
      </section>
      ),
    guides: guides.length > 0 && (
        <section id="guides" className={`${pad} ${bg("guides")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{L.guides}</h2>
            <p className="mt-2 text-[0.9375rem] text-jisan-ink/70">{L.guidesLead}</p>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {guides.slice(0, lead ? 4 : 6).map((g, i) => (
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
            {toolsCard && (
              <Link
                href={toolsCard.href}
                className="card-lift mt-4 flex flex-col gap-1 rounded-2xl border border-[#E2E6ED] bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6"
              >
                <span className="text-lg font-bold tracking-tight text-jisan-ink">{toolsCard.title}</span>
                <span className={`text-sm font-semibold ${t.accent}`}>{toolsCard.sub}&nbsp;→</span>
              </Link>
            )}
            {visaUi && (
              <Link
                href={visaHref}
                className="card-lift mt-4 flex flex-col gap-1 rounded-2xl border border-[#E2E6ED] bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6"
              >
                <span className="text-lg font-bold tracking-tight text-jisan-ink">{visaUi.ui.listTitle}</span>
                <span className={`text-sm font-semibold ${t.accent}`}>E-9 · F-6 · D-2 · F-4 …&nbsp;→</span>
              </Link>
            )}
            {guideTotal > 3 && (
              <Link href={`${base}/guide`} className={`mt-6 inline-block text-sm font-semibold ${t.accent} ${guideTotal > 6 ? "" : "md:hidden"}`}>
                {L.allGuidesN(guideTotal)}&nbsp;→
              </Link>
            )}
          </div>
        </section>
      ),
    cases: cases.length > 0 && (
        <section id="cases" className={`${pad} ${bg("cases")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{L.casesOf(center.name)}</h2>
            <p className="mt-2 mb-6 text-[0.9375rem] text-jisan-ink/70">{L.casesLead}</p>
            <SampleNote show={cases.some((c) => c.sample)} className="mb-4" />
            <CasesTable items={cases} tabs={false} />
            {centerCases.length > cases.length && (
              <Link href={caseGroups.length === 1 ? `/cases?group=${encodeURIComponent(caseGroups[0]!)}` : "/cases"} className={`mt-5 inline-block text-sm font-semibold ${t.accent}`}>
                업무사례 {centerCases.length}건 전체 보기&nbsp;→
              </Link>
            )}
            <p className="mt-4 text-[0.8125rem] text-jisan-ink/55">{L.casesNote}</p>
          </div>
        </section>
      ),
    lawyers: (
<section id="lawyers" className={`${pad} ${bg("lawyers")}`}>
        <div data-reveal className="max-w-7xl mx-auto">
          {leadLawyer && <TeamFigure text={leadLawyer.teamText} />}
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
      ),
    blog: posts.length > 0 && center.blog && (
        <section id="blog" className={`${pad} ${t.band}`}>
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
      ),
    column: columns.length > 0 && (
        <section id="column" className={`${pad} ${bg("column")}`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>{foreign ? tt("칼럼") : `${center.name} 칼럼`}</h2>
            <SampleNote show={columns.some((c) => c.sample)} className="mt-3" />
            <div className="mt-6 border-t border-jisan-ink">
              {columns.map((c, i) => (
                <div key={c.id} className={i >= 3 ? (lead ? "hidden" : "hidden md:block") : undefined}>
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
      ),
    faq: (
<section id="faq" className={`${pad} ${bg("faq")}`}>
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
      ),
    offices: (
<section id="offices" className={`${pad} ${bg("offices")}`}>
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
                {!foreign && <p className="mt-3 text-sm font-semibold tabular-nums text-jisan-ink">{L.callN(o.phone || siteConfig.phone)}</p>}
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
      ),
    consult: <ConsultBand center={center} />,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {order.map((k) => (
        <Fragment key={k}>{S[k]}</Fragment>
      ))}
    </>
  )
}
