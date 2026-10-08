import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("zh", "disclaimer")

export default function Page() {
  return <LegalPage lang="zh" kind="disclaimer" />
}
