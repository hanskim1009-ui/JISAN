import { PoliceSummonsPage, policeSummonsMetadata } from "@/components/tools/pages/police-summons"

/** 번역 사전(content/tools/i18n/en/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return policeSummonsMetadata("en")
}

export default function Page() {
  return <PoliceSummonsPage lang="en" />
}
