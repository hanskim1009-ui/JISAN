import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("ko", "disclaimer")

export default function Page() {
  return <LegalPage lang="ko" kind="disclaimer" />
}
