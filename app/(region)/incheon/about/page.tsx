import { RegionAbout, regionAboutMetadata } from "@/components/region/region-about"

export const metadata = regionAboutMetadata("incheon")

export default function Page() {
  return <RegionAbout slug="incheon" />
}
