import { HomePage, homeMetadata } from "@/components/site-pages/home-page"

export const revalidate = 300
export const metadata = homeMetadata("ru")

export default function Page() {
  return <HomePage lang="ru" />
}
