import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("ru", "privacy")

export default function Page() {
  return <LegalPage lang="ru" kind="privacy" />
}
