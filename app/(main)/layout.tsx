import { SiteHeader } from "@/components/main/site-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Footer } from "@/components/footer"
import { getCases, getDiary } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"

/** 메인 사이트(법인 전체) 공통 틀. 글이 없는 메뉴는 숨깁니다 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const flags = {
    showCases: getCases().length > 0,
    showDiary: getDiary().length > 0,
    showMedia: Boolean(siteConfig.feeds.firmBlogId || siteConfig.feeds.firmYoutubeChannelId),
  }
  return (
    <>
      <SiteHeader {...flags} />
      <FloatingCTA consultHref="/consult" />
      <BackToTop />
      <div className="pb-24 md:pb-0">
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </>
  )
}
