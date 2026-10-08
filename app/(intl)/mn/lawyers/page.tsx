import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("mn")

export default function Page() {
  return <LawyersPage lang="mn" />
}
