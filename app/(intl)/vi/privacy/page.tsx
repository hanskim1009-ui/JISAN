import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("vi", "privacy")

export default function Page() {
  return <LegalPage lang="vi" kind="privacy" />
}
