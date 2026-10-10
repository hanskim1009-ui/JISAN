import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { ReservedShareCalculator } from "@/components/tools/family/reserved-share-calculator"

const TITLE = "유류분 계산기"
const DESC = "상속인과 상속재산·생전 증여·빚을 넣으면 유류분 기초재산과 상속인별 유류분 비율·금액을 계산합니다. 2024년 헌법재판소 결정에 따라 형제자매의 유류분은 넣지 않습니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/reserved-share" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="유류분은 유언이나 생전 증여가 있어도 법이 상속인에게 최소한 보장하는 몫입니다. 상속인과 재산을 넣으면 사람마다 보장되는 금액을 계산합니다."
      consultType="상속"
      notice="민법이 정한 비율에 따른 참고용 계산입니다. 어떤 증여를 넣을지, 재산을 얼마로 볼지, 실제로 돌려받을 부족액이 얼마인지는 사건마다 다르게 판단됩니다. 청구 기간도 짧으니 결정을 내리기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/inheritance", label: "상속분 계산기" },
        { href: "/tools/child-support", label: "양육비 계산기" },
        { href: "/inheritance", label: "상속센터" },
        { href: "/divorce", label: "이혼센터" },
      ]}
    >
      <ReservedShareCalculator />
    </ToolShell>
  )
}
