import { notFound } from "next/navigation"
import { getCenter } from "@/lib/centers"
import { getCases, getColumns } from "@/lib/content"
import { getNaverBlogPosts } from "@/lib/feeds"
import { getCenterPages } from "@/lib/center-pages"
import { officeAddress, openOffices, siteConfig } from "@/lib/site-config"
import { CenterHeader, type CenterNavItem } from "@/components/center/center-header"
import { centerTones } from "@/components/center/tone"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"

/** 센터 사이트 공통 틀: 센터 전용 헤더·하단 바·하단 법인 표기 */
export default async function CenterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ center: string }>
}) {
  const { center: slug } = await params
  const center = getCenter(slug)
  if (!center) notFound()
  const t = centerTones[center.tone]
  // 페이지와 같은 요청이라 한 번만 가져옵니다. 불러오지 못하면 메뉴에서도 숨깁니다
  const hasBlog = center.blog ? (await getNaverBlogPosts(center.blog.id, 6)).length > 0 : false

  const base = `/${center.slug}`
  const hasGuides = (getCenterPages(center.slug)?.guides.length ?? 0) > 0
  // 상세 페이지에서도 센터 메인의 각 구역으로 가도록 주소에 센터 경로를 붙입니다
  const nav: CenterNavItem[] = [
    { label: "업무분야", href: `${base}#areas` },
    ...(center.table ? [{ label: center.table.nav ?? center.table.title, href: `${base}#table` }] : []),
    { label: "진행 절차", href: `${base}#process` },
    ...(hasGuides ? [{ label: "상황별 안내", href: `${base}#guides` }] : []),
    ...((await getCases({ center: center.slug })).length > 0 ? [{ label: "업무사례", href: `${base}#cases` }] : []),
    { label: "변호사", href: `${base}#lawyers` },
    ...(hasBlog ? [{ label: "블로그", href: `${base}#blog` }] : []),
    ...((await getColumns({ center: center.slug })).length > 0 ? [{ label: "칼럼", href: `${base}#column` }] : []),
    { label: "자주 묻는 질문", href: `${base}#faq` },
  ]

  return (
    <>
      <CenterHeader name={center.name} tone={center.tone} nav={nav} homeHref={base} />
      <FloatingCTA consultHref="#consult" />
      <BackToTop />
      <main id="top">
        {children}
      </main>
      {/* 광고 규정상 법인명·광고책임변호사는 표시. 센터 인상을 해치지 않도록 하단에 작게 */}
      <footer className={`px-6 md:px-12 lg:px-20 pt-8 pb-28 md:pb-8 text-xs leading-relaxed ${t.footer}`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>
              {siteConfig.name} · 전화 {siteConfig.phone} · 사업자등록번호 {siteConfig.businessRegistration} · 광고책임변호사{" "}
              {siteConfig.advertisingAttorney}
            </p>
            {openOffices.map((o) => (
              <p key={o.name}>
                {o.name} {officeAddress(o)}
              </p>
            ))}
          </div>
          <p className="flex gap-4">
            <a href="/privacy" className="hover:underline">개인정보처리방침</a>
            <a href="/disclaimer" className="hover:underline">면책공고</a>
            <a href="/" className="hover:underline">법인 홈페이지</a>
          </p>
        </div>
      </footer>
    </>
  )
}
