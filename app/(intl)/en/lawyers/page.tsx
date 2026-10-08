import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("en")

export default function Page() {
  return <LawyersPage lang="en" />
}
