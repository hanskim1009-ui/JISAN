import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("zh")

export default function Page() {
  return <LawyersPage lang="zh" />
}
