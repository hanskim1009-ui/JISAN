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

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
}

/**
 * 메인 순서: 첫 화면 → 구성원 → 업무영역 → 업무사례 → 분야별 센터 → 칼럼·유튜브 → 감사일기
 * → 법인 개요 → 상담 안내 → 자주 묻는 질문 → 오시는 길. 글이 없는 칸은 숨깁니다.
 */
export default async function Page() {
  const cases = getCases({ limit: 6 })
  const columns = getColumns({ limit: 3 })
  const diary = getDiary({ limit: 3 })
  const channelId = siteConfig.feeds.firmYoutubeChannelId
  const videos = await getYoutubeVideos(channelId, 4)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeHero />
      <PeopleSection />
      <FieldsSection />
      {cases.length > 0 && (
        <section className="px-5 md:px-12 lg:px-14 pb-14 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <SectionHead title="업무사례" desc="의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다." href="/cases" />
            <CasesTable items={cases} />
          </div>
        </section>
      )}
      <CentersBand />
      <LegalInfoSection
        columns={columns}
        videos={videos}
        youtubeUrl={channelId ? `https://www.youtube.com/channel/${channelId}` : undefined}
      />
      {diary.length > 0 && (
        <section className="bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <SectionHead title="감사일기" desc="사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다." href="/diary" />
            <DiaryGrid entries={diary} />
          </div>
        </section>
      )}
      <AboutBand />
      <HowWeWork />
      <HomeFaq />
      <MapSection />
    </>
  )
}
