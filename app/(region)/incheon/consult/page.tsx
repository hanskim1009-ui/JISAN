import { RegionConsult, regionConsultMetadata } from "@/components/region/region-consult"

export const metadata = regionConsultMetadata("incheon")

export default function Page() {
  return <RegionConsult slug="incheon" />
}
