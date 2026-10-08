import { SiteLayout } from "@/components/site-pages/site-layout"

/** 한국어 메인 사이트 틀 (외국어는 app/(intl)/{언어}/layout.tsx 에서 같은 틀을 씀) */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="ko">{children}</SiteLayout>
}
