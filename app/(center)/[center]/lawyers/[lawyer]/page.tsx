import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { allCenters, centerBase, getCenter, type Center } from "@/lib/centers"
import { getLawyer, lawyers as allLawyers, type Lawyer } from "@/lib/lawyers"
import { HREFLANG, type Lang } from "@/lib/langs"
import { T } from "@/lib/i18n/t"
import { translateLawyer } from "@/lib/i18n/translate-lawyer"
import { PROFILE_TEXT } from "@/lib/center-profile-text"
import { centerText } from "@/lib/center-i18n"
import { centerTones } from "@/components/center/tone"
import { SubHero } from "@/components/center/sub-page"
import { ConsultBand } from "@/components/center/consult-band"
import { LawyerPhoto } from "@/components/lawyer-photo"

type Props = { params: Promise<{ center: string; lawyer: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allCenters.flatMap((c) => allLawyers.map((l) => ({ center: c.slug, lawyer: l.slug })))
}

function load(centerSlug: string, slug: string) {
  const center = getCenter(centerSlug)
  const base = getLawyer(slug)
  if (!center || !base) return undefined
  const lang: Lang = center.lang ?? "ko"
  return { center, lang, lawyer: translateLawyer(base, lang), note: center.lawyers.find((x) => x.slug === slug)?.note }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params
  const d = load(p.center, p.lawyer)
  if (!d) return {}
  const { center, lang, lawyer } = d
  const url = `${centerBase(center)}/lawyers/${lawyer.slug}`
  return {
    title: { absolute: PROFILE_TEXT[lang].title(lawyer.name, lawyer.title, center.name) },
    description: lawyer.summary.replace(/\n/g, " ").slice(0, 160),
    alternates: {
      canonical: url,
      ...(center.alternates
        ? { languages: Object.fromEntries(Object.entries(center.alternates).map(([l, h]) => [HREFLANG[l as Lang], `${h}/lawyers/${lawyer.slug}`])) }
        : {}),
    },
  }
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
          <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-jisan-ink/40" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#E2E6ED] pt-7">
      <h2 className="mb-4 text-lg font-bold text-jisan-ink">{title}</h2>
      {children}
    </section>
  )
}

