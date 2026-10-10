import { ChildSupportPage, childSupportMetadata } from "@/components/tools/pages/child-support"

/** 번역 사전(content/tools/i18n/vi/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return childSupportMetadata("vi")
}

export default function Page() {
  return <ChildSupportPage lang="vi" />
}
