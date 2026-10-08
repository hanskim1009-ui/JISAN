import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("ko", "email-refuse")

export default function Page() {
  return <LegalPage lang="ko" kind="email-refuse" />
}
