import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("zh", "email-refuse")

export default function Page() {
  return <LegalPage lang="zh" kind="email-refuse" />
}
