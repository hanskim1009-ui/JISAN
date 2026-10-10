import { RegionAbout, regionAboutMetadata } from "@/components/region/region-about"

export const metadata = regionAboutMetadata("suwon")

export default function Page() {
  return <RegionAbout slug="suwon" />
}
