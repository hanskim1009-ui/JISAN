import { LegalPage, legalMetadata } from "@/components/site-pages/legal-pages"

export const metadata = legalMetadata("ru", "email-refuse")

export default function Page() {
  return <LegalPage lang="ru" kind="email-refuse" />
}
