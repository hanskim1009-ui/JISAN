import { RegionHome, regionHomeMetadata } from "@/components/region/region-home"

export const revalidate = 300
export const metadata = regionHomeMetadata("ansan")

export default function Page() {
  return <RegionHome slug="ansan" />
}
