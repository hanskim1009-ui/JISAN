import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("ko")

export default function Page() {
  return <LawyersPage lang="ko" />
}
