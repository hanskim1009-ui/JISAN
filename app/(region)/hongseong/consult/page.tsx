import { RegionConsult, regionConsultMetadata } from "@/components/region/region-consult"

export const metadata = regionConsultMetadata("hongseong")

export default function Page() {
  return <RegionConsult slug="hongseong" />
}
