import { SiteLayout } from "@/components/site-pages/site-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="zh">{children}</SiteLayout>
}
