import { InterestPage, interestMetadata } from "@/components/tools/pages/interest"

/** 번역 사전(content/tools/i18n/zh/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return interestMetadata("zh")
}

export default function Page() {
  return <InterestPage lang="zh" />
}
