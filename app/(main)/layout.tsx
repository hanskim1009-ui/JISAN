import { SiteHeader } from "@/components/main/site-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Footer } from "@/components/footer"
import { getCases, getColumns, getDiary } from "@/lib/content"

/** 메인 사이트(법인 전체) 공통 틀. 글이 없는 메뉴는 숨깁니다 */
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const flags = {
    showCases: (await getCases()).length > 0,
    showDiary: (await getDiary()).length > 0,
    showColumns: (await getColumns()).length > 0,
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
