import { DeadlinePage, deadlineMetadata } from "@/components/tools/pages/deadline"

/** 번역 사전(content/tools/i18n/ru/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return deadlineMetadata("ru")
}

export default function Page() {
  return <DeadlinePage lang="ru" />
}
