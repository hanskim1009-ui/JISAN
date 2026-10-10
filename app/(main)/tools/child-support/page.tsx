import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { ChildSupportCalculator } from "@/components/tools/family/child-support-calculator"

const TITLE = "양육비 계산기"
const DESC = "자녀 나이와 부모 두 사람의 월 소득을 넣으면 2021년 양육비 산정기준표에 따른 표준양육비와, 소득 비율로 나눈 비양육자의 한 달 양육비를 바로 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/child-support" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="자녀 나이와 부모의 세전 월 소득을 넣으면, 법원의 양육비 산정기준표로 따로 사는 부모가 매달 보낼 양육비를 계산합니다."
      consultType="이혼"
      notice="법원 기준표에 따른 참고용 계산입니다. 실제 양육비는 아이의 생활 수준, 부모의 재산·빚, 양육 형태 같은 사정에 따라 법원이 달리 정할 수 있습니다. 결정을 내리기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/inheritance", label: "상속분 계산기" },
        { href: "/tools/reserved-share", label: "유류분 계산기" },
        { href: "/divorce", label: "이혼센터" },
        { href: "/inheritance", label: "상속센터" },
      ]}
    >
      <ChildSupportCalculator />
    </ToolShell>
  )
}
