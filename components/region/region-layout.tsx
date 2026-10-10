import Link from "next/link"
import { notFound } from "next/navigation"
import { getRegion, regionBase, visitOffices, type RegionSlug } from "@/lib/regions"
import { siteConfig } from "@/lib/site-config"
import { RegionHeader, type RegionNavItem } from "@/components/region/region-header"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"

/** 지역 홈페이지 공통 틀: 지역 머리글 · 하단 바 · 바닥글 (메인 사이트 머리글·바닥글은 쓰지 않음) */
export function RegionLayout({ slug, children }: { slug: RegionSlug; children: React.ReactNode }) {
  const region = getRegion(slug)
  if (!region) notFound()
  const base = regionBase(region)
  const nav: RegionNavItem[] = [
    { label: "소개", href: `${base}/about` },
    { label: "분야", href: `${base}#centers` },
    { label: "변호사", href: `${base}#lawyer` },
    { label: "상담", href: `${base}/consult` },
  ]
  const offices = visitOffices(region)

  return (
    <>
      <RegionHeader name={region.name} homeHref={base} nav={nav} consultHref={`${base}/consult`} />
      <FloatingCTA consultHref={`${base}/consult`} />
      <BackToTop />
      <main id="main-content">{children}</main>
      {/* 광고 규정상 상호·광고책임변호사·사업자등록번호는 표시. 사무소는 주소가 있는 곳만 */}
      <footer className="bg-[#10172B] px-5 pt-10 pb-28 text-xs leading-relaxed text-white/55 md:px-12 md:pb-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold text-white/85">
              {siteConfig.name} <span className="font-extrabold text-white">{region.name}</span>
            </p>
            <p>
              대표 전화 {siteConfig.phone} · 사업자등록번호 {siteConfig.businessRegistration} · 광고책임변호사 {siteConfig.advertisingAttorney}
            </p>
            {offices.map((o) => (
              <p key={o.name}>
                {o.name} {o.address}
              </p>
            ))}
          </div>
          <nav aria-label="바닥글 링크" className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            <Link href={`${base}/about`} className="hover:underline">변호사 소개</Link>
            <Link href={`${base}/consult`} className="hover:underline">상담 신청</Link>
            <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
            <Link href="/disclaimer" className="hover:underline">면책공고</Link>
            <Link href="/" className="hover:underline">{siteConfig.name} 홈</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
