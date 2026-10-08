import { LawyersPage, lawyersMetadata } from "@/components/site-pages/lawyers-page"

export const metadata = lawyersMetadata("ru")

export default function Page() {
  return <LawyersPage lang="ru" />
}
