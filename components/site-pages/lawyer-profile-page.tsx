import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allCenters, centerBase } from "@/lib/centers"
import { getLawyer } from "@/lib/lawyers"
import { lawyerI18n } from "@/lib/lawyers-i18n"
import { HREFLANG, LANGS, type Lang } from "@/lib/langs"
import { L } from "@/lib/i18n/t"
import { translateLawyer } from "@/lib/i18n/translate-lawyer"
import { siteConfig } from "@/lib/site-config"
import { lawyerEntity, lawyerProfilePath } from "@/lib/lawyer-entities"
import { LawyerPhoto } from "@/components/lawyer-photo"
import { ProsecutorBlock, Resume } from "@/components/lawyer-profile"

/**
 * 변호사 대표 페이지 (/lawyers/kim-hansol, /en/lawyers/kim-hansol).
 * 센터 안 소개 페이지와 같은 내용·모양을 메인 사이트 틀에 둔 것. 센터 안 페이지들은 검색엔진에 이 페이지를 원본으로 알립니다.
 * 화면 첫 문단은 lib/lawyers.ts 의 summary 그대로, 검색 설명·구조화 데이터에는 lib/lawyer-entities.ts 의 소개 문단을 씁니다.
 */
const TEXT: Record<Lang, { consult: string; centers: string; all: string }> = {
  ko: { consult: "이 변호사에게 상담", centers: "맡고 있는 센터", all: "구성원 전체 보기" },
  en: { consult: "Consult this lawyer", centers: "Centers", all: "All lawyers" },
  zh: { consult: "咨询这位律师", centers: "负责的中心", all: "全部律师" },
  vi: { consult: "Tư vấn với luật sư này", centers: "Trung tâm phụ trách", all: "Tất cả luật sư" },
  ru: { consult: "Консультация у этого юриста", centers: "Центры", all: "Все юристы" },
  mn: { consult: "Энэ хуульчаас зөвлөгөө авах", centers: "Хариуцдаг төвүүд", all: "Бүх хуульч" },
}

function load(lang: Lang, slug: string) {
  const base = getLawyer(slug)
  if (!base) return undefined
  return { base, lawyer: translateLawyer(base, lang), entity: lawyerEntity(slug) }
}

/** 검색엔진·AI 용 소개 문단: 그 언어 소개가 있으면 그것, 없으면 화면 첫 문단 */
const aboutText = (lang: Lang, slug: string, fallback: string) => lawyerEntity(slug)?.about[lang] ?? fallback.replace(/\n/g, " ")

export function lawyerProfileMetadata(lang: Lang, slug: string): Metadata {
  const d = load(lang, slug)
  if (!d) return {}
  const { lawyer } = d
  return {
    title: `${lawyer.name} ${lawyer.title}`,
    description: aboutText(lang, slug, lawyer.summary).slice(0, 160),
    alternates: {
      canonical: lawyerProfilePath(lang, slug),
      languages: { ...Object.fromEntries(LANGS.map((l) => [HREFLANG[l], lawyerProfilePath(l, slug)])), "x-default": lawyerProfilePath("ko", slug) },
    },
  }
}

export function LawyerProfilePage({ lang, slug }: { lang: Lang; slug: string }) {
  const d = load(lang, slug)
  if (!d) notFound()
  const { base, lawyer, entity } = d
  const tx = TEXT[lang]
  const site = siteConfig.siteUrl
  // 이 변호사가 담당으로 들어 있는 센터 (그 언어의 센터만)
  const centers = allCenters.filter((c) => (c.lang ?? "ko") === lang && c.lawyers.some((x) => x.slug === slug))
  const enName = lawyerI18n(slug, "en")?.name
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Person", "Attorney"],
        "@id": `${site}${lawyerProfilePath("ko", slug)}#person`,
        name: lawyer.name,
        ...(lang === "ko" && enName ? { alternateName: enName } : lang !== "ko" ? { alternateName: base.name } : {}),
        jobTitle: lawyer.title,
        description: aboutText(lang, slug, lawyer.summary),
        url: `${site}${lawyerProfilePath(lang, slug)}`,
        ...(base.image?.startsWith("/") ? { image: `${site}${base.image}` } : {}),
        worksFor: { "@id": `${site}/#organization` },
        workLocation: { "@type": "Place", name: siteConfig.name, address: { "@type": "PostalAddress", streetAddress: "서초대로46길 109, 6층", addressLocality: "서초구", addressRegion: "서울특별시", addressCountry: "KR" } },
        ...(entity?.knowsAbout ? { knowsAbout: entity.knowsAbout } : {}),
        ...(entity?.alumniOf ? { alumniOf: entity.alumniOf.map((n) => ({ "@type": "CollegeOrUniversity", name: n })) } : {}),
        ...(entity?.sameAs || base.blogUrl ? { sameAs: [...new Set([...(entity?.sameAs ?? []), ...(base.blogUrl ? [base.blogUrl] : [])])] } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: `${site}${L(lang, "/")}` },
          { "@type": "ListItem", position: 2, name: lang === "ko" ? "구성원" : "Lawyers", item: `${site}${L(lang, "/lawyers")}` },
          { "@type": "ListItem", position: 3, name: lawyer.name, item: `${site}${lawyerProfilePath(lang, slug)}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="px-5 md:px-12 lg:px-14 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-jisan-ink/60">{lawyer.field}</p>
          <h1 className="mt-2 text-[1.875rem] font-bold tracking-[-0.03em] text-jisan-ink md:text-[2.5rem]">
            {lawyer.name} <span className="text-[1.25rem] font-semibold text-jisan-ink/70 md:text-[1.5rem]">{lawyer.title}</span>
          </h1>
          {lawyer.tagline && <p className="mt-3 whitespace-pre-line text-[0.9375rem] leading-relaxed text-jisan-ink/75 md:text-base">{lawyer.tagline}</p>}

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl bg-[#2a3348] lg:max-w-[320px]">
                <LawyerPhoto src={lawyer.image} name={lawyer.name} imageClassName={lawyer.photoImageClassName} sizes="320px" />
              </div>
              <Link href={L(lang, "/consult")} className="mt-5 block rounded-full bg-jisan-ink py-3 text-center text-[0.9375rem] font-semibold text-white hover:opacity-90">
                {tx.consult}
              </Link>
            </aside>
            <div className="min-w-0 max-w-3xl">
              <p className="whitespace-pre-line text-[1.0625rem] leading-[1.9] text-jisan-ink/85">{lawyer.summary}</p>
              <div className="mt-10">
                <Resume lawyer={lawyer} lang={lang} />
              </div>
              <ProsecutorBlock lawyer={lawyer} lang={lang} />
              {centers.length > 0 && (
                <section className="mt-10 border-t border-[#E2E6ED] pt-7">
                  <h2 className="mb-4 text-lg font-bold text-jisan-ink">{tx.centers}</h2>
                  <ul className="flex flex-wrap gap-2">
                    {centers.map((c) => (
                      <li key={c.slug}>
                        <Link href={centerBase(c)} className="inline-block rounded-full border border-[#D5DAE1] px-4 py-2 text-sm font-semibold text-jisan-ink hover:border-jisan-ink">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <Link href={`${L(lang, "/lawyers")}#${slug}`} className="mt-12 inline-block text-sm font-semibold text-jisan-blue">
                {tx.all}&nbsp;→
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
