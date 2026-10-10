import { VisaDetailPage, visaDetailMetadata } from "@/components/visa/visa-pages"
import { visaStaticParams } from "@/lib/visa"

type Props = { params: Promise<{ code: string }> }

/** 번역 파일(content/visa/ko/{code}.json)이 있는 자격만 빌드 때 만듦 */
export const dynamicParams = false

export function generateStaticParams() {
  return visaStaticParams("ko")
}

export async function generateMetadata({ params }: Props) {
  return visaDetailMetadata("ko", (await params).code)
}

export default async function Page({ params }: Props) {
  return <VisaDetailPage lang="ko" slug={(await params).code} />
}
