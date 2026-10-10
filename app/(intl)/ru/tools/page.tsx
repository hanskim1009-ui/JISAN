import { ToolsListPage, toolsListMetadata } from "@/components/tools/pages/tools-list"

/** 번역된 계산기만 보이는 목록. 번역이 하나도 없으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return toolsListMetadata("ru")
}

export default function Page() {
  return <ToolsListPage lang="ru" />
}
