import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("ru", "disclaimer")

export default function Page() {
  return <LegalPage lang="ru" kind="disclaimer" />
}
