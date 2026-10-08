import { ColumnsPage, columnsMetadata } from "@/components/site-pages/column-pages"

export const metadata = columnsMetadata("ko")
export const revalidate = 300

export default function Page() {
  return <ColumnsPage lang="ko" />
}
