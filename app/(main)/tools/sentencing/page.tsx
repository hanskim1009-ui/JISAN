import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { SentencingCalculator } from "@/components/tools/sentencing/sentencing-calculator"
import { loadIndex } from "@/lib/tools/sentencing-data"

const TITLE = "선고형 예상 계산기 (양형기준)"
const DESC = "범죄와 유형, 양형인자를 고르면 2026년 양형기준에 따른 권고 형량범위(감경·기본·가중)와 특별 조정, 집행유예 권고 여부를 바로 보여 드립니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/sentencing" },
}

export default function Page() {
  // 처음엔 범죄군 이름·세부 범죄 이름만 넘기고, 고른 범죄군 데이터는 /tools/sentencing/data/{id} 에서 받음
  const groups = loadIndex()
  return (
    <ToolShell
      title={TITLE}
      lead="범죄를 고르고 유형과 양형인자(형을 정할 때 따지는 사정)를 체크하면, 양형기준이 권고하는 형량범위와 집행유예 권고 여부를 보여 드립니다."
      consultType="형사"
      notice="2026년 양형기준(양형위원회)을 바탕으로 한 참고 계산입니다. 양형기준은 법관이 참고하는 권고 기준이며 실제 선고형은 다를 수 있습니다. 어떤 인자가 인정될지는 증거와 사건 사정에 따라 달라지니, 재판을 앞두고 있다면 변호사와 먼저 상의하세요."
      related={[
        { href: "/tools/prosecution", label: "구형 예상 계산기" },
        { href: "/tools/drunk-driving", label: "음주운전 처벌 기준 확인" },
        { href: "/crime", label: "형사 센터" },
      ]}
    >
      <SentencingCalculator groups={groups} />
    </ToolShell>
  )
}
