import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { ProsecutionCalculator } from "@/components/tools/prosecution/prosecution-calculator"
import { loadCrimes } from "@/lib/tools/prosecution-data"

const TITLE = "구형 예상 계산기"
const DESC = "죄명과 사건 사정을 고르면 수사기관의 일반적인 처리 경향에 비추어 예상되는 처리 단계(기소유예·약식 벌금·정식재판·구속)와 구형·벌금을 바로 보여 드립니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/prosecution" },
}

export default function Page() {
  // 빌드 때 읽고, 화면이 쓰는 필드만 넘김 (데이터에 다른 필드가 붙어 있어도 빼고)
  const crimes = loadCrimes().map(({ id, name, law, group, statutory, aliases, questions, tiers, notes }) => ({
    id,
    name,
    law,
    group,
    statutory,
    aliases,
    questions,
    tiers,
    notes,
  }))
  return (
    <ToolShell
      title={TITLE}
      lead="죄명을 고르고 몇 가지 질문에 답하면, 예상 처리 단계와 구형(재판에서 검사가 법원에 요청하는 형)·벌금을 보여 드립니다."
      consultType="형사"
      notice="수사기관의 일반적인 처리 경향을 바탕으로 한 예상일 뿐입니다. 실제 처분과 구형은 합의·전과·범행 경위 같은 사건 사정과 담당 검사의 판단에 따라 다르고, 최종 형은 법원이 정합니다. 조사를 앞두고 있다면 결과만 믿지 말고 변호사와 먼저 상의하세요."
      related={[
        { href: "/tools/sentencing", label: "선고형 예상 계산기 (양형기준)" },
        { href: "/tools/police-summons", label: "경찰 출석 요구 대응" },
        { href: "/crime", label: "형사 센터" },
      ]}
    >
      <ProsecutionCalculator crimes={crimes} />
    </ToolShell>
  )
}
