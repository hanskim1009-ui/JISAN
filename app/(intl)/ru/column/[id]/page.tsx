import { getFileColumnIds } from "@/lib/content"
import { ColumnPage, columnMetadata } from "@/components/site-pages/column-pages"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getFileColumnIds("ru").map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props) {
  return columnMetadata("ru", (await params).id)
}

export default async function Page({ params }: Props) {
  return <ColumnPage lang="ru" id={(await params).id} />
}
