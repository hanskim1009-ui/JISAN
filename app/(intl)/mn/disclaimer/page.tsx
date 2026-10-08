import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("mn", "disclaimer")

export default function Page() {
  return <LegalPage lang="mn" kind="disclaimer" />
}
