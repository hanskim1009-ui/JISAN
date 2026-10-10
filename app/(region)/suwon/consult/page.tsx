import { RegionConsult, regionConsultMetadata } from "@/components/region/region-consult"

export const metadata = regionConsultMetadata("suwon")

export default function Page() {
  return <RegionConsult slug="suwon" />
}
