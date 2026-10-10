import { CrimeIndexPage, crimeIndexMetadata } from "@/components/tools/prosecution/crime-page"

/** 문구가 없으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return crimeIndexMetadata("zh")
}

export default function Page() {
  return <CrimeIndexPage lang="zh" />
}
