import { VisaListPage, visaListMetadata } from "@/components/visa/visa-pages"

/** 체류자격별 안내 목록. 번역 파일(content/visa/ko/_ui.json)이 없으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return visaListMetadata("ko")
}

export default function Page() {
  return <VisaListPage lang="ko" />
}