/** 이력 묶음: 자격·경력·학력이 나뉜 변호사는 그대로, 아니면 경력 + 주요 이력 (+ 분야별 블록) */
function Resume({ lawyer, lang }: { lawyer: Lawyer; lang: Lang }) {
  const t = T(lang)
  const P = PROFILE_TEXT[lang]
  const r = lawyer.structuredResume
  return (
    <div className="space-y-9">
      {r ? (
        <>
          {r.qualifications.length > 0 && <Block title={t("자격")}><List items={r.qualifications} /></Block>}
          {r.career.length > 0 && <Block title={t("경력")}><List items={r.career} /></Block>}
          {r.education.length > 0 && <Block title={t("학력")}><List items={r.education} /></Block>}
        </>
      ) : (
        <>
          {lawyer.career && lawyer.career.length > 0 && <Block title={lawyer.resumeSections?.length ? t("이력") : t("경력")}><List items={lawyer.career} /></Block>}
          {lawyer.resumeSections?.map((s) => (
            <Block key={s.heading} title={s.heading}>
              <List items={s.items} />
            </Block>
          ))}
          {lawyer.highlights.length > 0 && <Block title={lawyer.resumeSections?.length ? t("학력") : P.highlights}><List items={lawyer.highlights} /></Block>}
        </>
      )}
      {lawyer.workCaseSections && lawyer.workCaseSections.length > 0 && (
        <Block title={t("주요 업무 사례")}>
          <div className="space-y-6">
            {lawyer.workCaseSections.map((s) => (
              <div key={s.heading}>
                <p className="mb-2 text-[0.9375rem] font-semibold text-jisan-ink">{s.heading}</p>
                <ul className="list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-jisan-ink/80">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}

/** 같은 센터의 다른 변호사: 주력 변호사 먼저, 한국어 센터는 나머지 구성원도 */
function others(center: Center, lang: Lang, current: string) {
  const lead = center.lawyers.map((x) => x.slug)
  const slugs = lang === "ko" ? [...lead, ...allLawyers.map((l) => l.slug).filter((s) => !lead.includes(s))] : lead
  return slugs.filter((s) => s !== current).flatMap((s) => {
    const l = getLawyer(s)
    return l ? [translateLawyer(l, lang)] : []
  })
}

/** 센터 안 변호사 소개: /crime/lawyers/kim-hansol, /en/foreigner/lawyers/kim-hansol */
export default async function CenterLawyerPage({ params }: Props) {
  const p = await params
  const d = load(p.center, p.lawyer)
  if (!d) notFound()
  const { center, lang, lawyer, note } = d
  const P = PROFILE_TEXT[lang]
  const L = centerText(center.lang)
  const tone = centerTones[center.tone]
  const base = centerBase(center)
  const rest = others(center, lang, lawyer.slug)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.name,
    jobTitle: lawyer.title,
    description: lawyer.summary.replace(/\n/g, " "),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubHero
        center={center}
        crumbs={[{ label: center.name, href: base }, { label: P.lawyers, href: `${base}#lawyers` }, { label: lawyer.name }]}
        kicker={`${center.name} · ${lawyer.field}`}
        title={`${lawyer.name} ${lawyer.title}`}
        lead={lawyer.tagline ?? note ?? ""}
      />
      <div className="bg-white px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] lg:max-w-[320px] overflow-hidden rounded-2xl bg-[#2a3348]">
              <LawyerPhoto src={lawyer.image} name={lawyer.name} imageClassName={lawyer.photoImageClassName} sizes="320px" />
            </div>
            <a href="#consult" className="mt-5 block rounded-full bg-jisan-ink py-3 text-center text-[0.9375rem] font-semibold text-white hover:opacity-90">
              {L.askThis}
            </a>
          </aside>
          <div className="min-w-0 max-w-3xl">
            {note && center.lawyers.some((x) => x.slug === lawyer.slug) && (
              <div className="mb-8 rounded-2xl bg-jisan-mist px-5 py-4">
                <p className={`text-xs font-bold ${tone.accent}`}>{P.inCenter(center.name)}</p>
                <p className="mt-1 text-[0.9375rem] font-medium leading-relaxed text-jisan-ink">{note}</p>
              </div>
            )}
            <p className="whitespace-pre-line text-[1.0625rem] leading-[1.9] text-jisan-ink/85">{lawyer.summary}</p>
            <div className="mt-10">
              <Resume lawyer={lawyer} lang={lang} />
            </div>
            <Link href={base} className={`mt-12 inline-flex items-center gap-1.5 text-sm font-semibold ${tone.accent}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> {P.back(center.name)}
            </Link>
          </div>
        </div>
      </div>
      {rest.length > 0 && (
        <section className={`px-6 md:px-12 lg:px-20 py-14 md:py-16 ${tone.alt}`}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-jisan-ink">{P.others}</h2>
            <ul className="no-scrollbar -mx-6 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {rest.map((l) => (
                <li key={l.slug} className="card-lift w-[42%] min-w-0 shrink-0 snap-start overflow-hidden rounded-2xl border border-[#E2E6ED] bg-white sm:w-auto">
                  <Link href={`${base}/lawyers/${l.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#2a3348]">
                      <LawyerPhoto src={l.image} name={l.name} imageClassName="object-cover object-top" sizes="(max-width: 640px) 50vw, 25vw" initialClassName="text-5xl" />
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-bold text-jisan-ink/60">{l.field}</p>
                      <p className="mt-0.5 font-bold text-jisan-ink">
                        {l.name} <span className="text-[0.8125rem] font-medium text-muted-foreground">{l.title}</span>
                      </p>
                      <p className={`mt-1.5 text-[0.8125rem] font-semibold ${tone.accent}`}>{P.view} →</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <ConsultBand center={center} />
    </>
  )
}
