import type { Metadata } from "next"
import { HomeHero } from "@/components/main/home-hero"
import { FieldsSection } from "@/components/main/fields-section"
import { SectionHead } from "@/components/main/section-head"
import { CasesTable } from "@/components/cases-table"
import { DiaryGrid } from "@/components/diary-entries"
import { MediaSection } from "@/components/main/media-section"
import { PeopleSection } from "@/components/main/people-section"
import { MapSection } from "@/components/map-section"
import { getCases, getDiary } from "@/lib/content"
import { getNaverBlogPosts, getYoutubeVideos } from "@/lib/feeds"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default async function Page() {
  const cases = getCases({ limit: 6 })
  const diary = getDiary({ limit: 3 })
  const { firmBlogId, firmYoutubeChannelId } = siteConfig.feeds
  const [posts, videos] = await Promise.all([getNaverBlogPosts(firmBlogId), getYoutubeVideos(firmYoutubeChannelId)])

  return (
    <>
      <HomeHero />
      <FieldsSection />
      {cases.length > 0 && (
        <section className="px-5 md:px-12 lg:px-14 pb-14 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <SectionHead title="업무사례" desc="의뢰인의 동의를 받은 사건만, 누구인지 알 수 없게 고쳐 싣습니다." href="/cases" />
            <CasesTable items={cases} />
          </div>
        </section>
      )}
      {diary.length > 0 && (
        <section className="bg-brand-paper px-5 md:px-12 lg:px-14 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <SectionHead title="감사일기" desc="사건이 끝난 뒤 의뢰인이 보내 주신 문자와 선물을 직원이 적어 둡니다." href="/diary" />
            <DiaryGrid entries={diary} />
          </div>
        </section>
      )}
      <MediaSection
        videos={videos}
        posts={posts}
        youtubeUrl={firmYoutubeChannelId ? `https://www.youtube.com/channel/${firmYoutubeChannelId}` : undefined}
        blogUrl={firmBlogId ? `https://blog.naver.com/${firmBlogId}` : undefined}
      />
      <PeopleSection />
      <MapSection />
    </>
  )
}
