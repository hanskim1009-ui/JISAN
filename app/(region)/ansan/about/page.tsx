import { RegionAbout, regionAboutMetadata } from "@/components/region/region-about"

export const metadata = regionAboutMetadata("ansan")

export default function Page() {
  return <RegionAbout slug="ansan" />
}
