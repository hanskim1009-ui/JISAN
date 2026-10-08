import { CasesPage, casesMetadata } from "@/components/site-pages/cases-pages"

export const metadata = casesMetadata("zh")
export const revalidate = 300

export default function Page() {
  return <CasesPage lang="zh" />
}
