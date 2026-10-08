import { getCases } from "@/lib/content"
import { CasePage, caseMetadata } from "@/components/site-pages/cases-pages"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = true
export const revalidate = 300

export async function generateStaticParams() {
  return (await getCases({ lang: "en" })).map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props) {
  return caseMetadata("en", (await params).id)
}

export default async function Page({ params }: Props) {
  return <CasePage lang="en" id={(await params).id} />
}
