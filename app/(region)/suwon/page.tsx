import { RegionHome, regionHomeMetadata } from "@/components/region/region-home"

export const revalidate = 300
export const metadata = regionHomeMetadata("suwon")

export default function Page() {
  return <RegionHome slug="suwon" />
}
