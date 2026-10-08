import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("en", "email-refuse")

export default function Page() {
  return <LegalPage lang="en" kind="email-refuse" />
}
