import { ConsultPage, consultMetadata } from "@/components/site-pages/consult-page"

export const metadata = consultMetadata("vi")

export default function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  return <ConsultPage lang="vi" searchParams={searchParams} />
}
