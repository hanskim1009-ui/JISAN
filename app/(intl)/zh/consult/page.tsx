import { ConsultPage, consultMetadata } from "@/components/site-pages/consult-page"

export const metadata = consultMetadata("zh")

export default function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  return <ConsultPage lang="zh" searchParams={searchParams} />
}
