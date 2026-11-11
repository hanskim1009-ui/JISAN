import { lawyers } from "@/lib/lawyers"
import { LawyerProfilePage, lawyerProfileMetadata } from "@/components/site-pages/lawyer-profile-page"

type Props = { params: Promise<{ lawyer: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return lawyers.map((l) => ({ lawyer: l.slug }))
}

export async function generateMetadata({ params }: Props) {
  return lawyerProfileMetadata("mn", (await params).lawyer)
}

export default async function Page({ params }: Props) {
  return <LawyerProfilePage lang="mn" slug={(await params).lawyer} />
}
