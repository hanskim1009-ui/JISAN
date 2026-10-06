import { SiteHeader } from "@/components/main/site-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { Footer } from "@/components/footer"

/** 메인 사이트(법인 전체) 공통 틀 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <FloatingCTA />
      <BackToTop />
      <div className="pb-24 md:pb-0">
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </>
  )
}
