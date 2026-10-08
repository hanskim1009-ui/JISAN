import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("mn", "email-refuse")

export default function Page() {
  return <LegalPage lang="mn" kind="email-refuse" />
}
