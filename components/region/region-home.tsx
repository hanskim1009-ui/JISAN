import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageCircle, Phone } from "lucide-react"
import { REGION_LAWYER, getRegion, regionBase, regionFaqs, regionLabel, type Region, type RegionSlug } from "@/lib/regions"
import { siteConfig } from "@/lib/site-config"
import { centerBase, centers, type Center } from "@/lib/centers"
import { fields } from "@/lib/practice"
import { getLawyer, lawyers } from "@/lib/lawyers"
import { getColumns } from "@/lib/content"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { ColumnRow } from "@/components/column-parts"
import { FaqList } from "@/components/center/faq-list"
import { SampleNote } from "@/components/sample-note"
import { VisitOffices } from "@/components/region/visit-offices"

export function regionHomeMetadata(slug: RegionSlug): Metadata {
  const r = getRegion(slug)
  if (!r) return {}
  const url = regionBase(r)
  const title = `${siteConfig.name} ${r.name} | ${r.seo.title}`
  return {
    title: { absolute: title },
    description: r.seo.description,
    keywords: r.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: `${siteConfig.name} ${r.name}`,
      title,
      description: r.seo.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${siteConfig.name} ${r.name}` }],
    },
  }
}

const pad = "px-5 md:px-12 lg:px-14 py-14 md:py-20 scroll-mt-16"
const h2 = "text-2xl md:text-[2rem] font-bold tracking-tight text-jisan-ink leading-tight"

/** 센터 카드 순서: 형사·가사 분야 먼저, 그다음 나머지 분야, 분야에 없는 센터(외국인센터)는 끝 */
function orderedCenters(): { center: Center; field?: string }[] {
  const out: { center: Center; field?: string }[] = []
  for (const f of fields) for (const slug of f.centers) {
    const c = centers.find((x) => x.slug === slug)
    if (c && !out.some((o) => o.center.slug === slug)) out.push({ center: c, field: f.name })
  }
  for (const c of centers) if (!out.some((o) => o.center.slug === c.slug)) out.push({ center: c })
  return out
}

/** 이 지역 첫 화면 */
export async function RegionHome({ slug }: { slug: RegionSlug }) {
  const region = getRegion(slug)
  const kim = getLawyer(REGION_LAWYER)
  if (!region || !kim) notFound()
  const base = regionBase(region)
  const columns = (await getColumns()).filter((c) => c.field === "형사" || c.field === "가사").slice(0, 4)
  const faqs = regionFaqs(region)
  const others = lawyers.filter((l) => l.slug !== kim.slug)
  const paras = kim.summary.split("\n")

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.siteUrl },
          { "@type": "ListItem", position: 2, name: `${siteConfig.name} ${region.name}`, item: `${siteConfig.siteUrl}${base}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 첫 화면: 지역 제목 + 김한솔 변호사 */}
      <section className="bg-jisan-navy px-5 pt-10 pb-12 text-white md:px-12 md:pt-16 md:pb-20 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.04em] text-white/65">{regionLabel(region)}</p>
            <h1 className="mt-3 whitespace-pre-line break-keep text-[1.75rem] font-bold leading-[1.3] tracking-[-0.03em] sm:text-[2.25rem] md:text-[3rem] md:leading-[1.22]">
              {region.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl break-keep text-[0.9375rem] leading-[1.75] text-white/75 md:mt-6 md:text-[1.0625rem]">{region.hero.sub}</p>
            <div className="mt-6 flex flex-wrap gap-2.5 md:mt-8">
              <Link href={`${base}/consult`} className="rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-jisan-navy hover:bg-white/90 md:px-6 md:py-3">
                상담 신청
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-[0.9375rem] font-semibold tabular-nums hover:bg-white/10 md:px-6 md:py-3"
              >
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            </div>
            <p className="mt-3 text-[0.8125rem] text-white/55">전화는 24시간, 주말·공휴일에도 받습니다.</p>
          </div>

          <Link href={`${base}/about`} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4 lg:flex-col lg:items-stretch lg:p-5">
            <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-[#2a3348] sm:w-28 lg:w-full lg:max-h-[26rem]">
              <LawyerPhoto src={kim.image} name={kim.name} sizes="(max-width: 1024px) 112px, 30vw" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white/60">{kim.field}</p>
              <p className="mt-1 text-xl font-bold">
                {kim.name} <span className="text-sm font-medium text-white/65">{kim.title}</span>
              </p>
              {kim.tagline && <p className="mt-1.5 break-keep text-[0.875rem] leading-snug text-white/80">{kim.tagline}</p>}
              <p className="mt-2 text-sm font-semibold text-white/90">
                변호사 소개 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>
        </div>
      </section>

      <Agencies region={region} />

      {/* 분야별 센터 */}
      <section id="centers" className={`${pad} bg-jisan-mist`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>분야별 센터</h2>
          <p className="mt-2 break-keep text-[0.9375rem] text-jisan-ink/70">{region.centersLead}</p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orderedCenters().map(({ center, field }) => (
              <li key={center.slug} className="min-w-0">
                <Link href={centerBase(center)} className="card-lift group flex h-full flex-col rounded-2xl border border-[#E2E6ED] bg-white p-5">
                  {field && <span className="text-xs font-bold text-jisan-blue">{field}</span>}
                  <span className="mt-1 text-lg font-bold tracking-tight text-jisan-ink">
                    {siteConfig.shortName} {center.name}
                  </span>
                  <span className="mt-1.5 line-clamp-2 break-keep text-sm leading-relaxed text-jisan-ink/65">{center.summary}</span>
                  <span className="mt-auto pt-3 text-sm font-semibold text-jisan-blue">
                    센터 보기 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 변호사 */}
      <section id="lawyer" className={`${pad} bg-white`}>
        <div data-reveal className="max-w-7xl mx-auto">
          <h2 className={h2}>변호사</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr] lg:gap-12">
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-2xl bg-[#2a3348] md:w-full">
              <LawyerPhoto src={kim.image} name={kim.name} sizes="(max-width: 768px) 160px, 224px" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-jisan-ink">
                {kim.name} <span className="text-base font-medium text-muted-foreground">{kim.title}</span>
              </p>
              {kim.tagline && <p className="mt-2 break-keep text-[0.9375rem] font-medium text-jisan-ink/80">{kim.tagline}</p>}
              <div className="mt-4 space-y-3 break-keep text-[0.9375rem] leading-relaxed text-jisan-ink/70">
                {paras.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {kim.career && kim.career.length > 0 && (
                <ul className="mt-5 space-y-1.5 border-t border-[#E2E6ED] pt-5 text-sm text-jisan-ink/80">
                  {kim.career.map((c) => (
                    <li key={c} className="break-keep">{c}</li>
                  ))}
                </ul>
              )}
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <Link href={`${base}/about`} className="text-jisan-blue">
                  변호사 소개 자세히&nbsp;→
                </Link>
                <Link href="/lawyers" className="text-jisan-ink/60 hover:text-jisan-ink">
                  다른 구성원 보기&nbsp;→
                </Link>
              </p>
            </div>
          </div>

          {others.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-jisan-ink">함께 일하는 구성원</h3>
              <p className="mt-1 break-keep text-sm text-jisan-ink/65">사건에 따라 분야를 맡은 변호사가 함께 봅니다.</p>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {others.map((l) => (
                  <li key={l.slug} className="min-w-0">
                    <Link href="/lawyers" className="flex items-center gap-2.5 rounded-xl border border-[#E2E6ED] p-2.5 hover:border-jisan-ink/30">
                      <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#C9CCD1]">
                        <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top" sizes="40px" initialClassName="text-sm" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-jisan-ink">{l.name}</span>
                        <span className="block truncate text-xs text-jisan-ink/60">{l.field}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 칼럼 */}
      {columns.length > 0 && (
        <section id="column" className={`${pad} bg-jisan-mist`}>
          <div data-reveal className="max-w-7xl mx-auto">
            <h2 className={h2}>형사·가사 칼럼</h2>
            <SampleNote show={columns.some((c) => c.sample)} className="mt-3" />
            <div className="mt-6 border-t border-jisan-ink">
              {columns.map((c, i) => (
                <div key={c.id} className={i >= 3 ? "hidden md:block" : undefined}>
                  <ColumnRow c={c} />
                </div>
              ))}
            </div>
            <Link href="/column" className="mt-6 inline-block text-sm font-semibold text-jisan-blue">
              칼럼 모두 보기&nbsp;→
            </Link>
          </div>
        </section>
      )}

      {/* 자주 묻는 질문 */}
      <section id="faq" className={`${pad} bg-white`}>
        <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <h2 className={h2}>자주 묻는 질문</h2>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* 상담 안내 + 사무소 위치 */}
      <section id="consult" className={`${pad} bg-jisan-mist`}>
        <div data-reveal className="max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div className="min-w-0">
            <h2 className={h2}>상담 안내</h2>
            <p className="mt-3 break-keep text-[0.9375rem] leading-relaxed text-jisan-ink/75">{region.consultLead}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link href={`${base}/consult`} className="rounded-md bg-jisan-blue px-6 py-3 text-center text-[0.9375rem] font-semibold text-white hover:bg-jisan-blue/90">
                상담 신청서 쓰기
              </Link>
              <a href={siteConfig.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-jisan-ink/20 bg-white px-6 py-3 text-[0.9375rem] font-semibold tabular-nums text-jisan-ink">
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
              <a
                href={siteConfig.kakaoTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FEE500] px-6 py-3 text-[0.9375rem] font-semibold text-[#191919]"
              >
                <MessageCircle className="h-4 w-4" /> 카카오톡
              </a>
            </div>
          </div>
          <VisitOffices region={region} />
        </div>
      </section>
    </>
  )
}

/** 이 지역에서 사건이 진행되는 곳: 법원 · 공소청 · 경찰서 */
function Agencies({ region }: { region: Region }) {
  return (
    <section id="agencies" className={`${pad} bg-white`}>
      <div data-reveal className="max-w-7xl mx-auto">
        <h2 className={h2}>{region.name}에서 사건이 진행되는 곳</h2>
        <p className="mt-2 break-keep text-[0.9375rem] text-jisan-ink/70">{region.agenciesLead}</p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {region.agencies.map((g) => (
            <div key={g.kind} className="min-w-0 border-t-2 border-jisan-ink bg-jisan-mist/60 p-5">
              <p className="text-lg font-bold text-jisan-ink">{g.kind}</p>
              <p className="mt-1.5 break-keep text-[0.8125rem] leading-relaxed text-jisan-ink/60">{g.hint}</p>
              <ul className={`mt-4 ${g.items.some((i) => i.desc) ? "space-y-3" : "flex flex-wrap gap-2"}`}>
                {g.items.map((i) =>
                  i.desc ? (
                    <li key={i.name}>
                      <p className="break-keep font-semibold text-jisan-ink">{i.name}</p>
                      <p className="text-sm text-jisan-ink/65">{i.desc}</p>
                    </li>
                  ) : (
                    <li key={i.name} className="rounded-full border border-[#D5DAE2] bg-white px-3 py-1 text-sm text-jisan-ink">
                      {i.name}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        {region.upcoming && <p className="mt-5 break-keep text-[0.8125rem] leading-relaxed text-jisan-ink/60">※ {region.upcoming}</p>}
        <p className="mt-2 break-keep text-[0.8125rem] leading-relaxed text-jisan-ink/55">
          ※ 실제로 어느 기관에서 진행되는지는 사건이 생긴 곳, 사는 곳, 사건 종류에 따라 다릅니다. 받은 서류에 적힌 기관을 먼저 확인하세요.
        </p>
      </div>
    </section>
  )
}
