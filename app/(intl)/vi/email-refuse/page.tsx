import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("vi", "email-refuse")

export default function Page() {
  return <LegalPage lang="vi" kind="email-refuse" />
}
