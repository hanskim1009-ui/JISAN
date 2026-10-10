import { CrimePage, crimePageMetadata } from "@/components/tools/prosecution/crime-page"
import { crimePageIds } from "@/lib/tools/prosecution-page"

export const dynamicParams = false

/** 죄명 안내 페이지 (mn): 번역된 죄명만. 문구(content/tools/i18n/mn/prosecution-page.json)가 없으면 만들지 않음 */
export function generateStaticParams() {
  return crimePageIds("mn").map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return crimePageMetadata("mn", (await params).id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CrimePage lang="mn" id={(await params).id} />
}
