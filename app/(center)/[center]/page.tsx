import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MessageCircle, Phone, Plus } from "lucide-react"
import { centers, getCenter } from "@/lib/centers"
import { getLawyer, lawyers as allLawyers } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
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

const sectionPad = "px-6 md:px-12 lg:px-20 py-16 md:py-24 scroll-mt-20"
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
      <section className={t.hero}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <div className="min-w-0">
            <span className={`inline-block rounded px-2.5 py-1 text-xs font-bold ${t.badge}`}>{center.name}</span>
            <h1 className={`mt-4 text-[2rem] leading-[1.25] md:text-5xl md:leading-[1.2] whitespace-pre-line text-balance ${t.heroTitle}`}>
              {center.hero.title}
            </h1>
            <p className={`mt-5 max-w-xl text-base md:text-[17px] leading-relaxed ${t.heroSub}`}>{center.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <a href="#consult" className={`px-6 py-3 text-[15px] font-semibold ${t.primaryBtn}`}>
                상담 신청
              </a>
              <a href={siteConfig.phoneHref} className={`inline-flex items-center gap-2 px-6 py-3 text-[15px] font-semibold ${t.ghostBtn}`}>
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="min-w-0 bg-white p-5 md:p-6 text-jisan-ink shadow-[0_8px_30px_rgba(10,15,30,0.12)]">
            <h2 className="text-base font-bold">{center.stageTitle}</h2>
            <ul className="mt-3 space-y-2">
              {center.stages.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={`flex items-center justify-between gap-3 border px-4 py-3 text-[15px] font-semibold transition-colors ${
                      s.urgent
                        ? "border-[#E2620F] text-[#B4490A] hover:bg-[#E2620F]/5"
                        : "border-[#E2E6ED] hover:border-jisan-blue"
                    }`}
                  >
                    {s.label}
                    <span className={`shrink-0 text-xs font-medium ${s.urgent ? "text-[#B4490A]" : "text-muted-foreground"}`}>
                      {s.hint}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 주요 업무 / 세부 사건 */}
      <section id="areas" className={`${sectionPad} bg-white`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={h2}>{center.areasTitle}</h2>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {center.areas.map((a) => {
              const body = (
                <>
                  <span className="block text-lg font-bold text-jisan-ink">{a.name}</span>
                  {a.law && <span className={`block mt-0.5 text-xs font-semibold ${t.accent}`}>{a.law}</span>}
                  <span className="block mt-2 text-sm leading-relaxed text-jisan-ink/65">{a.desc}</span>
                  {a.href && <span className={`block mt-3 text-sm font-semibold ${t.accent}`}>자세히 보기 →</span>}
                </>
              )
              return (
                <li key={a.name} className="border border-[#E2E6ED] p-5">
                  {a.href ? <a href={a.href} className="block">{body}</a> : body}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* 처벌 기준 */}
      {center.penalties && (
        <section id="penalty" className={`${sectionPad} ${t.alt}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={h2}>죄명별 처벌 기준</h2>
            <div className="mt-8 overflow-x-auto border border-[#E2E6ED] bg-white">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-jisan-mist/60 text-xs text-jisan-ink/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold">죄명</th>
                    <th className="px-4 py-3 font-semibold">법정형</th>
                    <th className="px-4 py-3 font-semibold">함께 내려질 수 있는 처분</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6ED] text-jisan-ink">
                  {center.penalties.map((p) => (
                    <tr key={p.crime}>
                      <td className="px-4 py-3.5 font-semibold whitespace-nowrap">{p.crime}</td>
                      <td className="px-4 py-3.5">{p.penalty}</td>
                      <td className="px-4 py-3.5 text-jisan-ink/70">{p.extra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              법정형 기준입니다. 실제 처분과 부수처분은 사건과 선고 결과에 따라 달라집니다.
            </p>
          </div>
        </section>
      )}

      {/* 대응 절차 */}
      <section id="process" className={`${sectionPad} ${center.penalties ? "bg-white" : t.alt}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={h2}>사건 진행 절차</h2>
          <p className="mt-2 text-[15px] text-jisan-ink/70">{center.form.caseType} 사건, 단계별로 어떻게 대응하는지 알려드립니다.</p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {center.processes.map((proc) => (
              <div key={proc.title} className="min-w-0">
                <h3 className="text-lg font-bold text-jisan-ink">{proc.title}</h3>
                <table className="mt-3 w-full text-left text-[15px]">
                  <thead>
                    <tr className="border-b-2 border-jisan-ink text-xs text-[#8A9099]">
                      <th className="w-10 py-2 font-medium">단계</th>
                      <th className="py-2 pr-3 font-medium">하는 일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proc.steps.map((s, i) => (
                      <tr key={s.title} className="border-b border-[#E2E6ED] align-top">
                        <td className="py-3 text-[#8A9099] tabular-nums">{i + 1}</td>
                        <td className="py-3 pr-3">
                          <span className="block font-semibold text-jisan-ink">{s.title}</span>
                          <span className="block mt-0.5 text-sm leading-relaxed text-jisan-ink/70">{s.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 업무사례 (이 센터로 지정된 것만) */}
      {cases.length > 0 && (
        <section id="cases" className={`${sectionPad} bg-white`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={h2}>{center.name} 업무사례</h2>
            <p className="mt-2 mb-6 text-[15px] text-jisan-ink/70">나와 비슷한 사건을 어떻게 해결했는지 확인해 보세요.</p>
            <SampleNote show={cases.some((c) => c.sample)} className="mb-4" />
            <CasesTable items={cases} tabs={false} />
            <p className="mt-4 text-[13px] text-jisan-ink/55">※ 의뢰인의 동의를 얻은 사건만, 누구인지 알 수 없게 고쳐 공개합니다.</p>
          </div>
        </section>
      )}

      {/* 담당 변호사 */}
      <section id="lawyers" className={`${sectionPad} ${center.penalties ? t.alt : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={h2}>{center.name} 변호사</h2>
          <p className="mt-2 text-[15px] text-jisan-ink/70">
            {siteConfig.shortName} 변호사는 {lawyers.length + others.length}명입니다. {center.name} 사건은 주력 변호사가 맡고, 민사·가사 문제가 겹치면 해당 분야 변호사가 같이 봅니다.
          </p>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((l) => (
              <li key={l.slug} className="min-w-0 flex gap-5 bg-white border border-[#E2E6ED] p-4">
                <div className="relative w-28 md:w-36 shrink-0 aspect-[3/4] overflow-hidden bg-[#2a3348]">
                  <LawyerPhoto src={l.image} name={l.name} imageClassName={l.photoImageClassName} sizes="144px" />
                </div>
                <div className="min-w-0 py-1">
                  <span className="inline-block bg-jisan-ink px-2 py-0.5 text-xs font-bold text-white">주력</span>
                  <p className="mt-2 text-lg font-bold text-jisan-ink">
                    {l.name} <span className="text-sm font-medium text-muted-foreground">{l.title}</span>
                  </p>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-jisan-ink/80">{l.note}</p>
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
                  <li key={l.slug} className="min-w-0 bg-white border border-[#E2E6ED]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#2a3348]">
                      <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top" sizes="(max-width: 640px) 50vw, 25vw" initialClassName="text-5xl" />
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-bold text-jisan-ink/60">{l.field}</p>
                      <p className="mt-0.5 font-bold text-jisan-ink">
                        {l.name} <span className="text-[13px] font-medium text-muted-foreground">{l.title}</span>
                      </p>
                      {l.line && <p className="mt-1 text-[13px] leading-snug text-jisan-ink/70">{l.line}</p>}
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
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
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
        <section id="column" className={`${sectionPad} bg-white`}>
          <div className="max-w-7xl mx-auto">
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
      <section id="faq" className={`${sectionPad} bg-white`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
          <div>
            <h2 className={h2}>자주 묻는 질문</h2>
            <p className="mt-3 text-sm text-jisan-ink/65">상담 전에 가장 많이 물어보시는 질문을 모았습니다.</p>
            <a href="#consult" className="mt-5 inline-block bg-jisan-blue px-5 py-2.5 text-sm font-semibold text-white">
              상담 신청
            </a>
          </div>
          <div className="min-w-0 divide-y divide-[#E2E6ED] border-y border-[#E2E6ED]">
            {center.faqs.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-jisan-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-jisan-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 */}
      <section id="consult" className={`${t.band} px-6 md:px-12 lg:px-20 py-16 md:py-24 scroll-mt-20`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-balance">{center.closing}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed opacity-80">
              주말·공휴일 포함 24시간 상담합니다. 남겨 주신 내용은 담당 변호사가 직접 확인하고 연락드립니다.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={siteConfig.phoneHref} className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold ${t.bandBtn}`}>
                <Phone className="h-4 w-4" /> 전화 {siteConfig.phone}
              </a>
              <a
                href={siteConfig.kakaoTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FEE500] px-6 py-3 text-sm font-semibold text-[#191919]"
              >
                <MessageCircle className="h-4 w-4" /> 카카오톡 상담
              </a>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 text-foreground">
            <h3 className="mb-6 text-base font-semibold text-jisan-ink">{center.name} 상담 신청</h3>
            <ConsultForm
              idPrefix={center.slug}
              fixedCaseType={center.form.caseType}
              stageOptions={center.form.stageOptions}
              source={center.name}
            />
          </div>
        </div>
      </section>
    </>
  )
}
