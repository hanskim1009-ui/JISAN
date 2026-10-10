import { CourtFeesPage, courtFeesMetadata } from "@/components/tools/pages/court-fees"

/** 번역 사전(content/tools/i18n/en/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return courtFeesMetadata("en")
}

export default function Page() {
  return <CourtFeesPage lang="en" />
}
