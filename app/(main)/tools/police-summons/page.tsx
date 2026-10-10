import { PoliceSummonsPage, policeSummonsMetadata } from "@/components/tools/pages/police-summons"

export const metadata = policeSummonsMetadata("ko")

export default function Page() {
  return <PoliceSummonsPage lang="ko" />
}
