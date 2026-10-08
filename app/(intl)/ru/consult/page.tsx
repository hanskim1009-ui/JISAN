import { ConsultPage, consultMetadata } from "@/components/site-pages/consult-page"

export const metadata = consultMetadata("ru")

export default function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  return <ConsultPage lang="ru" searchParams={searchParams} />
}
