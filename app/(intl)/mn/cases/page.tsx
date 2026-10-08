import { CasesPage, casesMetadata } from "@/components/site-pages/cases-pages"

export const metadata = casesMetadata("mn")
export const revalidate = 300

export default function Page() {
  return <CasesPage lang="mn" />
}
