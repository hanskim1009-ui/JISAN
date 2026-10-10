import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { InterestCapCalculator } from "@/components/tools/civil/interest-cap-calculator"

const TITLE = "최고이자율 확인"
const DESC = "빌린 돈과 이자, 기간을 넣으면 연 이율로 바꿔 이자제한법·대부업법 최고이율(현재 연 20%)을 넘는지, 넘는 이자가 얼마인지 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/interest-cap" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="돈을 빌려주거나 빌릴 때 정한 이자가 법이 허용하는 최고이율을 넘는지 확인합니다. 선이자·수수료도 이자에 넣어 계산합니다."
      consultType="민사"
      notice="계약 당시 최고이율을 기준으로 한 참고용 계산입니다. 연체이자, 일부 변제, 계약 연장이 있으면 계산이 달라질 수 있습니다. 이미 낸 이자를 돌려받거나 원금에서 빼려면 변호사와 상의하세요."
      related={[
        { href: "/tools/interest", label: "지연이자 계산기" },
        { href: "/tools/court-fees", label: "소송비용 계산기" },
        { href: "/civil", label: "민사센터" },
      ]}
    >
      <InterestCapCalculator />
    </ToolShell>
  )
}
