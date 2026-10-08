import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("zh", "privacy")

export default function Page() {
  return <LegalPage lang="zh" kind="privacy" />
}
