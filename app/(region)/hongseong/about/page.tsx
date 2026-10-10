import { RegionAbout, regionAboutMetadata } from "@/components/region/region-about"

export const metadata = regionAboutMetadata("hongseong")

export default function Page() {
  return <RegionAbout slug="hongseong" />
}
