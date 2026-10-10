import type { Metadata } from "next"
import { ToolShell } from "@/components/tools/tool-shell"
import { InterestCalculator } from "@/components/tools/civil/interest-calculator"

const TITLE = "지연이자 계산기"
const DESC = "원금과 기간, 이율(민사 연 5%, 상사 연 6%, 소송촉진법 이율, 약정 이율)을 넣으면 기간별 이자와 합계를 계산합니다. 이율이 바뀐 날을 걸치면 나눠 계산합니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/tools/interest" },
}

export default function Page() {
  return (
    <ToolShell
      title={TITLE}
      lead="돈을 늦게 갚을 때 붙는 이자(지연손해금)를 계산합니다. 원금·기간·이율을 넣으면 기간별 이자와 합계가 바로 나옵니다."
      consultType="민사"
      notice="법정이율을 기준으로 한 참고용 계산입니다. 일부를 갚았거나 판결에서 기간·이율을 따로 정한 경우에는 실제 금액이 달라집니다. 받을 돈이나 갚을 돈을 정하기 전에 변호사와 상의하세요."
      related={[
        { href: "/tools/court-fees", label: "소송비용 계산기" },
        { href: "/tools/interest-cap", label: "최고이자율 확인" },
        { href: "/tools/deadline", label: "법정 기한 계산기" },
        { href: "/civil", label: "민사센터" },
      ]}
    >
      <InterestCalculator />
    </ToolShell>
  )
}
