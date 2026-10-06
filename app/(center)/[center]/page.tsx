import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MessageCircle, Phone, Plus } from "lucide-react"
import { centers, getCenter } from "@/lib/centers"
import { getLawyer } from "@/lib/lawyers"
import { siteConfig } from "@/lib/site-config"
import { centerTones } from "@/components/center/tone"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { ConsultForm } from "@/components/consult-form"

type Props = { params: Promise<{ center: string }> }

export const dynamicParams = false

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
const eyebrow = "text-[11px] tracking-[0.2em] text-muted-foreground font-medium mb-3 uppercase"
const h2 = "text-2xl md:text-[2rem] font-bold tracking-tight text-jisan-ink leading-tight"

export default async function CenterPage({ params }: Props) {
  const center = getCenter((await params).center)
  if (!center) notFound()
  const t = centerTones[center.tone]
  const lawyers = center.lawyers.flatMap((cl) => {
    const l = getLawyer(cl.slug)
    return l ? [{ ...l, note: cl.note }] : []
  })

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
              <a href="#consult" className={`rounded-md px-6 py-3 text-[15px] font-semibold ${t.primaryBtn}`}>
                상담 신청
              </a>
              <a href={siteConfig.phoneHref} className={`inline-flex items-center gap-2 rounded-md px-6 py-3 text-[15px] font-semibold ${t.ghostBtn}`}>
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="min-w-0 rounded-xl bg-white p-5 md:p-6 text-jisan-ink shadow-[0_8px_30px_rgba(10,15,30,0.12)]">
            <h2 className="text-base font-bold">{center.stageTitle}</h2>
            <ul className="mt-3 space-y-2">
              {center.stages.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-[15px] font-semibold transition-colors ${
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
          <p className={eyebrow}>Practice</p>
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
                <li key={a.name} className="rounded-xl border border-[#E2E6ED] p-5">
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
            <p className={eyebrow}>Penalty</p>
            <h2 className={h2}>처벌 기준과 부수처분</h2>
            <div className="mt-8 overflow-x-auto rounded-xl border border-[#E2E6ED] bg-white">
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
          <p className={eyebrow}>Process</p>
          <h2 className={h2}>대응 절차</h2>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {center.processes.map((proc) => (
              <div key={proc.title} className="min-w-0">
                <h3 className="text-lg font-bold text-jisan-ink">{proc.title}</h3>
                <ol className="mt-4 space-y-0">
                  {proc.steps.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-3 pb-5 relative">
                      {i < proc.steps.length - 1 && (
                        <span className="absolute left-[1.05rem] top-9 bottom-0 w-px bg-[#D3DAE6]" aria-hidden />
                      )}
                      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-jisan-navy text-sm font-bold text-white tabular-nums">
                        {i + 1}
                      </span>
                      <span className="pt-1.5">
                        <span className="block font-semibold text-jisan-ink">{s.title}</span>
                        <span className="block mt-0.5 text-sm leading-relaxed text-jisan-ink/65">{s.desc}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 담당 변호사 */}
      <section id="lawyers" className={`${sectionPad} ${center.penalties ? t.alt : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <p className={eyebrow}>Lawyers</p>
          <h2 className={h2}>{center.name} 담당 변호사</h2>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((l) => (
              <li key={l.slug} className="min-w-0 flex gap-5 rounded-xl bg-white border border-[#E2E6ED] p-4">
                <div className="relative w-28 md:w-36 shrink-0 aspect-[3/4] overflow-hidden rounded-lg bg-[#2a3348]">
                  <LawyerPhoto src={l.image} name={l.name} imageClassName={l.photoImageClassName} sizes="144px" />
                </div>
                <div className="min-w-0 py-1">
                <p className="text-lg font-bold text-jisan-ink">
                  {l.name} <span className="text-sm font-medium text-muted-foreground">{l.title}</span>
                </p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-jisan-ink/80">{l.note}</p>
                <p className="mt-2 text-sm leading-relaxed text-jisan-ink/70 line-clamp-4">{l.summary}</p>
                <a href="#consult" className={`mt-3 inline-block text-sm font-semibold ${t.accent}`}>
                  이 변호사에게 상담 →
                </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section id="faq" className={`${sectionPad} bg-white`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
          <div>
            <p className={eyebrow}>FAQ</p>
            <h2 className={h2}>자주 묻는 질문</h2>
            <p className="mt-3 text-sm text-jisan-ink/65">답을 찾지 못하셨다면 바로 물어보세요.</p>
            <a href="#consult" className="mt-5 inline-block rounded-md bg-jisan-blue px-5 py-2.5 text-sm font-semibold text-white">
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
              <a href={siteConfig.phoneHref} className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold ${t.bandBtn}`}>
                <Phone className="h-4 w-4" /> 전화 {siteConfig.phone}
              </a>
              <a
                href={siteConfig.kakaoTalkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FEE500] px-6 py-3 text-sm font-semibold text-[#191919]"
              >
                <MessageCircle className="h-4 w-4" /> 카카오톡 상담
              </a>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 md:p-8 text-foreground">
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
