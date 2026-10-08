import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("vi")

export default function Page() {
  return <LawyersPage lang="vi" />
}
