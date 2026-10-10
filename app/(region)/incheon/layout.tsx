import { RegionLayout } from "@/components/region/region-layout"

/** 지역 홈페이지 틀 (내용은 lib/regions.ts) */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RegionLayout slug="incheon">{children}</RegionLayout>
}
