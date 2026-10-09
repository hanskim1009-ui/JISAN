import { notFound } from "next/navigation"
import { centerBase, getCenter } from "@/lib/centers"
import { centerText, officeAddr, officeName } from "@/lib/center-i18n"
import { getCases, getColumns } from "@/lib/content"
import { getNaverBlogPosts } from "@/lib/feeds"
import { getCenterPages } from "@/lib/center-pages"
import { openOffices, siteConfig } from "@/lib/site-config"
import { lawyerI18n } from "@/lib/lawyers-i18n"
import { NEEDS_NOTO } from "@/lib/langs"
import { notoSans } from "@/lib/noto-font"
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
  const L = centerText(center.lang)
  const foreign = center.lang && center.lang !== "ko"
  // 페이지와 같은 요청이라 한 번만 가져옵니다. 불러오지 못하면 메뉴에서도 숨깁니다
  const hasBlog = center.blog ? (await getNaverBlogPosts(center.blog.id, 6)).length > 0 : false

  const base = centerBase(center)
  const hasGuides = (getCenterPages(center.slug)?.guides.length ?? 0) > 0
  // 상세 페이지에서도 센터 메인의 각 구역으로 가도록 주소에 센터 경로를 붙입니다
  const nav: CenterNavItem[] = [
    { label: L.navAreas, href: `${base}#areas` },
    ...(center.table ? [{ label: center.table.nav ?? center.table.title, href: `${base}#table` }] : []),
    { label: L.navProcess, href: `${base}#process` },
    ...(hasGuides ? [{ label: L.guides, href: `${base}#guides` }] : []),
    ...((await getCases({ center: center.slug })).length > 0 ? [{ label: L.navCases, href: `${base}#cases` }] : []),
    { label: L.navLawyers, href: `${base}#lawyers` },
    ...(hasBlog ? [{ label: L.navBlog, href: `${base}#blog` }] : []),
    ...((await getColumns({ center: center.slug })).length > 0 ? [{ label: L.navColumn, href: `${base}#column` }] : []),
    { label: L.faq, href: `${base}#faq` },
  ]

  return (
    <div lang={L.htmlLang} className={center.lang && NEEDS_NOTO.includes(center.lang) ? notoSans.className : undefined}>
      <CenterHeader name={center.name} tone={center.tone} nav={nav} homeHref={base} lang={center.lang} alternates={center.alternates} />
      <FloatingCTA consultHref="#consult" lang={center.lang} chatLabel={foreign ? L.chatTitle : undefined} />
      <BackToTop />
      <main id="top" lang={L.htmlLang}>
        {children}
      </main>
      {/* 광고 규정상 법인명·광고책임변호사는 표시. 센터 인상을 해치지 않도록 하단에 작게 */}
      <footer className={`px-6 md:px-12 lg:px-20 pt-8 pb-28 md:pb-8 text-xs leading-relaxed ${t.footer}`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <p>
              {foreign ? `${siteConfig.nameEn} (${siteConfig.name})` : siteConfig.name} · {foreign ? "" : `${L.callN(siteConfig.phone)} · `}{L.bizNo} {siteConfig.businessRegistration} · {L.adLawyer}{" "}
              {lawyerI18n("kim-hansol", center.lang)?.name ?? siteConfig.advertisingAttorney}
            </p>
            {openOffices.map((o) => (
              <p key={o.name}>
                {officeName(o.name, center.lang)} {officeAddr(o, center.lang)}
              </p>
            ))}
          </div>
          <p className="flex gap-4">
            <a href={foreign ? `/${center.lang}/privacy` : "/privacy"} className="hover:underline">{L.privacy}</a>
            <a href={foreign ? `/${center.lang}/disclaimer` : "/disclaimer"} className="hover:underline">{L.disclaimer}</a>
            <a href={foreign ? `/${center.lang}` : "/"} className="hover:underline">{L.firmHome}</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
