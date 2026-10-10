import { CrimePage, crimePageMetadata } from "@/components/tools/prosecution/crime-page"
import { crimePageIds } from "@/lib/tools/prosecution-page"

export const dynamicParams = false

/** 죄명 안내 페이지 (zh): 번역된 죄명만. 문구(content/tools/i18n/zh/prosecution-page.json)가 없으면 만들지 않음 */
export function generateStaticParams() {
  return crimePageIds("zh").map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return crimePageMetadata("zh", (await params).id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CrimePage lang="zh" id={(await params).id} />
}
