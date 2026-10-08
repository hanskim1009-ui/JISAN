import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("mn", "privacy")

export default function Page() {
  return <LegalPage lang="mn" kind="privacy" />
}
