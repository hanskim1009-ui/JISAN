import { RegionConsult, regionConsultMetadata } from "@/components/region/region-consult"

export const metadata = regionConsultMetadata("ansan")

export default function Page() {
  return <RegionConsult slug="ansan" />
}
