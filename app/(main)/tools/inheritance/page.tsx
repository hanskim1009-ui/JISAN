import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { InheritanceCalculator } from "@/components/tools/family/inheritance-calculator"

const TITLE = "상속분 계산기"
const DESC = "배우자·자녀·부모·형제자매 등 상속인을 넣으면 민법의 상속 순위와 배우자 1.5배 규칙에 따라 사람마다 받을 법정상속분을 분수와 금액으로 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/inheritance" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="유언이 없을 때 법이 정한 몫(법정상속분)을 계산합니다. 상속인과 재산 금액을 넣으면 사람마다 받을 비율과 금액이 바로 나옵니다."
      consultType="상속"
      notice="민법이 정한 비율에 따른 참고용 계산입니다. 유언, 상속 포기, 미리 받은 재산(특별수익), 기여분에 따라 실제로 받는 몫은 달라질 수 있습니다. 결정을 내리기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/reserved-share", label: "유류분 계산기" },
        { href: "/tools/child-support", label: "양육비 계산기" },
        { href: "/inheritance", label: "상속센터" },
        { href: "/divorce", label: "이혼센터" },
      ]}
    >
      <InheritanceCalculator />
    </ToolShell>
  )
}
