import { getFileColumnIds } from "@/lib/content"
import { ColumnPage, columnMetadata } from "@/components/site-pages/column-pages"

type Props = { params: Promise<{ id: string }> }

// 파일 칼럼은 미리 만들고, 관리 화면에서 게시한 칼럼은 처음 열릴 때 만듭니다
export const dynamicParams = true
export const revalidate = 300

export function generateStaticParams() {
  return getFileColumnIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props) {
  return columnMetadata("ko", (await params).id)
}

export default async function Page({ params }: Props) {
  return <ColumnPage lang="ko" id={(await params).id} />
}
