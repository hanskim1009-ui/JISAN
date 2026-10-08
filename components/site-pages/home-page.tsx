import type { Metadata } from "next"
import { HomeHero } from "@/components/main/home-hero"
import { PeopleSection } from "@/components/main/people-section"
import { FieldsSection } from "@/components/main/fields-section"
import { SectionHead } from "@/components/main/section-head"
import { CasesTable } from "@/components/cases-table"
import { CentersBand } from "@/components/main/centers-band"
import { LegalInfoSection } from "@/components/main/legal-info-section"
import { DiaryGrid } from "@/components/diary-entries"
import { AboutBand } from "@/components/main/about-band"
import { HowWeWork } from "@/components/main/how-we-work"
import { HomeFaq } from "@/components/main/home-faq"
import { MapSection } from "@/components/map-section"
import { homeFaqs } from "@/lib/home-faq"
import { getCases, getColumns, getDiary } from "@/lib/content"
import { getYoutubeVideos } from "@/lib/feeds"
import { siteConfig } from "@/lib/site-config"
import { SHOW_SAMPLES } from "@/lib/preview"
import { sampleVideos } from "@/lib/samples"
import { SampleNote } from "@/components/sample-note"
import { centers } from "@/lib/centers"
import { HREFLANG, homeAlternates, type Lang } from "@/lib/langs"
import { L, T } from "@/lib/i18n/t"
import { CASES_TABLE_KEYS, clientDict } from "@/lib/i18n/client-keys"

/** 메인 페이지 검색 제목·설명 (한국어는 app/layout.tsx 기본값) */
export function homeMetadata(lang: Lang): Metadata {
  const alternates = { canonical: L(lang, "/"), languages: homeAlternates() }
  if (lang === "ko") return { alternates }
  const t = T(lang)
  const title = t("{name} | 형사·가사·기업·의료·부동산·민사 변호사", { name: t(siteConfig.name) })
  const description = t("형사·가사·기업·의료·부동산·민사 사건을 담당 변호사가 상담부터 재판까지 직접 맡습니다. 상담 전화 24시간, 주말·공휴일 포함.")
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: { type: "website", locale: HREFLANG[lang], url: L(lang, "/"), siteName: siteConfig.nameEn, title, description, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteConfig.nameEn }] },
  }
}

/**
 * 메인 순서: 첫 화면 → 구성원 → 업무영역 → 업무사례 → 분야별 센터 → 칼럼·유튜브 → 감사일기
 * → 법인 개요 → 상담 안내 → 자주 묻는 질문 → 오시는 길. 글이 없는 칸은 숨깁니다.
 * 외국어 사이트도 같은 순서·같은 내용(번역)이고, 분야별 센터는 번역된 외국인센터만 보입니다.
 */
export async function HomePage({ lang }: { lang: Lang }) {
  const t = T(lang)
  const ko = lang === "ko"
  const cases = await getCases({ limit: 6, lang })
  const columns = await getColumns({ limit: 6, lang })
  const allColumns = await getColumns({ lang })
  const columnCenters = ko
    ? centers
        .map((c) => ({ slug: c.slug, name: c.name, count: allColumns.filter((x) => x.centers?.includes(c.slug)).length }))
        .filter((c) => c.count > 0)
    : []
  const diary = await getDiary({ limit: 3, lang })
  const channelId = siteConfig.feeds.firmYoutubeChannelId
  const realVideos = await getYoutubeVideos(channelId, 4)
  const videos = realVideos.length > 0 || !SHOW_SAMPLES ? realVideos : ko ? sampleVideos : []

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: HREFLANG[lang],
    mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: t(f.q), acceptedAnswer: { "@type": "Answer", text: t(f.a) } })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeHero lang={lang} />
      <PeopleSection lang={lang} />
      <FieldsSection lang={lang} />
      {cases.length > 0 && (
        <section className="screen px-5 md:px-12 lg:px-14 py-14 md:py-20">
          <div data-reveal className="max-w-7xl mx-auto">
            <SectionHead title={t("업무사례")} desc={t("나와 비슷한 사건을 어떻게 해결했는지 확인해 보세요.")} href={L(lang, "/cases")} linkLabel={t("더보기")} />
            <SampleNote show={cases.some((c) => c.sample)} className="mb-4" lang={lang} />
            <CasesTable items={cases} lang={lang} dict={clientDict(lang, CASES_TABLE_KEYS)} />
            <p className="mt-4 text-[0.8125rem] text-[#8A9099]">{t("※ 지산의 업무사례는 의뢰인의 동의를 얻은 사건만, 누구인지 알 수 없게 고쳐 공개합니다.")}</p>
          </div>
        </section>
      )}
      <CentersBand lang={lang} />
      <LegalInfoSection
        columns={columns}
        columnTotal={allColumns.length}
        columnCenters={columnCenters}
        videos={videos}
        youtubeUrl={channelId ? `https://www.youtube.com/channel/${channelId}` : undefined}
        lang={lang}
      />
      {diary.length > 0 && (
        <section className="screen bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
          <div data-reveal className="max-w-7xl mx-auto">
            <SectionHead title={t("감사일기")} desc={t("사건이 끝나고 의뢰인께서 보내 주신 문자와 선물을 직원이 기록해 둡니다.")} href={L(lang, "/diary")} linkLabel={t("더보기")} />
            <SampleNote show={diary.some((d) => d.sample)} className="mb-4" lang={lang} />
            <DiaryGrid entries={diary} lang={lang} />
          </div>
        </section>
      )}
      <AboutBand lang={lang} />
      <HowWeWork lang={lang} />
      <HomeFaq lang={lang} />
      <MapSection lang={lang} />
    </>
  )
}
