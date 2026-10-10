import { CrimePage, crimePageMetadata } from "@/components/tools/prosecution/crime-page"
import { crimePageIds } from "@/lib/tools/prosecution-page"

export const dynamicParams = false

/** 죄명 안내 페이지 (죄명마다 하나, 빌드 때 만들어 둠) */
export function generateStaticParams() {
  return crimePageIds("ko").map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return crimePageMetadata("ko", (await params).id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CrimePage lang="ko" id={(await params).id} />
}
