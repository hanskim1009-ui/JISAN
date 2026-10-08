import { AboutPage, aboutMetadata } from "@/components/site-pages/about-page"

export const metadata = aboutMetadata("ru")

export default function Page() {
  return <AboutPage lang="ru" />
}
